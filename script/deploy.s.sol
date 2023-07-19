// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { StdUtils } from "forge-std/StdUtils.sol";
import "../contracts/Token.sol";

contract MyScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Token token = new Token(10000000000);

        console.log(address(token));

        console.log(
            "public key is ",
            StdUtils.boundPrivateKey(deployerPrivateKey)
        );

        vm.stopBroadcast();
    }
}
