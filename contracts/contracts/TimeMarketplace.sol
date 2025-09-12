// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract TimeMarketplace {

    struct TimeOffer {
        address seller;
        string title;
        string description;
        uint256 price; // Price in wei (public for demo)
        uint256 duration; // Duration in hours (public for demo)
        uint256 availableSlots; // Available slots (public for demo)
        bool isActive;
        uint256 createdAt;
        // FHE encrypted versions
        euint32 encryptedPrice; // Encrypted price in wei
        euint32 encryptedDuration; // Encrypted duration in hours
        euint32 encryptedAvailableSlots; // Encrypted available slots
        ebool encryptedIsActive; // Encrypted active status
    }

    struct Purchase {
        address buyer;
        uint256 offerId;
        uint256 purchaseTime;
        bool isRedeemed;
        // FHE encrypted version
        ebool encryptedIsRedeemed; // Encrypted redemption status
    }

    mapping(uint256 => TimeOffer) public offers;
    mapping(address => Purchase[]) public userPurchases;
    mapping(address => uint256[]) public userOffers;
    
    uint256 public nextOfferId = 1;
    address public owner;
    uint256 public platformFee = 500; // 5% fee (500/10000)
    
    // FHE configuration
    bytes32 public publicKey;
    
    event OfferCreated(uint256 indexed offerId, address indexed seller, string title);
    event OfferPurchased(uint256 indexed offerId, address indexed buyer, address indexed seller);
    event OfferDeactivated(uint256 indexed offerId);
    event PublicKeySet(bytes32 indexed publicKey);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier offerExists(uint256 _offerId) {
        require(_offerId > 0 && _offerId < nextOfferId, "Offer does not exist");
        _;
    }
    
    modifier offerActive(uint256 _offerId) {
        require(offers[_offerId].isActive, "Offer is not active");
        _;
    }

    constructor() {
        owner = msg.sender;
    }
    
    // Set the public key for FHE encryption (only owner)
    function setPublicKey(bytes32 _publicKey) external onlyOwner {
        publicKey = _publicKey;
        emit PublicKeySet(_publicKey);
    }

    // Create a new time offer with FHE encryption
    function createOffer(
        string memory _title,
        string memory _description,
        uint256 _price,
        uint256 _duration,
        uint256 _availableSlots,
        euint32 _encryptedPrice,
        euint32 _encryptedDuration,
        euint32 _encryptedAvailableSlots
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        require(_availableSlots > 0, "Available slots must be greater than 0");
        
        offers[nextOfferId] = TimeOffer({
            seller: msg.sender,
            title: _title,
            description: _description,
            price: _price, // Keep public for compatibility
            duration: _duration, // Keep public for compatibility
            availableSlots: _availableSlots, // Keep public for compatibility
            isActive: true,
            createdAt: block.timestamp,
            // FHE encrypted versions
            encryptedPrice: _encryptedPrice,
            encryptedDuration: _encryptedDuration,
            encryptedAvailableSlots: _encryptedAvailableSlots,
            encryptedIsActive: FHE.asEbool(true)
        });
        
        userOffers[msg.sender].push(nextOfferId);
        
        emit OfferCreated(nextOfferId, msg.sender, _title);
        nextOfferId++;
    }

    // Purchase an offer
    function purchaseOffer(uint256 _offerId) external payable offerExists(_offerId) offerActive(_offerId) {
        TimeOffer storage offer = offers[_offerId];
        require(offer.seller != msg.sender, "Cannot purchase your own offer");
        require(msg.value >= offer.price, "Insufficient payment");
        
        // Calculate platform fee
        uint256 fee = (msg.value * platformFee) / 10000;
        uint256 sellerAmount = msg.value - fee;
        
        // Transfer payment to seller
        payable(offer.seller).transfer(sellerAmount);
        
        // Create purchase record
        userPurchases[msg.sender].push(Purchase({
            buyer: msg.sender,
            offerId: _offerId,
            purchaseTime: block.timestamp,
            isRedeemed: false,
            encryptedIsRedeemed: FHE.asEbool(false)
        }));
        
        emit OfferPurchased(_offerId, msg.sender, offer.seller);
    }

    // Deactivate an offer
    function deactivateOffer(uint256 _offerId) external offerExists(_offerId) {
        TimeOffer storage offer = offers[_offerId];
        require(offer.seller == msg.sender, "Not the seller");
        require(offer.isActive, "Offer already inactive");
        
        offer.isActive = false;
        offer.encryptedIsActive = FHE.asEbool(false);
        emit OfferDeactivated(_offerId);
    }

    // Delete an offer completely (only seller, only if no purchases)
    function deleteOffer(uint256 _offerId) external offerExists(_offerId) {
        TimeOffer storage offer = offers[_offerId];
        require(offer.seller == msg.sender, "Not the seller");
        require(userPurchases[msg.sender].length == 0, "Cannot delete offer with purchases");
        
        // Mark as inactive first
        offer.isActive = false;
        offer.encryptedIsActive = FHE.asEbool(false);
        
        // Remove from user's offers array
        uint256[] storage userOfferIds = userOffers[msg.sender];
        for (uint256 i = 0; i < userOfferIds.length; i++) {
            if (userOfferIds[i] == _offerId) {
                userOfferIds[i] = userOfferIds[userOfferIds.length - 1];
                userOfferIds.pop();
                break;
            }
        }
        
        // Clear the offer data
        delete offers[_offerId];
        
        emit OfferDeactivated(_offerId);
    }

    // Get offer details
    function getOffer(uint256 _offerId) external view offerExists(_offerId) returns (
        address seller,
        string memory title,
        string memory description,
        uint256 price,
        uint256 duration,
        uint256 availableSlots,
        bool isActive,
        uint256 createdAt
    ) {
        TimeOffer storage offer = offers[_offerId];
        return (
            offer.seller,
            offer.title,
            offer.description,
            offer.price,
            offer.duration,
            offer.availableSlots,
            offer.isActive,
            offer.createdAt
        );
    }

    // Get user's offers
    function getUserOffers(address _user) external view returns (uint256[] memory) {
        return userOffers[_user];
    }

    // Get user's purchases
    function getUserPurchases(address _user) external view returns (Purchase[] memory) {
        return userPurchases[_user];
    }

    // Get all active offers (simplified for demo)
    function getActiveOffers() external view returns (uint256[] memory) {
        uint256[] memory activeOffers = new uint256[](nextOfferId - 1);
        uint256 count = 0;
        
        for (uint256 i = 1; i < nextOfferId; i++) {
            if (offers[i].isActive) {
                activeOffers[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeOffers[i];
        }
        
        return result;
    }

    // Update platform fee (only owner)
    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee cannot exceed 10%");
        platformFee = _fee;
    }

    // Withdraw platform fees (only owner)
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner).transfer(balance);
    }

    // Get contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // FHE functions for encrypted data access
    function getEncryptedOffer(uint256 _offerId) external view offerExists(_offerId) returns (
        address seller,
        string memory title,
        string memory description,
        uint256 price,
        uint256 duration,
        uint256 availableSlots,
        bool isActive,
        uint256 createdAt,
        euint32 encryptedPrice,
        euint32 encryptedDuration,
        euint32 encryptedAvailableSlots,
        ebool encryptedIsActive
    ) {
        TimeOffer storage offer = offers[_offerId];
        return (
            offer.seller,
            offer.title,
            offer.description,
            offer.price,
            offer.duration,
            offer.availableSlots,
            offer.isActive,
            offer.createdAt,
            offer.encryptedPrice,
            offer.encryptedDuration,
            offer.encryptedAvailableSlots,
            offer.encryptedIsActive
        );
    }
    
    // FHE comparison functions
    function compareEncryptedPrices(euint32 _price1, euint32 _price2) external returns (ebool) {
        return FHE.lt(_price1, _price2);
    }
    
    function isEncryptedPriceGreaterThan(euint32 _price, uint32 _threshold) external returns (ebool) {
        return FHE.gt(_price, FHE.asEuint32(_threshold));
    }
    
    function isEncryptedOfferActive(ebool _encryptedIsActive) external returns (ebool) {
        return _encryptedIsActive;
    }
}
