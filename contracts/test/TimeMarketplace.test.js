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

    it("Should initialize with correct platform fee", async function () {
      expect(await timeMarketplace.platformFee()).to.equal(500); // 5%
    });
  });

  describe("Creating Offers", function () {
    it("Should create an offer successfully", async function () {
      const title = "1-hour coding session";
      const description = "I will help you with your coding project";
      const price = ethers.hexlify(ethers.toUtf8Bytes("0.01"));
      const duration = ethers.hexlify(ethers.toUtf8Bytes("1"));
      const availableSlots = ethers.hexlify(ethers.toUtf8Bytes("5"));

      await expect(
        timeMarketplace.connect(seller).createOffer(
          title,
          description,
          price,
          duration,
          availableSlots
        )
      ).to.emit(timeMarketplace, "OfferCreated");
    });

    it("Should reject empty title", async function () {
      const title = "";
      const description = "Description";
      const price = ethers.hexlify(ethers.toUtf8Bytes("0.01"));
      const duration = ethers.hexlify(ethers.toUtf8Bytes("1"));
      const availableSlots = ethers.hexlify(ethers.toUtf8Bytes("5"));

      await expect(
        timeMarketplace.connect(seller).createOffer(
          title,
          description,
          price,
          duration,
          availableSlots
        )
      ).to.be.revertedWith("Title cannot be empty");
    });
  });

  describe("Purchasing Offers", function () {
    beforeEach(async function () {
      const title = "1-hour coding session";
      const description = "I will help you with your coding project";
      const price = ethers.hexlify(ethers.toUtf8Bytes("0.01"));
      const duration = ethers.hexlify(ethers.toUtf8Bytes("1"));
      const availableSlots = ethers.hexlify(ethers.toUtf8Bytes("5"));

      await timeMarketplace.connect(seller).createOffer(
        title,
        description,
        price,
        duration,
        availableSlots
      );
    });

    it("Should purchase an offer successfully", async function () {
      const offerId = 1;
      const price = ethers.parseEther("0.01");

      await expect(
        timeMarketplace.connect(buyer).purchaseOffer(offerId, {
          value: price
        })
      ).to.emit(timeMarketplace, "OfferPurchased");
    });

    it("Should reject purchase of own offer", async function () {
      const offerId = 1;
      const price = ethers.parseEther("0.01");

      await expect(
        timeMarketplace.connect(seller).purchaseOffer(offerId, {
          value: price
        })
      ).to.be.revertedWith("Cannot purchase your own offer");
    });
  });

  describe("Offer Management", function () {
    beforeEach(async function () {
      const title = "1-hour coding session";
      const description = "I will help you with your coding project";
      const price = ethers.hexlify(ethers.toUtf8Bytes("0.01"));
      const duration = ethers.hexlify(ethers.toUtf8Bytes("1"));
      const availableSlots = ethers.hexlify(ethers.toUtf8Bytes("5"));

      await timeMarketplace.connect(seller).createOffer(
        title,
        description,
        price,
        duration,
        availableSlots
      );
    });

    it("Should deactivate offer successfully", async function () {
      const offerId = 1;

      await expect(
        timeMarketplace.connect(seller).deactivateOffer(offerId)
      ).to.emit(timeMarketplace, "OfferDeactivated");
    });

    it("Should reject deactivation by non-seller", async function () {
      const offerId = 1;

      await expect(
        timeMarketplace.connect(buyer).deactivateOffer(offerId)
      ).to.be.revertedWith("Not the seller");
    });
  });
});


