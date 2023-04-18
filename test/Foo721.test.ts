import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect, assert } from 'chai';
import { constants } from 'ethers';
import { ethers } from 'hardhat';

// eslint-disable-next-line node/no-missing-import
import type { Foo721, Foo721__factory } from '../typechain-types';

const name: string = 'Foo721';

describe(name, () => {
  let contract: Foo721;
  let owner: SignerWithAddress;
  let addresses: SignerWithAddress[];
  let factory: Foo721__factory;
  const MINT_PRICE = ethers.utils.parseEther('1');

  // hooks
  before(async () => {
    [owner, ...addresses] = await ethers.getSigners();
    factory = await ethers.getContractFactory(name);
  });

  beforeEach(async () => {
    const now = Math.floor(+new Date() / 1000);
    contract = await factory.deploy(now + 750);
  });

  // mint tests
  it('should MINT successfully', async () => {
    await ethers.provider.send('evm_increaseTime', [1000]);

    await expect(
      contract.mint(addresses[0].address, { value: String(MINT_PRICE) })
    )
      .to.emit(contract, 'Transfer')
      .withArgs(constants.AddressZero, addresses[0].address, 0);

    await ethers.provider.send('evm_increaseTime', [-1000]);
  });

  // it('should not MINT if max supply exceeds', async () => {
  //   await ethers.provider.send('evm_increaseTime', [1000]);

  //   await contract.mint(addresses[5].address, {
  //     value: String(MINT_PRICE.mul(100)),
  //   });

  //   await expect(
  //     contract.mint(addresses[7].address, {
  //       value: String(MINT_PRICE.mul(1)),
  //     })
  //   ).to.be.revertedWithCustomError(contract, 'MaxSupplyExceeded()');
  //   await ethers.provider.send('evm_increaseTime', [-1000]);
  // });

  it('should not MINT if InsufficientFunds', async () => {
    await ethers.provider.send('evm_increaseTime', [1000]);

    await expect(
      contract.mint(addresses[0].address)
    ).to.be.revertedWithCustomError(contract, 'InsufficientFunds');

    await ethers.provider.send('evm_increaseTime', [-1000]);
  });

  // withdraw tests
  it('should withdraw eth successfully', async () => {
    await ethers.provider.send('evm_increaseTime', [1000]);

    await contract.mint(addresses[5].address, {
      value: String(MINT_PRICE),
    });

    const beforeBalance = await ethers.provider.getBalance(owner.address);

    const tx = await contract.withdraw();

    const afterBalance = await ethers.provider.getBalance(owner.address);

    const receipt = await tx.wait();

    const fee = receipt.effectiveGasPrice * receipt.gasUsed;

    assert.equal(
      beforeBalance.add(MINT_PRICE).sub(fee).toString(),
      afterBalance.toString()
    );
    await ethers.provider.send('evm_increaseTime', [-1000]);
  });

  it('get base uri', async () => {
    await ethers.provider.send('evm_increaseTime', [1000]);

    await contract.mint(addresses[5].address, {
      value: String(MINT_PRICE),
    });

    await contract.setBaseURI('asd/');
    const tokenUri = await contract.tokenURI(0);
    assert.equal('asd/0', tokenUri);
  });
});
