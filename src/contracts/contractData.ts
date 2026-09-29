export const HORSE_NFT_CONTRACT_ADDRESS = "0x892e84742a225AcffA5E4E30c8227Ac8D71221B2";
export const MARKETPLACE_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const HORSE_NFT_SOL = `// SPDX-License-Identifier: MIT
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
    string public name = "EquusChain Racehorses";
    string public symbol = "EQUUS";
    string public baseTokenURI;
    
    address public owner;
    uint256 public nextTokenId = 1;
    uint256 public constant MINT_PRICE = 0.05 ether;
    uint256 public constant MAX_SUPPLY = 10000;

    enum Bloodline { Thoroughbred, Arabian, Andalusian, Pegasus, Mustang }
    enum Gender { Stallion, Mare }

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
        uint256 sireId;
        uint256 damId;
        bytes32 dnaHash;
        string imageURI;
    }

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    mapping(uint256 => HorseStats) public horses;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event HorseMinted(uint256 indexed tokenId, address indexed owner, string name, Bloodline bloodline, uint8 generation);
    event HorseBred(uint256 indexed childTokenId, uint256 indexed sireId, uint256 indexed damId, address indexed breeder);
    event HorseStatsTrained(uint256 indexed tokenId, uint8 speed, uint8 stamina);

    modifier onlyOwner() {
        require(msg.sender == owner, "HorseNFT: caller is not the owner");
        _;
    }

    constructor(string memory _baseURI) {
        owner = msg.sender;
        baseTokenURI = _baseURI;
    }

    function mintHorse(
        string memory horseName,
        Bloodline bloodline,
        Gender gender,
        string memory customImageURI
    ) external payable returns (uint256) {
        require(nextTokenId <= MAX_SUPPLY, "HorseNFT: Max supply reached");
        require(msg.value >= MINT_PRICE, "HorseNFT: Insufficient payment (0.05 ETH)");
        require(bytes(horseName).length > 0, "HorseNFT: Name empty");

        uint256 tokenId = nextTokenId++;
        bytes32 dna = keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, tokenId));

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

    function trainHorse(uint256 tokenId) external payable {
        require(_owners[tokenId] == msg.sender, "HorseNFT: Not owner");
        require(msg.value >= 0.01 ether, "HorseNFT: Training fee 0.01 ETH");
        require(horses[tokenId].speed < 99, "HorseNFT: Max stats");

        horses[tokenId].speed += 1;
        horses[tokenId].stamina += 1;
        emit HorseStatsTrained(tokenId, horses[tokenId].speed, horses[tokenId].stamina);
    }

    function getHorse(uint256 tokenId) external view returns (HorseStats memory) {
        require(_owners[tokenId] != address(0), "Nonexistent token");
        return horses[tokenId];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "Nonexistent token");
        return tokenOwner;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_owners[tokenId] == from, "Transfer from incorrect owner");
        require(to != address(0), "Transfer to zero");
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;
        emit Transfer(from, to, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal {
        _balances[to] += 1;
        _owners[tokenId] = to;
        emit Transfer(address(0), to, tokenId);
    }
}`;

export const HORSE_MARKETPLACE_SOL = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HorseMarketplace - Decentralized Equestrian NFT Exchange
 * @author EquusChain Protocol
 */

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

contract HorseMarketplace {
    address public owner;
    uint256 public platformFeeBasisPoints = 250; // 2.5% fee

    struct Listing {
        address seller;
        address nftAddress;
        uint256 tokenId;
        uint256 price;       // in wei
        bool active;
        uint256 listedAt;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    event HorseListed(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
    event HorseSold(address indexed buyer, address indexed seller, address indexed nftAddress, uint256 tokenId, uint256 price);
    event ListingCancelled(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);

    constructor() {
        owner = msg.sender;
    }

    function listItem(address nftAddress, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be > 0");
        require(IERC721(nftAddress).ownerOf(tokenId) == msg.sender, "Not owner");

        listings[nftAddress][tokenId] = Listing({
            seller: msg.sender,
            nftAddress: nftAddress,
            tokenId: tokenId,
            price: price,
            active: true,
            listedAt: block.timestamp
        });

        emit HorseListed(msg.sender, nftAddress, tokenId, price);
    }

    function buyItem(address nftAddress, uint256 tokenId) external payable {
        Listing memory listing = listings[nftAddress][tokenId];
        require(listing.active, "Item not for sale");
        require(msg.value >= listing.price, "Insufficient payment");

        listings[nftAddress][tokenId].active = false;

        uint256 platformFee = (listing.price * platformFeeBasisPoints) / 10000;
        uint256 sellerProceeds = listing.price - platformFee;

        payable(listing.seller).transfer(sellerProceeds);
        IERC721(nftAddress).transferFrom(listing.seller, msg.sender, tokenId);

        emit HorseSold(msg.sender, listing.seller, nftAddress, tokenId, listing.price);
    }

    function cancelListing(address nftAddress, uint256 tokenId) external {
        Listing memory listing = listings[nftAddress][tokenId];
        require(listing.active && listing.seller == msg.sender, "Unauthorized");
        listings[nftAddress][tokenId].active = false;
        emit ListingCancelled(msg.sender, nftAddress, tokenId);
    }
}`;

export const NFT_ABI = [
  "function mintHorse(string horseName, uint8 bloodline, uint8 gender, string customImageURI) external payable returns (uint256)",
  "function trainHorse(uint256 tokenId) external payable",
  "function breedHorses(uint256 sireId, uint256 damId, string foalName) external payable returns (uint256)",
  "function getHorse(uint256 tokenId) external view returns (tuple(string name, uint8 bloodline, uint8 gender, uint8 generation, uint8 speed, uint8 stamina, uint8 agility, uint8 temperament, uint16 racesWon, uint16 totalRaces, uint256 birthTime, uint256 sireId, uint256 damId, bytes32 dnaHash, string imageURI))",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transferFrom(address from, address to, uint256 tokenId) public"
];

export const MARKETPLACE_ABI = [
  "function listItem(address nftAddress, uint256 tokenId, uint256 price) external",
  "function buyItem(address nftAddress, uint256 tokenId) external payable",
  "function cancelListing(address nftAddress, uint256 tokenId) external",
  "function updateListing(address nftAddress, uint256 tokenId, uint256 newPrice) external",
  "function getListing(address nftAddress, uint256 tokenId) external view returns (tuple(address seller, address nftAddress, uint256 tokenId, uint256 price, bool active, uint256 listedAt))"
];
