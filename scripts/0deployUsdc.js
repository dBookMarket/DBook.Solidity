const { ethers } = require('hardhat')

const {
    deployERC20,
    writeConfig
} = require('./utils/helper')

const main = async () => {

    let chainId = await getChainId();
    console.log("chainId is : " + chainId);

    [admin,platform,seller,publisher,buyer] = await ethers.getSigners()

    //deploy USDC
    let totalSupply = "100000000000000";
    dUsdcContract = await deployERC20("USDC","USDC",totalSupply,6,admin);
    let buyAmount = "10000000000"
    await dUsdcContract.transfer(buyer.address,buyAmount);

    console.log("usdc contract address : " + dUsdcContract.address);
    await writeConfig(0,0,"USDC_ADDRESS",dUsdcContract.address);
  




}



main();

