// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";

contract TimeMarketplaceV2 {
    
    // FHE encrypted data structures
    struct TimeOffer {
        address seller;
        string title;
        string description;
        uint256 price; // Public price for compatibility
        uint256 duration; // Public duration for compatibility
        uint256 availableSlots; // Public slots for compatibility
        bool isActive;
        uint256 createdAt;
        // FHE encrypted versions (stored as bytes32 for now)
        bytes32 encryptedPrice; // Encrypted price in wei
        bytes32 encryptedDuration; // Encrypted duration in hours
        bytes32 encryptedAvailableSlots; // Encrypted available slots
        bytes32 encryptedIsActive; // Encrypted active status
    }
    
    struct Purchase {
        address buyer;
        uint256 offerId;
        uint256 purchaseTime;
        bool isRedeemed;
        // FHE encrypted version
        bytes32 encryptedIsRedeemed; // Encrypted redemption status
    }

    mapping(uint256 => TimeOffer) public offers;
    mapping(address => Purchase[]) public userPurchases;
    mapping(address => uint256[]) public userOffers;
    mapping(address => uint256[]) public userActiveOffers; // Track active offers per user
    
    uint256 public nextOfferId = 1;
    address public owner;
    uint256 public platformFee = 500; // 5% fee (500/10000)
    
    // FHE configuration
    bytes32 public publicKey;
    bool public fheEnabled = false;
    
    // Statistics
    uint256 public totalOffersCreated = 0;
    uint256 public totalPurchases = 0;
    uint256 public totalVolume = 0;
    
    event OfferCreated(uint256 indexed offerId, address indexed seller, string title, uint256 price);
    event OfferPurchased(uint256 indexed offerId, address indexed buyer, address indexed seller, uint256 price);
    event OfferDeactivated(uint256 indexed offerId);
    event OfferDeleted(uint256 indexed offerId);
    event PublicKeySet(bytes32 indexed publicKey);
    event FHEEnabled(bool enabled);
    event PlatformFeeUpdated(uint256 newFee);
    
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
        fheEnabled = true;
        emit PublicKeySet(_publicKey);
        emit FHEEnabled(true);
    }
    
    // Enable/disable FHE functionality
    function setFHEEnabled(bool _enabled) external onlyOwner {
        fheEnabled = _enabled;
        emit FHEEnabled(_enabled);
    }

    // Create a new time offer with FHE encryption
    function createOffer(
        string memory _title,
        string memory _description,
        uint256 _price,
        uint256 _duration,
        uint256 _availableSlots,
        bytes32 _encryptedPrice,
        bytes32 _encryptedDuration,
        bytes32 _encryptedAvailableSlots
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
            price: _price,
            duration: _duration,
            availableSlots: _availableSlots,
            isActive: true,
            createdAt: block.timestamp,
            // FHE encrypted versions (stored as bytes32)
            encryptedPrice: _encryptedPrice,
            encryptedDuration: _encryptedDuration,
            encryptedAvailableSlots: _encryptedAvailableSlots,
            encryptedIsActive: bytes32(uint256(1)) // true as bytes32
        });
        
        userOffers[msg.sender].push(nextOfferId);
        userActiveOffers[msg.sender].push(nextOfferId);
        totalOffersCreated++;
        
        emit OfferCreated(nextOfferId, msg.sender, _title, _price);
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
            encryptedIsRedeemed: bytes32(uint256(0)) // false as bytes32
        }));
        
        totalPurchases++;
        totalVolume += msg.value;
        
        emit OfferPurchased(_offerId, msg.sender, offer.seller, msg.value);
    }
    
    // Deactivate an offer
    function deactivateOffer(uint256 _offerId) external offerExists(_offerId) {
        TimeOffer storage offer = offers[_offerId];
        require(offer.seller == msg.sender, "Not the seller");
        require(offer.isActive, "Offer already inactive");
        
        offer.isActive = false;
        offer.encryptedIsActive = bytes32(uint256(0)); // false as bytes32
        
        // Remove from user's active offers
        _removeFromActiveOffers(msg.sender, _offerId);
        
        emit OfferDeactivated(_offerId);
    }
    
    // Delete an offer completely (only seller, only if no purchases)
    function deleteOffer(uint256 _offerId) external offerExists(_offerId) {
        TimeOffer storage offer = offers[_offerId];
        require(offer.seller == msg.sender, "Not the seller");
        require(userPurchases[msg.sender].length == 0, "Cannot delete offer with purchases");
        
        // Mark as inactive first
        offer.isActive = false;
        offer.encryptedIsActive = bytes32(uint256(0)); // false as bytes32
        
        // Remove from user's offers array
        _removeFromUserOffers(msg.sender, _offerId);
        _removeFromActiveOffers(msg.sender, _offerId);
        
        // Clear the offer data
        delete offers[_offerId];
        
        emit OfferDeleted(_offerId);
    }
    
    // Helper function to remove offer from user's offers
    function _removeFromUserOffers(address _user, uint256 _offerId) private {
        uint256[] storage userOfferIds = userOffers[_user];
        for (uint256 i = 0; i < userOfferIds.length; i++) {
            if (userOfferIds[i] == _offerId) {
                userOfferIds[i] = userOfferIds[userOfferIds.length - 1];
                userOfferIds.pop();
                break;
            }
        }
    }
    
    // Helper function to remove offer from user's active offers
    function _removeFromActiveOffers(address _user, uint256 _offerId) private {
        uint256[] storage userActiveOfferIds = userActiveOffers[_user];
        for (uint256 i = 0; i < userActiveOfferIds.length; i++) {
            if (userActiveOfferIds[i] == _offerId) {
                userActiveOfferIds[i] = userActiveOfferIds[userActiveOfferIds.length - 1];
                userActiveOfferIds.pop();
                break;
            }
        }
    }
    
    // Get offer details (public version)
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
    
    // Get encrypted offer details (FHE version)
    function getEncryptedOffer(uint256 _offerId) external view offerExists(_offerId) returns (
        address seller,
        string memory title,
        string memory description,
        uint256 price,
        uint256 duration,
        uint256 availableSlots,
        bool isActive,
        uint256 createdAt,
        bytes32 encryptedPrice,
        bytes32 encryptedDuration,
        bytes32 encryptedAvailableSlots,
        bytes32 encryptedIsActive
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
    
    // Get user's offers
    function getUserOffers(address _user) external view returns (uint256[] memory) {
        return userOffers[_user];
    }
    
    // Get user's active offers
    function getUserActiveOffers(address _user) external view returns (uint256[] memory) {
        return userActiveOffers[_user];
    }
    
    // Get user's purchases
    function getUserPurchases(address _user) external view returns (Purchase[] memory) {
        return userPurchases[_user];
    }
    
    // Get all active offers
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
    
    // FHE comparison functions (simplified for demo - in production would use real FHE operations)
    function compareEncryptedPrices(bytes32 _price1, bytes32 _price2) external pure returns (bytes32) {
        // In production, this would use real FHE comparison
        // For demo, we'll do a simple comparison
        uint256 price1 = uint256(_price1);
        uint256 price2 = uint256(_price2);
        return bytes32(uint256(price1 < price2 ? 1 : 0));
    }
    
    function isEncryptedPriceGreaterThan(bytes32 _price, uint32 _threshold) external pure returns (bytes32) {
        // In production, this would use real FHE comparison
        uint256 price = uint256(_price);
        return bytes32(uint256(price > _threshold ? 1 : 0));
    }
    
    function isEncryptedOfferActive(bytes32 _encryptedIsActive) external pure returns (bytes32) {
        return _encryptedIsActive;
    }
    
    // Statistics functions
    function getContractStats() external view returns (
        uint256 _totalOffers,
        uint256 _totalPurchases,
        uint256 _totalVolume,
        uint256 _activeOffers,
        bool _fheEnabled
    ) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i < nextOfferId; i++) {
            if (offers[i].isActive) {
                activeCount++;
            }
        }
        
        return (
            totalOffersCreated,
            totalPurchases,
            totalVolume,
            activeCount,
            fheEnabled
        );
    }
    
    // Update platform fee (only owner)
    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee cannot exceed 10%");
        platformFee = _fee;
        emit PlatformFeeUpdated(_fee);
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
    
    // Emergency functions (only owner)
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    function pauseContract() external onlyOwner {
        // This would pause the contract in a real implementation
        // For now, we'll just emit an event
        emit FHEEnabled(false);
    }
}
