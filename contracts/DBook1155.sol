pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;


import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract DBook1155 is ERC1155,Ownable{

    string private _name;
    string private _symbol;
    address private _platformAddress;

    /**
     * @dev onlyPlatform modifier for only platform contract call
     */
    modifier onlyPlatform() {
    
      require(_platformAddress == msg.sender, "only platform contract can do the task");
      _;
    
    }

    /**
     * @dev constructor
       @param name 1155 token name
       @param symbol 1155 token symblol
       @param uri 1155 token uri
     */
    constructor (string memory name, string memory symbol, string memory uri) public
        ERC1155(uri)
    {
        _name = name;
        _symbol = symbol;
    }

    /**
     * @dev {IERC1155Metadata-name}.
       @return return 1155 token name
     */
    function name() external view returns (string memory) {
        return _name;
    }

    /**
     * @dev symbol {IERC1155Metadata-symbol}.
       @return return 1155 token symbol
     */
    function symbol() external view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev set platform address for mint right
       @param platformAddress platformAddress of contract 
     */
    function setPlatformAddress(address platformAddress) external onlyOwner{
        _platformAddress = platformAddress;
    }

    /**
    * @dev mint nft asset which can only be done by platform contract
      @param to minted 1155 assect receive address
      @param tokenId tokenId for 1155
      @param amount token amount for 1155
      @param data metadata for 1155 ex 0x1234
    */
    function mint(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes calldata data
    ) external onlyPlatform{
       super._mint(to, tokenId,amount,data);
    }

    /**
    * @dev mint nft asset which can only be done by platform contract
      @param account minted 1155 assect receive address
      @param tokenId tokenId for 1155
      @param amount token amount for 1155
    */
    function burn(
        address account,
        uint256 tokenId,
        uint256 amount
    ) external onlyPlatform{
       super._burn(account, tokenId,amount);
    }
}


