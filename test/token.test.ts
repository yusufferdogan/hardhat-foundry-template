import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect, assert } from 'chai';
import { constants, BigNumber } from 'ethers';
import { ethers } from 'hardhat';

// eslint-disable-next-line node/no-missing-import
import type { Token, Token__factory } from '../typechain-types';

describe('Token', () => {
  let Token: Token;
  let TokenFactory: Token__factory;
  let owner: SignerWithAddress;
  let addresses: SignerWithAddress[];

  // hooks
  before(async () => {
    [owner, ...addresses] = await ethers.getSigners();
    TokenFactory = (await ethers.getContractFactory('Token')) as Token__factory;
  });

  beforeEach(async () => {
    Token = await TokenFactory.deploy(10000000);
  });

  // fixtures
  async function transferFixture() {
    return await Token.transfer(addresses[0].address, constants.Two);
  }

  // tests
  it('the token name should be correct', async () => {
    // expect
    expect(await Token.name()).to.equal('Token');
  });

  it('the token symbol should be correct', async () => {
    // assert
    assert.equal(
      await Token.symbol(),
      'F_TOKEN',
      'The token symbol must be valid.'
    );
  });

  it('the token decimal should be correct', async () => {
    expect(await Token.decimals()).to.equal(BigNumber.from(1));
  });

  it('the token supply should be correct', async () => {
    expect(await Token.totalSupply()).to.equal(10000000);
  });

  it('reverts when transferring tokens to the zero address', async () => {
    // Conditions that trigger a require statement can be precisely tested
    await expect(
      Token.transfer(constants.AddressZero, constants.One)
    ).to.be.revertedWith('ERC20: transfer to the zero address');
  });

  it('emits a Transfer event on successful transfers', async () => {
    const from: SignerWithAddress = owner;
    const to: SignerWithAddress = addresses[0];
    const value: BigNumber = constants.One;

    await expect(Token.transfer(to.address, value))
      .to.emit(Token, 'Transfer')
      .withArgs(from.address, to.address, value);
  });

  it('token balance successfully changed', async () => {
    const from: SignerWithAddress = owner;
    const to: SignerWithAddress = addresses[0];
    const value: BigNumber = constants.Two;

    await expect(loadFixture(transferFixture)).to.changeTokenBalances(
      Token,
      [from, to],
      [-value, value]
    );
  });
});
