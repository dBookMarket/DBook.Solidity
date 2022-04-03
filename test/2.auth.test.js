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

describe(`auth of issue`, () => {

  let admin,seller,publisher;
  let dBookNftContract,dDBookPlatformContract,dUsdcContract;
  let gasPrice = 0x02540be400;
  let gasLimit = 0x7a1200;
  let fee = "1000000";

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

  it(`issue auth -> add Auth`, async () => {

    await dDBookPlatformContract.addAuth(seller.address);
    let chkIssueList = await dDBookPlatformContract.getIssueList();

    expect(chkIssueList.length).to.equal(1);
    expect(chkIssueList[0]).to.equal(seller.address);

  })


  it(`issue auth -> del Auth`, async () => {

    await dDBookPlatformContract.delAuth(seller.address);
    let chkIssueList = await dDBookPlatformContract.getIssueList();

    expect(chkIssueList.length).to.equal(0);
    
  })


  
})
