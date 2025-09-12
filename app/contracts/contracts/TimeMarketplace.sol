// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TimeMarketplace {
    struct TimeOffer {
        address seller;
        string title;
        string description;
        uint256 price;
        uint256 duration;
        uint256 availableSlots;
        bool isActive;
        uint256 createdAt;
    }

    struct Purchase {
        address buyer;
        uint256 offerId;
        uint256 purchaseTime;
        bool isRedeemed;
    }

    mapping(uint256 => TimeOffer) public offers;
    mapping(address => Purchase[]) public userPurchases;
    mapping(address => uint256[]) public userOffers;
    
    uint256 public nextOfferId = 1;
    address public owner;
    uint256 public platformFee = 500; // 5% fee (500/10000)
    
    event OfferCreated(uint256 indexed offerId, address indexed seller, string title);
    event OfferPurchased(uint256 indexed offerId, address indexed buyer, address indexed seller);
    event OfferDeactivated(uint256 indexed offerId);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier offerExists(uint256 _offerId) {
        require(_offerId > 0 && _offerId < nextOfferId, "Offer does not exist");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function createOffer(
        string memory _title,
        string memory _description,
        uint256 _price,
        uint256 _duration,
        uint256 _availableSlots
    ) external {
        require(_price > 0, "Price must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        require(_availableSlots > 0, "Available slots must be greater than 0");
        
        offers[nextOfferId] = TimeOffer(
            msg.sender,
            _title,
            _description,
            _price,
            _duration,
            _availableSlots,
            true,
            block.timestamp
        );
        
        userOffers[msg.sender].push(nextOfferId);
        
        emit OfferCreated(nextOfferId, msg.sender, _title);
        nextOfferId++;
    }
    
    function purchaseOffer(uint256 _offerId) external payable offerExists(_offerId) {
        TimeOffer storage offer = offers[_offerId];
        require(offer.isActive, "Offer is not active");
        require(msg.sender != offer.seller, "Cannot purchase your own offer");
        require(msg.value >= offer.price, "Insufficient payment");
        
        // Calculate platform fee
        uint256 fee = (offer.price * platformFee) / 10000;
        uint256 sellerAmount = offer.price - fee;
        
        // Transfer payment to seller
        payable(offer.seller).transfer(sellerAmount);
        
        // Record purchase
        userPurchases[msg.sender].push(Purchase({
            buyer: msg.sender,
            offerId: _offerId,
            purchaseTime: block.timestamp,
            isRedeemed: false
        }));
        
        // Reduce available slots
        offer.availableSlots--;
        if (offer.availableSlots == 0) {
            offer.isActive = false;
        }
        
        emit OfferPurchased(_offerId, msg.sender, offer.seller);
    }
    
    function deactivateOffer(uint256 _offerId) external offerExists(_offerId) {
        TimeOffer storage offer = offers[_offerId];
        require(offer.seller == msg.sender, "Not the seller");
        require(offer.isActive, "Offer already inactive");
        
        offer.isActive = false;
        emit OfferDeactivated(_offerId);
    }

    function deleteOffer(uint256 _offerId) external offerExists(_offerId) {
        TimeOffer storage offer = offers[_offerId];
        require(offer.seller == msg.sender, "Not the seller");
        require(userPurchases[msg.sender].length == 0, "Cannot delete offer with purchases");
        
        offer.isActive = false;
        
        uint256[] storage userOfferIds = userOffers[msg.sender];
        for (uint256 i = 0; i < userOfferIds.length; i++) {
            if (userOfferIds[i] == _offerId) {
                userOfferIds[i] = userOfferIds[userOfferIds.length - 1];
                userOfferIds.pop();
                break;
            }
        }
        
        delete offers[_offerId];
        
        emit OfferDeactivated(_offerId);
    }
    
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
        TimeOffer memory offer = offers[_offerId];
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
    
    function getActiveOffers() external view returns (uint256[] memory) {
        uint256[] memory activeOffers = new uint256[](nextOfferId - 1);
        uint256 count = 0;
        
        for (uint256 i = 1; i < nextOfferId; i++) {
            if (offers[i].isActive) {
                activeOffers[count] = i;
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeOffers[i];
        }
        
        return result;
    }
    
    function getUserOffers(address _user) external view returns (uint256[] memory) {
        return userOffers[_user];
    }
    
    function getUserPurchases(address _user) external view returns (Purchase[] memory) {
        return userPurchases[_user];
    }
    
    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee cannot exceed 10%");
        platformFee = _fee;
    }
    
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner).transfer(balance);
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}


