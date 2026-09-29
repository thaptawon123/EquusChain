// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HorseMarketplace - Decentralized Equestrian NFT Exchange
 * @author EquusChain Protocol
 * @notice Trustless marketplace for listing, purchasing, and auctioning tokenized horses.
 */

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function getApproved(uint256 tokenId) external view returns (address);
}

contract HorseMarketplace {
    address public owner;
    uint256 public platformFeeBasisPoints = 250; // 2.5% fee
    uint256 public constant BASIS_POINTS_DENOMINATOR = 10000;

    struct Listing {
        address seller;
        address nftAddress;
        uint256 tokenId;
        uint256 price;       // in wei
        bool active;
        uint256 listedAt;
    }

    struct Offer {
        address bidder;
        uint256 amount;
        uint256 expiresAt;
    }

    // Listings: nftAddress => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) public listings;
    
    // Offers: nftAddress => tokenId => Offer[]
    mapping(address => mapping(uint256 => Offer[])) private _offers;

    // Reentrancy lock
    uint8 private _unlocked = 1;
    modifier nonReentrant() {
        require(_unlocked == 1, "Marketplace: REENTRANCY");
        _unlocked = 0;
        _;
        _unlocked = 1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Marketplace: Not owner");
        _;
    }

    event HorseListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price,
        uint256 timestamp
    );

    event HorseSold(
        address indexed buyer,
        address indexed seller,
        address indexed nftAddress,
        uint256 tokenId,
        uint256 price,
        uint256 fee
    );

    event ListingCancelled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ListingPriceUpdated(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 newPrice
    );

    event OfferCreated(
        address indexed bidder,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 amount
    );

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice List an equine NFT on the marketplace
     * @param nftAddress Address of the Horse NFT contract
     * @param tokenId ID of the horse token
     * @param price Listing price in Wei (ETH)
     */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external {
        require(price > 0, "Marketplace: Price must be greater than 0");
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Marketplace: Caller does not own horse");
        require(
            nft.isApprovedForAll(msg.sender, address(this)) || nft.getApproved(tokenId) == address(this),
            "Marketplace: Marketplace not approved to transfer NFT"
        );

        listings[nftAddress][tokenId] = Listing({
            seller: msg.sender,
            nftAddress: nftAddress,
            tokenId: tokenId,
            price: price,
            active: true,
            listedAt: block.timestamp
        });

        emit HorseListed(msg.sender, nftAddress, tokenId, price, block.timestamp);
    }

    /**
     * @notice Purchase a listed horse directly with ETH
     * @param nftAddress Address of the Horse NFT contract
     * @param tokenId Token ID to purchase
     */
    function buyItem(
        address nftAddress,
        uint256 tokenId
    ) external payable nonReentrant {
        Listing memory listing = listings[nftAddress][tokenId];
        require(listing.active, "Marketplace: Item is not for sale");
        require(msg.value >= listing.price, "Marketplace: Insufficient ETH sent");

        // Mark inactive first (Checks-Effects-Interactions)
        listings[nftAddress][tokenId].active = false;

        uint256 platformFee = (listing.price * platformFeeBasisPoints) / BASIS_POINTS_DENOMINATOR;
        uint256 sellerProceeds = listing.price - platformFee;

        // Transfer funds to seller
        (bool sellerSent, ) = payable(listing.seller).call{value: sellerProceeds}("");
        require(sellerSent, "Marketplace: Failed to pay seller");

        // Transfer NFT to buyer
        IERC721(nftAddress).transferFrom(listing.seller, msg.sender, tokenId);

        // Refund any excess payment
        if (msg.value > listing.price) {
            (bool refundSent, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refundSent, "Marketplace: Refund failed");
        }

        emit HorseSold(msg.sender, listing.seller, nftAddress, tokenId, listing.price, platformFee);
    }

    /**
     * @notice Cancel an existing horse listing
     */
    function cancelListing(address nftAddress, uint256 tokenId) external {
        Listing memory listing = listings[nftAddress][tokenId];
        require(listing.active, "Marketplace: Listing not active");
        require(listing.seller == msg.sender || msg.sender == owner, "Marketplace: Not seller");

        listings[nftAddress][tokenId].active = false;
        emit ListingCancelled(msg.sender, nftAddress, tokenId);
    }

    /**
     * @notice Update listing price for a horse
     */
    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    ) external {
        require(newPrice > 0, "Marketplace: Price must be > 0");
        Listing memory listing = listings[nftAddress][tokenId];
        require(listing.active, "Marketplace: Listing not active");
        require(listing.seller == msg.sender, "Marketplace: Not seller");

        listings[nftAddress][tokenId].price = newPrice;
        emit ListingPriceUpdated(msg.sender, nftAddress, tokenId, newPrice);
    }

    /**
     * @notice Make an escrowed offer for a horse
     */
    function makeOffer(
        address nftAddress,
        uint256 tokenId,
        uint256 durationInDays
    ) external payable nonReentrant {
        require(msg.value > 0, "Marketplace: Offer must be > 0");
        require(durationInDays >= 1 && durationInDays <= 30, "Marketplace: Invalid duration");

        _offers[nftAddress][tokenId].push(Offer({
            bidder: msg.sender,
            amount: msg.value,
            expiresAt: block.timestamp + (durationInDays * 1 days)
        }));

        emit OfferCreated(msg.sender, nftAddress, tokenId, msg.value);
    }

    // --- View Functions ---

    function getListing(address nftAddress, uint256 tokenId) external view returns (Listing memory) {
        return listings[nftAddress][tokenId];
    }

    function getOffers(address nftAddress, uint256 tokenId) external view returns (Offer[] memory) {
        return _offers[nftAddress][tokenId];
    }

    // --- Admin Functions ---

    function updateFee(uint256 newFeeBasisPoints) external onlyOwner {
        require(newFeeBasisPoints <= 1000, "Marketplace: Fee cannot exceed 10%");
        platformFeeBasisPoints = newFeeBasisPoints;
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Marketplace: No fees to withdraw");
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Marketplace: Withdraw failed");
    }
}
