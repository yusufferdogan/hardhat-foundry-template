// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(uint256 amount) ERC20("Token", "F_TOKEN") {
        _mint(msg.sender, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 1;
    }
}
