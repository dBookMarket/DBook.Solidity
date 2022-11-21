/* External Imports */
const { ethers, network } = require('hardhat')
const chai = require('chai')
const { solidity } = require('ethereum-waffle')
const { expect } = chai
const {
  deployDBook1155,
  deployERC20,
  deployDBookPlatform,
  showUsdcBalace,
  showNftBalace
} = require("../scripts/utils/helper")

chai.use(solidity)

describe(`platform dBook Platform`, () => {

  let admin,platform,seller,publisher,buyer;
  let dBookNftContract,dDBookPlatformContract,dUsdcContract;
  let gasPrice = 0x02540be400;
  let gasLimit = 0x7a1200;
  let fee = "1000000";

  // let nftId = "0x01"
  // let amount = 10;
  // let data = "0x1234"
  // let price = "5000000";
  // let publisherRatio = 2000 //%% 
  // let tradeValue = "10000000";

  before(`load accounts`, async () => {

    [ admin,platform,seller,publisher,buyer] = await ethers.getSigners()

    //deploy DBook 1155
    dBookNftContract = await deployDBook1155("DBOOK","DBK","0x01",admin);
    //deploy USDC
    let totalSupply = "100000000000000";
    dUsdcContract = await deployERC20("USDC","USDC",totalSupply,6,admin);
    let buyAmount = "10000000000"
    await dUsdcContract.transfer(buyer.address,buyAmount);
    //deploy USDC
    dDBookPlatformContract = await deployDBookPlatform(dBookNftContract.address,dUsdcContract.address,"v1.0.0",admin)
    //set mint auth to platform
    await dBookNftContract.setPlatformAddress(dDBookPlatformContract.address);
    //set platform ratio %%
    await dDBookPlatformContract.setPlatformRatio(250);
    //set platform address
    await dDBookPlatformContract.setPlatformAddress(platform.address);
    //buyer set approve
    await dUsdcContract.connect(buyer).approve(dDBookPlatformContract.address,buyAmount);
    //seller set approve
    await dBookNftContract.connect(seller).setApprovalForAll(dDBookPlatformContract.address,true);
    //set dBook fee
    await dDBookPlatformContract.connect(admin).setFee(fee);



  })

  it(`set and pay first trade`, async () => {

    await dDBookPlatformContract.setFirstTradeFee(100);
    let firstTradeFee = await dDBookPlatformContract.getFirstTradeFee();
    expect(firstTradeFee).to.equal(100);

    await dDBookPlatformContract.connect(buyer).payFirstTrade(1000,{value:100});

    let platformAddress = await dDBookPlatformContract.getPlatformAddress();
    let checkBalance = await dUsdcContract.balanceOf(platformAddress);
    expect(checkBalance).to.equal("1000");


  })

  it(`run first trade`, async () => {

    let nftId = "0x1234"
    await dDBookPlatformContract.connect(buyer).runFirstTrade(
        seller.address,
        2000,           //payValue  
        100,            //mintAmont
        buyer.address,
        nftId,          //nftId
        2,              //amount  
        "0x01"
      );

      let checkUsdtBalance = await dUsdcContract.balanceOf(seller.address);
      expect(checkUsdtBalance).to.equal("2000");

      let checkBuyNftBalance = await dBookNftContract.balanceOf(buyer.address,nftId);
      expect(checkBuyNftBalance).to.equal("2");

      let checkSellerNftBalance = await dBookNftContract.balanceOf(seller.address,nftId);
      expect(checkSellerNftBalance).to.equal("98");


      await dDBookPlatformContract.connect(buyer).runFirstTrade(
        seller.address,
        3000,           //payValue  
        100,            //mintAmont
        buyer.address,
        nftId,          //nftId
        3,              //amount  
        "0x01"
      );

      checkUsdtBalance = await dUsdcContract.balanceOf(seller.address);
      expect(checkUsdtBalance).to.equal("5000");

      checkBuyNftBalance = await dBookNftContract.balanceOf(buyer.address,nftId);
      expect(checkBuyNftBalance).to.equal("5");

      checkSellerNftBalance = await dBookNftContract.balanceOf(seller.address,nftId);
      expect(checkSellerNftBalance).to.equal("95");


  })

  
})
