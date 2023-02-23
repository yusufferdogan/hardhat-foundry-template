// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "forge-std/console.sol";

import "../contracts/Foo721.sol";

contract Foo721Test is Test {
    Foo721 t;

    function setUp() public {
        t = new Foo721(100000000000);
    }

    function testBaseUri() public {
        t.setBaseURI("asd");
    }

    function test2BaseUri() public {
        vm.prank(address(0));
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        t.setBaseURI("asd");
    }

    function testFailBaseUri() public {
        vm.prank(address(0));
        vm.expectRevert(bytes("Ownable: asd is not the owner"));
        t.setBaseURI("asd");
    }

    function testFuzzBaseUri(address addr) public {
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        vm.prank(addr);
        t.setBaseURI("asd");
    }

    function testMint() public {}
}
