const { ethers } = require('hardhat')

const {
    readConfig,
    showNftBalace,

    attachERC20,
    attachDBook1155,
    attachDBookPlatform,
} = require('./utils/helper')

const main = async () => {

    let chainId = await getChainId();
    console.log("chainId is : " + chainId);

    [admin,platform,seller,publisher,buyer] = await ethers.getSigners()

    let dbookAddress = await readConfig(2,"DBOOK_ADDRESS");
    let platformAddress = await readConfig(2,"PLATFORM_ADDRESS");

    let dBookNftContract = await attachDBook1155(admin,dbookAddress);
    let dDBookPlatformContract = await attachDBookPlatform(admin,platformAddress);

    //1. param
    let to = seller.address;
    let nftId = "0x05"
    let amount = 10;
    let data = "0x1234"
    let price = "5000000";
    let publisherAddress = publisher.address;
    let publisherRatio = 2000 //%% 
    let maxFeePerGas = 0x02540be400 * 3;
    let maxPriorityFeePerGas = 0x02540be400 * 2;

    let gasPrice = 0x02540be400;
    let gasLimit = 0x7a1200;

    // 2.show before usdc
    await showNftBalace(dBookNftContract,"before",nftId);
    console.log("seller.address : " ,seller.address);

    //3.add auth
    await dDBookPlatformContract.addAuth(seller.address);


    let txObj = await dDBookPlatformContract.connect(seller).issue(
      to,nftId,amount,data,price,publisherAddress,publisherRatio
    );

    let rep = await txObj.wait();
    console.log(rep);

    //4.show before nftId
    console.log("\n---------------------------------------------\n");
    await showNftBalace(dBookNftContract,"after",nftId);




}



main();

