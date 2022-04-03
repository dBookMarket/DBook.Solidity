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

describe(`frozen dBook Platform`, () => {

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
    
    await dDBookPlatformContract.connect(admin).setFrozen(true);

  })

  it(`platform contract set frozen => issue`, async () => {

    //1. param
    let to = seller.address;
    let publisherAddress = publisher.address;
    
    //2.add auth
    await dDBookPlatformContract.addAuth(seller.address);

    //3.issue
    await expect(
      dDBookPlatformContract.connect(seller).issue(
        to,nftId,amount,data,price,publisherAddress,publisherRatio,
        {gasPrice: gasPrice, gasLimit: gasLimit}
      )
    ).to.be.revertedWith("Can not work,because is frozed");


  })

  it(`platform contract set frozen => trade`, async () => {

    //3.trade
    await expect(
      dDBookPlatformContract.connect(buyer).trade(
        seller.address,buyer.address,nftId,2,data,tradeValue,fee
      )
    ).to.be.revertedWith("Can not work,because is frozed");

  })

  it(`platform contract  => get frozen`, async () => {

    let chkIsFrozen = await dDBookPlatformContract.connect(admin).getFrozen();
    expect(chkIsFrozen).to.equal(true);
    
  })
  
})
