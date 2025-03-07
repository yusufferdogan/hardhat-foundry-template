import fs from 'fs';
import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import 'hardhat-preprocessor';
//--------------------------------------------
import '@nomiclabs/hardhat-etherscan';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import 'solidity-coverage';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';
import 'hardhat-docgen';
import 'hardhat-spdx-license-identifier';
import '@nomicfoundation/hardhat-chai-matchers';

// import '@tenderly/hardhat-tenderly';
// import 'hardhat-tracer';
// import 'hardhat-storage-layout';
// import 'hardhat-finder';
// import { HardhatUserConfig, task } from 'hardhat/config';

dotenv.config();
function getRemappings() {
  return fs
    .readFileSync('remappings.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => line.trim().split('='));
}

// task('example', 'Example task').setAction(example);

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    enabled: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || '',
    gasPriceApi:
      'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice',
    token: 'ETH',
    currency: 'USD',
  },
  networks: {
    goerli: {
      url: String(process.env.GOERLI_URL),
      accounts: [`0x${process.env.DEPLOYER_WALLET_PRIVATE_KEY}`],
      chainId: 5,
    },
    avalancheFujiTestnet: {
      url: process.env.AVALANCHE_FUJI_TESTNET_RPC_URL || '',
      accounts: [`0x${process.env.DEPLOYER_WALLET_PRIVATE_KEY}`],
    },
    bscTestnet: {
      url: process.env.BSC_TESTNET_RPC_URL || '',
      accounts: [`0x${process.env.DEPLOYER_WALLET_PRIVATE_KEY}`],
    },
    arbitrumTestnet: {
      url: process.env.ARBITRUM_TESTNET_RPC_URL || '',
      accounts: [`0x${process.env.DEPLOYER_WALLET_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY || '',
      arbitrumTestnet: process.env.ARBISCAN_API_KEY || '',
      auroraTestnet: process.env.AURORA_API_KEY || '',
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || '',
      bscTestnet: process.env.BSCSCAN_API_KEY || '',
      ftmTestnet: process.env.FTMSCAN_API_KEY || '',
      harmonyTest: process.env.HARMONY_POPS_API_KEY || '',
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || '',
    },
  },
  paths: {
    sources: 'contracts', // Use ./src rather than ./contracts as Hardhat expects
    cache: './cache', // Use a different cache for Hardhat than Foundry
  },
  // This fully resolves paths for imports in the ./lib directory for Hardhat
  preprocess: {
    eachLine: (hre: any) => ({
      transform: (line: string) => {
        hre;
        if (line.match(/^\s*import /i)) {
          getRemappings().forEach(([find, replace]) => {
            if (line.match(find)) {
              line = line.replace(find, replace);
            }
          });
        }
        return line;
      },
    }),
  },
};

export default config;
