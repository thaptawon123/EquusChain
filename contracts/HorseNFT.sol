// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HorseNFT - Decentralized Thoroughbred & Racehorse ERC-721
 * @author EquusChain Protocol
 * @notice Verifiable on-chain pedigree horse token with genetic stats, breeding, and racing capabilities.
 */

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

contract HorseNFT {
    // Token details
    string public name = "EquusChain Racehorses";
    string public symbol = "EQUUS";
    string public baseTokenURI;
    
    address public owner;
    uint256 public nextTokenId = 1;
    uint256 public constant MINT_PRICE = 0.05 ether;
    uint256 public constant MAX_SUPPLY = 10000;

    // Horse Data Structures
    enum Bloodline {
        Thoroughbred,
        Arabian,
        Andalusian,
        Pegasus,
        Mustang
    }

    enum Gender {
        Stallion,
        Mare
    }

    struct HorseStats {
        string name;
        Bloodline bloodline;
        Gender gender;
        uint8 generation;       // 0 = Genesis
        uint8 speed;            // 1 - 100
        uint8 stamina;          // 1 - 100
        uint8 agility;          // 1 - 100
        uint8 temperament;      // 1 - 100
        uint16 racesWon;
        uint16 totalRaces;
        uint256 birthTime;
        uint256 sireId;         // Father Token ID
        uint256 damId;          // Mother Token ID
        bytes32 dnaHash;
        string imageURI;
    }

    // Mappings
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    mapping(uint256 => HorseStats) public horses;
    mapping(uint256 => string) private _tokenURIs;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event HorseMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        Bloodline bloodline,
        uint8 generation
    );
    event HorseBred(
        uint256 indexed childTokenId,
        uint256 indexed sireId,
        uint256 indexed damId,
        address indexed breeder
    );
    event HorseStatsTrained(uint256 indexed tokenId, uint8 speed, uint8 stamina);

    modifier onlyOwner() {
        require(msg.sender == owner, "HorseNFT: caller is not the owner");
        _;
    }

    constructor(string memory _baseURI) {
        owner = msg.sender;
        baseTokenURI = _baseURI;
    }

    // --- Minting Functions ---

    /**
     * @notice Mint a new Genesis horse (Public Mint with ETH)
     */
    function mintHorse(
        string memory horseName,
        Bloodline bloodline,
        Gender gender,
        string memory customImageURI
    ) external payable returns (uint256) {
        require(nextTokenId <= MAX_SUPPLY, "HorseNFT: Max supply reached");
        require(msg.value >= MINT_PRICE, "HorseNFT: Insufficient payment (0.05 ETH required)");
        require(bytes(horseName).length > 0, "HorseNFT: Name cannot be empty");

        uint256 tokenId = nextTokenId++;

        // Pseudorandom attribute generation based on block data & sender
        bytes32 dna = keccak256(
            abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, tokenId)
        );

        uint8 speed = uint8(70 + (uint256(dna) % 28));
        uint8 stamina = uint8(65 + ((uint256(dna) >> 8) % 32));
        uint8 agility = uint8(68 + ((uint256(dna) >> 16) % 30));
        uint8 temperament = uint8(60 + ((uint256(dna) >> 24) % 38));

        horses[tokenId] = HorseStats({
            name: horseName,
            bloodline: bloodline,
            gender: gender,
            generation: 0,
            speed: speed,
            stamina: stamina,
            agility: agility,
            temperament: temperament,
            racesWon: 0,
            totalRaces: 0,
            birthTime: block.timestamp,
            sireId: 0,
            damId: 0,
            dnaHash: dna,
            imageURI: customImageURI
        });

        _mint(msg.sender, tokenId);

        emit HorseMinted(tokenId, msg.sender, horseName, bloodline, 0);
        return tokenId;
    }

    /**
     * @notice Breed two horses to produce an offspring NFT
     */
    function breedHorses(
        uint256 sireId,
        uint256 damId,
        string memory foalName
    ) external payable returns (uint256) {
        require(msg.value >= 0.08 ether, "HorseNFT: Breeding fee 0.08 ETH");
        require(_owners[sireId] == msg.sender, "HorseNFT: Must own sire");
        require(_owners[damId] == msg.sender, "HorseNFT: Must own dam");
        require(horses[sireId].gender == Gender.Stallion, "HorseNFT: Sire must be male");
        require(horses[damId].gender == Gender.Mare, "HorseNFT: Dam must be female");

        uint256 tokenId = nextTokenId++;
        bytes32 childDna = keccak256(
            abi.encodePacked(horses[sireId].dnaHash, horses[damId].dnaHash, block.timestamp)
        );

        uint8 childGen = (horses[sireId].generation > horses[damId].generation
            ? horses[sireId].generation
            : horses[damId].generation) + 1;

        // Blend attributes from parents with mutation chance
        uint8 speed = uint8((uint16(horses[sireId].speed) + uint16(horses[damId].speed)) / 2);
        uint8 stamina = uint8((uint16(horses[sireId].stamina) + uint16(horses[damId].stamina)) / 2);
        uint8 agility = uint8((uint16(horses[sireId].agility) + uint16(horses[damId].agility)) / 2);

        // Small random genetic mutation (+- 5)
        int8 mutation = int8(int256(uint256(childDna) % 11)) - 5;
        speed = uint8(_clamp(int16(speed) + mutation, 60, 99));

        horses[tokenId] = HorseStats({
            name: foalName,
            bloodline: horses[sireId].bloodline,
            gender: (uint256(childDna) % 2 == 0) ? Gender.Stallion : Gender.Mare,
            generation: childGen,
            speed: speed,
            stamina: stamina,
            agility: agility,
            temperament: 75,
            racesWon: 0,
            totalRaces: 0,
            birthTime: block.timestamp,
            sireId: sireId,
            damId: damId,
            dnaHash: childDna,
            imageURI: horses[sireId].imageURI
        });

        _mint(msg.sender, tokenId);

        emit HorseBred(tokenId, sireId, damId, msg.sender);
        return tokenId;
    }

    /**
     * @notice Train horse to increase its physical stats
     */
    function trainHorse(uint256 tokenId) external payable {
        require(_owners[tokenId] == msg.sender, "HorseNFT: Not owner");
        require(msg.value >= 0.01 ether, "HorseNFT: Training fee 0.01 ETH");
        require(horses[tokenId].speed < 99, "HorseNFT: Max stats reached");

        horses[tokenId].speed += 1;
        horses[tokenId].stamina += 1;

        emit HorseStatsTrained(tokenId, horses[tokenId].speed, horses[tokenId].stamina);
    }

    // --- View Functions ---

    function getHorse(uint256 tokenId) external view returns (HorseStats memory) {
        require(_owners[tokenId] != address(0), "HorseNFT: Horse does not exist");
        return horses[tokenId];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "HorseNFT: owner query for nonexistent token");
        return tokenOwner;
    }

    function balanceOf(address account) external view returns (uint256) {
        require(account != address(0), "HorseNFT: balance query for zero address");
        return _balances[account];
    }

    // --- Standard ERC-721 Core ---

    function approve(address to, uint256 tokenId) external {
        address tokenOwner = ownerOf(tokenId);
        require(to != tokenOwner, "HorseNFT: approval to current owner");
        require(
            msg.sender == tokenOwner || isApprovedForAll(tokenOwner, msg.sender),
            "HorseNFT: caller is not token owner or approved operator"
        );
        _tokenApprovals[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        require(_owners[tokenId] != address(0), "HorseNFT: approved query for nonexistent token");
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) external {
        require(operator != msg.sender, "HorseNFT: approve to caller");
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address tokenOwner, address operator) public view returns (bool) {
        return _operatorApprovals[tokenOwner][operator];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "HorseNFT: caller is not token owner or approved");
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        transferFrom(from, to, tokenId);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address tokenOwner = ownerOf(tokenId);
        return (spender == tokenOwner || isApprovedForAll(tokenOwner, spender) || getApproved(tokenId) == spender);
    }

    function _transfer(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "HorseNFT: transfer from incorrect owner");
        require(to != address(0), "HorseNFT: transfer to zero address");

        // Clear approval
        delete _tokenApprovals[tokenId];

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "HorseNFT: mint to zero address");
        _balances[to] += 1;
        _owners[tokenId] = to;
        emit Transfer(address(0), to, tokenId);
    }

    function _clamp(int16 val, int16 minVal, int16 maxVal) private pure returns (int16) {
        if (val < minVal) return minVal;
        if (val > maxVal) return maxVal;
        return val;
    }

    // --- Admin / Withdrawal ---

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "HorseNFT: No funds to withdraw");
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "HorseNFT: Withdraw failed");
    }
}
