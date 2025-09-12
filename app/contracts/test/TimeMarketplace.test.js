const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TimeMarketplace", function () {
  let timeMarketplace;
  let owner;
  let seller;
  let buyer;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();
    
    const TimeMarketplace = await ethers.getContractFactory("TimeMarketplace");
    timeMarketplace = await TimeMarketplace.deploy();
    await timeMarketplace.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await timeMarketplace.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct values", async function () {
      expect(await timeMarketplace.nextOfferId()).to.equal(1);
      expect(await timeMarketplace.platformFee()).to.equal(500);
    });
  });

  describe("Creating Offers", function () {
    it("Should create an offer successfully", async function () {
      const title = "Test Offer";
      const description = "Test Description";
      const price = ethers.parseEther("0.1");
      const duration = 60; // 1 hour
      const availableSlots = 5;

      await timeMarketplace.connect(seller).createOffer(
        title,
        description,
        price,
        duration,
        availableSlots
      );

      const offer = await timeMarketplace.getOffer(1);
      expect(offer.seller).to.equal(seller.address);
      expect(offer.title).to.equal(title);
      expect(offer.description).to.equal(description);
      expect(offer.price).to.equal(price);
      expect(offer.duration).to.equal(duration);
      expect(offer.availableSlots).to.equal(availableSlots);
      expect(offer.isActive).to.be.true;
    });

    it("Should reject offer with zero price", async function () {
      await expect(
        timeMarketplace.connect(seller).createOffer(
          "Test",
          "Test",
          0,
          60,
          5
        )
      ).to.be.revertedWith("Price must be greater than 0");
    });

    it("Should reject offer with zero duration", async function () {
      await expect(
        timeMarketplace.connect(seller).createOffer(
          "Test",
          "Test",
          ethers.parseEther("0.1"),
          0,
          5
        )
      ).to.be.revertedWith("Duration must be greater than 0");
    });

    it("Should reject offer with zero slots", async function () {
      await expect(
        timeMarketplace.connect(seller).createOffer(
          "Test",
          "Test",
          ethers.parseEther("0.1"),
          60,
          0
        )
      ).to.be.revertedWith("Available slots must be greater than 0");
    });
  });

  describe("Purchasing Offers", function () {
    beforeEach(async function () {
      await timeMarketplace.connect(seller).createOffer(
        "Test Offer",
        "Test Description",
        ethers.parseEther("0.1"),
        60,
        5
      );
    });

    it("Should purchase an offer successfully", async function () {
      const price = ethers.parseEther("0.1");
      const initialBalance = await ethers.provider.getBalance(seller.address);
      
      await timeMarketplace.connect(buyer).purchaseOffer(1, { value: price });
      
      const offer = await timeMarketplace.getOffer(1);
      expect(offer.availableSlots).to.equal(4);
      
      const finalBalance = await ethers.provider.getBalance(seller.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should reject purchase with insufficient payment", async function () {
      await expect(
        timeMarketplace.connect(buyer).purchaseOffer(1, { value: ethers.parseEther("0.05") })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should reject purchase of own offer", async function () {
      await expect(
        timeMarketplace.connect(seller).purchaseOffer(1, { value: ethers.parseEther("0.1") })
      ).to.be.revertedWith("Cannot purchase your own offer");
    });

    it("Should deactivate offer when no slots left", async function () {
      // Purchase all 5 slots
      for (let i = 0; i < 5; i++) {
        await timeMarketplace.connect(buyer).purchaseOffer(1, { value: ethers.parseEther("0.1") });
      }
      
      const offer = await timeMarketplace.getOffer(1);
      expect(offer.availableSlots).to.equal(0);
      expect(offer.isActive).to.be.false;
    });
  });

  describe("Managing Offers", function () {
    beforeEach(async function () {
      await timeMarketplace.connect(seller).createOffer(
        "Test Offer",
        "Test Description",
        ethers.parseEther("0.1"),
        60,
        5
      );
    });

    it("Should deactivate offer successfully", async function () {
      await timeMarketplace.connect(seller).deactivateOffer(1);
      
      const offer = await timeMarketplace.getOffer(1);
      expect(offer.isActive).to.be.false;
    });

    it("Should reject deactivation by non-seller", async function () {
      await expect(
        timeMarketplace.connect(buyer).deactivateOffer(1)
      ).to.be.revertedWith("Not the seller");
    });

    it("Should delete offer successfully", async function () {
      await timeMarketplace.connect(seller).deleteOffer(1);
      
      const offer = await timeMarketplace.getOffer(1);
      expect(offer.isActive).to.be.false;
    });
  });

  describe("Platform Fee", function () {
    it("Should set platform fee correctly", async function () {
      await timeMarketplace.setPlatformFee(1000); // 10%
      expect(await timeMarketplace.platformFee()).to.equal(1000);
    });

    it("Should reject fee over 10%", async function () {
      await expect(
        timeMarketplace.setPlatformFee(1001)
      ).to.be.revertedWith("Fee cannot exceed 10%");
    });

    it("Should only allow owner to set fee", async function () {
      await expect(
        timeMarketplace.connect(seller).setPlatformFee(1000)
      ).to.be.revertedWith("Not the owner");
    });
  });
});


