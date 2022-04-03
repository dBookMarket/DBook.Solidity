const { ethers } = require('hardhat')

const {
    readConfig,
    attachERC20,
    attachDBook1155,
    attachDBookPlatform,

} = require('./utils/helper')

const main = async () => {

    let chainId = await getChainId();
    console.log("chainId is : " + chainId);

    let fee = "1000000";
    let buyAmount = "10000000000";
    
    [admin,platform,seller,publisher,buyer] = await ethers.getSigners()

    let usdcAddress = await readConfig(2,"USDC_ADDRESS");
    let dbookAddress = await readConfig(2,"DBOOK_ADDRESS");
    let platformAddress = await readConfig(2,"PLATFORM_ADDRESS");

    let dUsdcContract = await attachERC20(admin,usdcAddress);
    let dBookNftContract = await attachDBook1155(admin,dbookAddress);
    let dDBookPlatformContract = await attachDBookPlatform(admin,platformAddress);

    //1.buyer set approve
    await dUsdcContract.connect(buyer).approve(dDBookPlatformContract.address,buyAmount);

    //2.set mint auth to platform
    await dBookNftContract.setPlatformAddress(dDBookPlatformContract.address);
    //3.seller set approve
    await dBookNftContract.connect(seller).setApprovalForAll(dDBookPlatformContract.address,true);
    
    //4.set platform ratio %%
    await dDBookPlatformContract.setPlatformRatio(250);
    //5.set platform address
    await dDBookPlatformContract.setPlatformAddress(platform.address);
    //6.set dBook fee
    await dDBookPlatformContract.connect(admin).setFee(fee);

}



main();

