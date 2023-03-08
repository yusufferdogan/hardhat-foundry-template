// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "../contracts/Token.sol";

contract TokenTest is Test {
    Token t;

    function setUp() public {
        t = new Token(100000000000);
    }

    function testName() public {
        assertEq(t.name(), "Token");
    }

    function testDecimal() public {
        assertEq(t.decimals(), 1);
    }
}
