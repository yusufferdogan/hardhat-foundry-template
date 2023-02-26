// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "forge-std/console.sol";

import "../contracts/Foo721.sol";

contract Foo721Test is Test {
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    Foo721 t;

    function setUp() public {
        emit log_uint(address(this).balance);
        t = new Foo721(10);
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
        vm.assume(addr != address(this));
        emit log_named_uint("time:", block.timestamp);
        vm.expectRevert(bytes("Ownable: caller is not the owner"));
        vm.prank(addr);
        t.setBaseURI("asd");
    }

    function testMintDate() public {
        vm.expectRevert(Foo721.InvalidDate.selector);
        t.mint(address(this));
    }

    function testMintPrice() public {
        skip(10);
        vm.expectRevert(Foo721.InsufficientFunds.selector);
        t.mint(address(this));
    }

    function testMaxSupply(address addr) public {
        skip(10);
        uint256 supply = t.MAX_SUPPLY();
        for (uint i = 0; i < supply; i++) {
            address minter = address(uint160(0xabc << i));
            vm.deal(minter, 1 ether);
            t.mint{ value: 1 ether }(address(0xa));
        }
        vm.deal(addr, 1 ether);
        vm.expectRevert(Foo721.MaxSupplyExceeded.selector);
        t.mint{ value: 1 ether }(address(0xa));
    }

    function testMint() public {
        skip(10);
        assertEq(t.balanceOf(address(this)), 0);
        vm.expectEmit(true, true, true, true);
        emit Transfer(address(0), address(this), 0);
        t.mint{ value: 1 ether }(address(this));
        assertEq(t.balanceOf(address(this)), 1);
    }

    function testWithdraw() public {
        uint256 beforeBalance = address(this).balance;
        skip(10);
        uint256 supply = t.MAX_SUPPLY();
        for (uint i = 0; i < supply; i++) {
            address minter = address(uint160(0xabc << i));
            vm.deal(minter, 1 ether);
            vm.prank(minter);
            t.mint{ value: 1 ether }(minter);
        }
        t.withdraw();
        uint256 afterBalance = address(this).balance;
        assertEq(beforeBalance + supply * 1 ether, afterBalance);
    }

    receive() external payable {}
}
