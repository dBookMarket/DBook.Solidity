const { ethers } = require('hardhat')

const {
    readConfig,
    showNftBalace,
    showUsdcBalace,

    attachERC20,
    attachDBook1155,
    attachDBookPlatform,
    sleep
  
} = require('./utils/helper')

const main = async () => {

    let chainId = await getChainId();
    console.log("chainId is : " + chainId);

    [admin,platform,seller,publisher,buyer] = await ethers.getSigners()

    let dUsdcAddress = await readConfig(2,"USDC_ADDRESS");
    let dbookAddress = await readConfig(2,"DBOOK_ADDRESS");
    let platformAddress = await readConfig(2,"PLATFORM_ADDRESS");
    
    let dDBookPlatformContract = await attachDBookPlatform(admin,platformAddress);
    let dBookNftContract = await attachDBook1155(admin,dbookAddress);
    let dUsdcContract = await attachERC20(admin,dUsdcAddress);
  
    //1. param
    let to = seller.address;
    let nftId = "0x05"
    let data = "0x1234"
    let gasPrice = 0x02540be400;
    let gasLimit = 0x7a1200;
    let fee = "1000000";
    tradeValue = "10000000";

    //2.show before usdc
    await showUsdcBalace(dUsdcContract,"before");
    await showNftBalace(dBookNftContract,"before",nftId);

    await dDBookPlatformContract.connect(buyer).trade(
      seller.address,buyer.address,nftId,2,data,tradeValue,fee,
      {gasPrice: gasPrice, gasLimit: gasLimit}
    );

    //let rep = await txObj.wait();
    //console.log(rep);
    await sleep(5000);
    //4.show before nftId
    console.log("\n---------------------------------------------\n");
    await showUsdcBalace(dUsdcContract,"after");
    await showNftBalace(dBookNftContract,"after",nftId);



}



main();

