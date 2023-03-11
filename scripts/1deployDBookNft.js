const { ethers } = require('hardhat')

const {
    deployDBook1155,
    writeConfig
} = require('./utils/helper')

const main = async () => {

    const admin = new ethers.Wallet(network.config.accounts[0], ethers.provider)
    console.log("deploy DBook is : " ,admin.address,network.config.chainId);


    let dBookNftContract = await deployDBook1155("DBOOK2","DBK","0x01",admin);
    console.log("dBook nft contract address : " + dBookNftContract.address);
    await writeConfig(0,1,"DBOOK_ADDRESS",dBookNftContract.address);


}



main();

