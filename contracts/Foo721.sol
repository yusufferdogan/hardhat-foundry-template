// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract Foo721 is ERC721, Ownable {
    uint256 public tokenCount;

    uint256 public constant MAX_SUPPLY = 2;
    uint256 public constant MINT_PRICE = 1 ether;
    // solhint-disable-next-line var-name-mixedcase
    uint256 public immutable MINT_DATE;
    string public baseURI;

    error InsufficientFunds();
    error MaxSupplyExceeded();
    error AlreadyFreeMinted();
    error FreeMintExceeded();
    error TransferTxError();
    error InvalidDate();

    constructor(uint256 _mintDate) ERC721("FooNFT", "F_NFT") {
        MINT_DATE = _mintDate;
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        baseURI = baseURI_;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function mint(address to) external payable {
        // solhint-disable-next-line not-rely-on-time
        if (block.timestamp < MINT_DATE) revert InvalidDate();

        if (msg.value < MINT_PRICE) revert InsufficientFunds();

        if (tokenCount + 1 > MAX_SUPPLY) revert MaxSupplyExceeded();

        _mint(to, tokenCount++);
    }

    function withdraw() external onlyOwner {
        // solhint-disable-next-line avoid-low-level-calls
        (bool isSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");

        if (!isSuccess) revert TransferTxError();
    }
}
