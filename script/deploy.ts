// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Contract, ContractFactory } from 'ethers';
import { ethers, run } from 'hardhat';

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const TokenName: string = 'Token';
  const constructorArgs: Array<string | number | Array<string | number>> = [
    '100000000000000',
  ];
  const factory: ContractFactory = await ethers.getContractFactory(TokenName);
  const contract: Contract = await factory.deploy(...constructorArgs);
  await contract.deployed();
  console.log(TokenName + ' deployed to:', contract.address);

  await setTimeout(async () => {
    // verify contracts on explorer
    await run('verify:verify', {
      address: contract.address,
      constructorArguments: constructorArgs,
    });
  }, 1000 * 60); // 60 secs
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
