// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const initialSupply = '10000000000000000000000'
  const name = 'MToken'

  await deploy('SimpleToken', {
    from: deployer,
    args: [ name,name,initialSupply],
    log: true
  })
}

func.tags = [ 'ERC20' ]
module.exports = func
