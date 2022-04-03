/* External Imports */
const { ethers, network } = require('hardhat')
const chai = require('chai')
const { solidity } = require('ethereum-waffle')
const { expect } = chai
const {
  deployDBook1155,
  deployERC20,
  deployDBookPlatform
} = require("../scripts/utils/helper")

chai.use(solidity)

describe(`issue DBook platform `, () => {

  let admin,seller,publisher;
  let dBookNftContract,dDBookPlatformContract,dUsdcContract;
  let gasPrice = 0x02540be400;
  let gasLimit = 0x7a1200;
  let fee = "1000000";

  let nftId = "0x01"
  let amount = 10;
  let data = "0x1234"
  let price = "5000000";
  let publisherRatio = 2000 //%% 

  before(`deploy contract -> setting -> issue`, async () => {

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

    //3.issue
    await dDBookPlatformContract.connect(seller).issue(
      to,nftId,amount,data,price,publisherAddress,publisherRatio,
      {gasPrice: gasPrice, gasLimit: gasLimit}
    );

  })

  it(`issue 1155 nft -> balanceOf `, async () => {
  
    let nftBalance = await dBookNftContract.balanceOf(seller.address,nftId);
    expect(nftBalance).to.equal(10);

  })

  it(`issue 1155 nft -> getNftPrice `, async () => {

    let nftPrice = await dDBookPlatformContract.getNftPrice(nftId);
    expect(nftPrice).to.equal(price);

  })

  it(`issue 1155 nft -> setNftPrice `, async () => {

    let newPrice = "4000000" 
    await dDBookPlatformContract.setNftPrice(nftId,newPrice);
    let nftPrice = await dDBookPlatformContract.getNftPrice(nftId);

    expect(nftPrice).to.equal(newPrice);

  })

  it(`issue 1155 nft -> getPublisher `, async () => {

    let publisherAddress = await dDBookPlatformContract.getPublisherAddress(nftId);
    expect(publisherAddress).to.equal(publisher.address);

  })

  it(`issue 1155 nft -> setPublisher `, async () => {

    await dDBookPlatformContract.setPublisherAddress(nftId,seller.address);
    let publisherAddress = await dDBookPlatformContract.getPublisherAddress(nftId);
    expect(publisherAddress).to.equal(seller.address);

  })

  it(`issue 1155 nft -> PublisherRatio `, async () => {

    let chkPublisherRatio = await dDBookPlatformContract.getPublisherRatio(nftId);
    expect(publisherRatio).to.equal(chkPublisherRatio);

  })

  it(`issue 1155 nft -> PublisherRatio `, async () => {

    let newPublisherRatio = 1000 //%%
    await dDBookPlatformContract.setPublisherRatio(nftId,newPublisherRatio);
    let chkPublisherRatio = await dDBookPlatformContract.getPublisherRatio(nftId);
    expect(chkPublisherRatio).to.equal(newPublisherRatio);

  })


  
})
