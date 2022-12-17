// const { ethers } = require('hardhat')
const { ethers, upgrades,getChainId } = require('hardhat'); 

const {
    readConfig,
    deployDBookPlatform,
    writeConfig
} = require('./utils/helper')

const main = async () => {

    let chainId = await getChainId();
    console.log("chainId is : " + chainId);

    [admin,platform,seller,publisher,buyer] = await ethers.getSigners()

    console.log("admin is :",admin.address);
    let dDBookPlatformContractAddress = await readConfig(2,"PLATFORM_ADDRESS");

    const DBookPlatformV2 = await ethers.getContractFactory('DBookPlatform',admin)
    await upgrades.upgradeProxy(dDBookPlatformContractAddress, DBookPlatformV2,
        {from: admin.address});


}



main();

