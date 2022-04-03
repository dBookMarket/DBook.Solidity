pragma solidity 0.6.6;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./DBook1155.sol";
import "hardhat/console.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * PLEASE DO NOT USE THIS CODE IN PRODUCTION.
 */
contract DBookPlatform is Initializable{

    using Address for address;
    using SafeMath for uint;
    
    address _adminAddress;
    address internal _token1155;
    address internal _token20;
    address[] internal _minterBurnList;
    uint256 _fee;
    uint256 _platformRatio;
    string _version;
    bool _isFrozen;
    uint256 _customRatioMax;
    address _platformAddress;

    mapping(uint256 => address) internal _nftIdPublisherAddressMap;
    mapping(uint256 => uint256) internal _nftIdPublisherRatioMap;
    mapping(uint256 => uint256) internal _nftIdPriceMap;

    event Issue (
        address to,
        uint256 nftId,
        uint256 amount,
        bytes data,
        uint256 price,
        address publisherAddress,
        uint256 publisherRatio
    );

    event Trade(
        address seller,
        address receiver,
        uint256 nftId,
        uint256 nftAmount,
        bytes data,
        uint256 tradeValue,
        uint256 fee
    );

    /**
     * @dev onlyAdmin modifier for only admin
     */
    modifier onlyAdmin() {
        require(_adminAddress == msg.sender, "only owner can do the task");
        _;
    }

    /**
     * @dev only not frozen
     */
    modifier notFrozed() {
        require( !_isFrozen, "Can not work,because is frozed");
        _;
    }

    /**
     * @dev __DBookPlatform_init
       @param token1155 1155 token address
       @param version DBook Platform version
     */
    function __DBookPlatform_init(address token1155, address token20,string memory version) public initializer{
        
        _token1155 = token1155;
        _token20 = token20;
        _adminAddress = msg.sender;
        _version = version;
        _isFrozen = false;
        _customRatioMax = 10000;
       
    }

    /**
     * @dev 4.setVersion
       @param  version new version from upgrade
     */
    function setVersion(string calldata version) external onlyAdmin{
        _version = version;
    }

    /**
     * @dev 4.getVersion
       @return return DBook version
     */
    function getVersion() external view returns(string memory){
        return _version;
    }

    /**
    * @dev 1.issue nft asset which can only be done by platform contract
      @param to minted 1155 assect receive address
      @param nftId nftId for 1155
      @param amount token amount for 1155
      @param data metadata for 1155 ex 0x1234
      @param price issue price of the 1155 nft
      @param publisherAddress publisher address get profit
      @param publisherRatio publisher ratio when trade unit as %%
    */
    function issue(
        address to,
        uint256 nftId,
        uint256 amount,
        bytes calldata data,
        uint256 price,
        address publisherAddress,
        uint256 publisherRatio
    ) external notFrozed{

        _checkAuth();

        _nftIdPriceMap[nftId] = price;
        _nftIdPublisherAddressMap[nftId] = publisherAddress;
        _nftIdPublisherRatioMap[nftId] = publisherRatio;

        DBook1155(_token1155).mint(to, nftId,amount,data);
        emit Issue(
            to,
            nftId,
            amount,
            data,
            price,
            publisherAddress,
            publisherRatio         
        );
   
    }

    /**
    * @dev 1.set nft price
      @param nftId nft id to set
      @param price nft price for issue
    */
    function setNftPrice(
        uint256 nftId,
        uint256 price
    ) external {

      _checkNftSettingAuth(nftId,msg.sender);
      _nftIdPriceMap[nftId] = price;
   
    }

    /**
    * @dev 1.get nft price
      @return return nft price
    */
    function getNftPrice(uint256 nftId) view external returns(uint256) {

       return _nftIdPriceMap[nftId];
    
    }

    /**
    * @dev 1.set publisher Address
      @param nftId nft id to set
      @param publishAddress publish Address
    */
    function setPublisherAddress(
        uint256 nftId,
        address publishAddress
    ) external {

      _checkNftSettingAuth(nftId,msg.sender);
      _nftIdPublisherAddressMap[nftId] = publishAddress;
   
    }

    /**
    * @dev 1.get publish address of nft 
      @return return get Publisher Address
    */
    function getPublisherAddress(uint256 nftId) view external returns(address) {

       return _nftIdPublisherAddressMap[nftId];
    
    }


    /**
    * @dev 1.set publisher ratio
      @param nftId nft id to set
      @param publishRatio publish Radio %%
    */
    function setPublisherRatio(
        uint256 nftId,
        uint256 publishRatio
    ) external {

      _checkNftSettingAuth(nftId,msg.sender);
      _nftIdPublisherRatioMap[nftId] = publishRatio;
   
    }

    /**
    * @dev 1.get publish ratio of nft 
      @return return get Publisher ratio %%
    */
    function getPublisherRatio(uint256 nftId) view external returns(uint256){

       return _nftIdPublisherRatioMap[nftId];
    
    }   
    
    
    /**
    * @dev _checkNftSettingAuth
    * 1.check nft setting auth
    */
    function _checkNftSettingAuth(uint256 nftId,address owner) view internal {

      uint256 nftBalance;
      nftBalance = DBook1155(_token1155).balanceOf(owner,nftId);

      require(
        msg.sender == _adminAddress || nftBalance > 0,
        "only admin or nft owner can change the setting"
        );
    }


    /**
    * @dev _checkAuth
    * 2.check auth
    */
    function _checkAuth() internal view{

        uint256 len = _minterBurnList.length;
        bool isExist = false;
        for(uint256 i = 0 ;i < len ;i ++ ){
            if(msg.sender == _minterBurnList[i]){
                isExist = true;
                break;
            }
        }
        require(isExist,"do not have the right to mint or burn");
    }

    /**
    * @dev 2.addAuth
    * @param minter minter address to add
    */
    function addAuth(address minter) external onlyAdmin{
        _minterBurnList.push(minter);
    }

    /**
    * @dev 2.delAuth
    * @param minter minter address to add
    */
    function delAuth(address minter) external onlyAdmin{

        uint256 len = _minterBurnList.length;
        for(uint256 i = 0 ;i < len ;i ++){
            if(_minterBurnList[i] == minter){
                _minterBurnList[i] = _minterBurnList[len - 1];
                _minterBurnList.pop();
            }
        }
    }

    /**
    * @dev 2.getIssueList
    * @return address list
    */
    function getIssueList() external view returns(address[] memory){
        return _minterBurnList;
    }

    /**
    * @dev 3.set fee platformRatio
      @param receiver nft receiver address 
      @param nftId nft Id to sell
      @param nftAmount nft Number to sell
      @param data nft trade metadata ex memo
      @param tradeValue the traceValue = nftPrice * nftAmount
      @param fee fee to platform unit is usdc can be set to 0
    */
    function trade(
        address seller,
        address receiver,
        uint256 nftId,
        uint256 nftAmount,
        bytes calldata data,
        uint256 tradeValue,
        uint256 fee
    ) external notFrozed{

        uint256 platformIncome;
        uint256 publisherIncome;
        uint256 sellerIncome;
        bool transferResult;

        require(fee >= _fee,"fee is not enough");
        require(
            IERC20(_token20).balanceOf(msg.sender) >= (tradeValue+fee),
            "balance is not enough"
        );
        require(
            _nftIdPriceMap[nftId] != 0,
            "nft Id does not set price"
        );
        require(
            tradeValue >= _nftIdPriceMap[nftId]*nftAmount,
            "trace value is not enough"
        );
        require(
            _nftIdPublisherRatioMap[nftId] != 0,
            "nft Id does not set ratio"
        ); 
        require(
            _nftIdPublisherAddressMap[nftId] != address(0),
            "nft Id does not set publisher"
        );
        require(
            DBook1155(_token1155).balanceOf(seller,nftId) >= nftAmount,
            "selller do not have enough nft number"
        );
 
        //1.send the nft to receiver
        DBook1155(_token1155).safeTransferFrom(seller,receiver,nftId,nftAmount,data);
        //2.send to platform
        platformIncome = tradeValue.mul(_platformRatio).div(_customRatioMax).add(fee);
        transferResult = IERC20(_token20).transferFrom(msg.sender,_platformAddress,platformIncome);
        require(transferResult,"send to platform failed");
        //3.send to publisher
        publisherIncome = tradeValue.mul(_nftIdPublisherRatioMap[nftId]).div(_customRatioMax);
        transferResult = IERC20(_token20).transferFrom(msg.sender,_nftIdPublisherAddressMap[nftId],publisherIncome);
        require(transferResult,"send to publisher failed");
        //4.send to seller
        sellerIncome = tradeValue - platformIncome - publisherIncome;
        transferResult = IERC20(_token20).transferFrom(msg.sender,seller,sellerIncome);
        require(transferResult,"send to seller failed");

        emit Trade(
          seller,
          receiver,
          nftId,
          nftAmount,
          data,
          tradeValue,
          fee
        );

    }

    /**
    * @dev 5.set fee platformRatio
      @param platformRatio the platform ratio for trade as the unit for %%,ex 2.5% = 250
    */
    function setPlatformRatio(
        uint256 platformRatio
    ) external onlyAdmin {

       _platformRatio = platformRatio;
   
    }

    /**
    * @dev 5.set fee platformRatio
      @return return platform ratio
    */
    function getPlatformRatio() view external returns(uint256){

       return _platformRatio;
    
    }

    /**
    * @dev 5.set fee percent
      @param fee the fee for trade 
    */
    function setFee(
        uint256 fee
    ) external onlyAdmin {

       _fee = fee;
    }

    /**
    * @dev 5.get fee 
      @return return get fee with usdc
    */
    function getFee() view external returns(uint256){

       return _fee;
    }

    /**
    * @dev 6.set the frozen logic
      @param isFrozen minted 1155 assect receive address
    */
    function setFrozen(
        bool isFrozen
    ) external onlyAdmin {

       _isFrozen = isFrozen;
    }

    /**
    * @dev 6.get the froze status
      @return return get the frozen status
    */
    function getFrozen() view external returns(bool){

       return _isFrozen;
    }

    /**
    * @dev 7.set the plat form address for get the profix
      @param platformAddress platfrom address
    */
    function setPlatformAddress(
        address platformAddress
    ) external onlyAdmin {

       _platformAddress = platformAddress;
    }

    /**
    * @dev 7.get the plat form address for get the profix
      @return return  platfrom address
    */
    function getPlatformAddress() view external returns(address){

       return _platformAddress;
    }


}
