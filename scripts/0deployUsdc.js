const { ethers } = require('hardhat')
// require("hardhat-deploy")
// require("hardhat-deploy-ethers")


const {
    deployERC20,
    writeConfig
} = require('./utils/helper')

const main = async () => {

    //
    const admin = new ethers.Wallet(network.config.accounts[0], ethers.provider)
    const buyer = new ethers.Wallet(network.config.accounts[4], ethers.provider)
    console.log("info is : " ,admin.address,buyer.address,network.config.chainId);

    //deploy USDC
    let totalSupply = "100000000000000";
    dUsdcContract = await deployERC20("USDC","USDC",totalSupply,6,admin);
    let buyAmount = "10000000000"

    //
    await dUsdcContract.transfer(buyer.address,buyAmount);
    console.log("usdc contract address : " + dUsdcContract.address);
    await writeConfig(0,0,"USDC_ADDRESS",dUsdcContract.address);
  




}



main();

