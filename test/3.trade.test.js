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

describe(`trade dBook Platform`, () => {

  let admin,platform,seller,publisher,buyer;
  let dBookNftContract,dDBookPlatformContract,dUsdcContract;
  let gasPrice = 0x02540be400;
  let gasLimit = 0x7a1200;
  let fee = "1000000";

  let nftId = "0x01"
  let amount = 10;
  let data = "0x1234"
  let price = "5000000";
  let publisherRatio = 2000 //%% 
  let tradeValue = "10000000";
  
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

    //1. param
    let to = seller.address;
    let publisherAddress = publisher.address;

    //2.add auth
    await dDBookPlatformContract.addAuth(seller.address);
    await dDBookPlatformContract.connect(seller).issue(
      to,nftId,amount,data,price,publisherAddress,publisherRatio,
      {gasPrice: gasPrice, gasLimit: gasLimit}
    );

    //3.trade
    await dDBookPlatformContract.connect(buyer).trade(
      seller.address,buyer.address,nftId,2,data,tradeValue,fee
    );

  })

  it(`after trade -> admin usdc balance`, async () => {  

    let checkBalance = await dUsdcContract.balanceOf(admin.address);
    expect(checkBalance).to.equal("99990000000000");

  })

  it(`after trade -> admin nft balance`, async () => {  

    let checkBalance = await dBookNftContract.balanceOf(admin.address,nftId);
    expect(checkBalance).to.equal("0");

  })

  it(`after trade -> platform usdc balance`, async () => {  

    let checkBalance = await dUsdcContract.balanceOf(platform.address);
    expect(checkBalance).to.equal("1250000");

  })

  it(`after trade -> platform nft balance`, async () => {  

    let checkBalance = await dBookNftContract.balanceOf(platform.address,nftId);
    expect(checkBalance).to.equal("0");

  })

  it(`after trade -> seller usdc balance`, async () => {  

    let checkBalance = await dUsdcContract.balanceOf(seller.address);
    expect(checkBalance).to.equal("6750000");

  })

  it(`after trade -> seller nft balance`, async () => {  

    let checkBalance = await dBookNftContract.balanceOf(seller.address,nftId);
    expect(checkBalance).to.equal("8");

  })

  it(`after trade -> publisher usdc balance`, async () => {  

    let checkBalance = await dUsdcContract.balanceOf(publisher.address);
    expect(checkBalance).to.equal("2000000");

  })

  it(`after trade -> publisher nft balance`, async () => {  

    let checkBalance = await dBookNftContract.balanceOf(publisher.address,nftId);
    expect(checkBalance).to.equal("0");

  })

  it(`after trade -> buyer usdc balance`, async () => {  

    let checkBalance = await dUsdcContract.balanceOf(buyer.address);
    expect(checkBalance).to.equal("9990000000");

  })

  it(`after trade -> buyer nft balance`, async () => {  

    let checkBalance = await dBookNftContract.balanceOf(buyer.address,nftId);
    expect(checkBalance).to.equal("2");

  })
  
})
