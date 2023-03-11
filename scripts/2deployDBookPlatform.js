const { ethers } = require('hardhat')

const {
    readConfig,
    deployDBookPlatform,
    writeConfig
} = require('./utils/helper')

const main = async () => {


    const admin = new ethers.Wallet(network.config.accounts[0], ethers.provider);
    let usdcAddress = await readConfig(1,"USDC_ADDRESS");
    let dbookAddress = await readConfig(1,"DBOOK_ADDRESS");
    console.log("deploy DBook Platform is : " ,admin.address,usdcAddress,dbookAddress,network.config.chainId);

    dDBookPlatformContract = await deployDBookPlatform(dbookAddress,usdcAddress,"v1.0.0",admin)

    console.log("dBook platform contract address : " + dDBookPlatformContract.address);
    await writeConfig(1,2,"PLATFORM_ADDRESS",dDBookPlatformContract.address);


}



main();

