const { ethers } = require('hardhat')

const {
    readConfig,
    attachERC20,
    attachDBook1155,
    attachDBookPlatform,

} = require('./utils/helper')

const main = async () => {

    let gasPrice = 0x02540be400 ;
    let gasLimit = 0x7a1200;
    let fee = "1000000";
    let buyAmount = "10000000000";

    const admin = new ethers.Wallet(network.config.accounts[0], ethers.provider);
    const platform = new ethers.Wallet(network.config.accounts[1], ethers.provider);
    const seller = new ethers.Wallet(network.config.accounts[2], ethers.provider);
    const publisher = new ethers.Wallet(network.config.accounts[3], ethers.provider);
    const buyer = new ethers.Wallet(network.config.accounts[4], ethers.provider);

    let usdcAddress = await readConfig(2,"USDC_ADDRESS");
    let dbookAddress = await readConfig(2,"DBOOK_ADDRESS");
    let platformAddress = await readConfig(2,"PLATFORM_ADDRESS");
    console.log("setting is :USDC_ADDRESS: "+ usdcAddress,"DBOOK_ADDRESS: "+ dbookAddress,"PLATFORM_ADDRESS: "+platformAddress);
  

    let dUsdcContract = await attachERC20(admin,usdcAddress);
    let dBookNftContract = await attachDBook1155(admin,dbookAddress);
    let dDBookPlatformContract = await attachDBookPlatform(admin,platformAddress);

    console.log("dDBookPlatformContract.address :",dDBookPlatformContract.address, " buyAmount : ",buyAmount);
    
    // 1.buyer set approve
    await dUsdcContract.connect(buyer).approve(
        dDBookPlatformContract.address,buyAmount
    );

    //2.set mint auth to platform
    console.log("platform.address ",platform.address);
    let obj = await dDBookPlatformContract.setPlatformAddress(platform.address);
    let rep = await obj.wait();

    console.log("rep ",rep);
    
    // let address = await dBookNftContract.getPlatformAddress();
    let platAddress = await dDBookPlatformContract.getPlatformAddress();
    console.log("platAddress ",platAddress);

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

