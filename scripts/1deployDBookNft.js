const { ethers } = require('hardhat')

const {
    deployDBook1155,
    writeConfig
} = require('./utils/helper')

const main = async () => {

    let chainId = await getChainId();
    console.log("chainId is : " + chainId);

    [admin,platform,seller,publisher,buyer] = await ethers.getSigners()

    let dBookNftContract = await deployDBook1155("DBOOK","DBK","0x01",admin);
    console.log("dBook nft contract address : " + dBookNftContract.address);
    await writeConfig(0,1,"DBOOK_ADDRESS",dBookNftContract.address);


}



main();

