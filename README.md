# <h1 align="center"> Hardhat x Foundry Template </h1>

**Template repository for getting started quickly with Hardhat and Foundry in one project**

![Github Actions](https://github.com/devanonon/hardhat-foundry-template/workflows/test/badge.svg)

### Getting Started

- Prepare

```bash
yarn run prepare
```

- Use Foundry:

```bash
forge install
forge test
```

- Use Hardhat:

```bash
npm install
npx hardhat test
```

### Features

- Write / run tests with either Hardhat or Foundry:

```bash
forge test
# or
npx hardhat test
```

- Foundry Coverage

```bash
forge coverage --report lcov
```

- Foundry run single test

```bash
  forge test --match-path test/Foo721.t.sol
```

- Use Hardhat's task framework

```bash
npx hardhat example
```

- Install libraries with Foundry which work with Hardhat.

```bash
forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-contracts
```

## Myhtril

install ➡️

```bash
 pip3 install mythril
 PATH+=":$HOME/.local/bin/"
```

use ➡️

```bash
 myth analyze contracts/Foo721.sol --solc-json mythril.config.json
```

## Slither

install ➡️

```bash
 pip3 install slither-analyzer
 PATH+=":$HOME/.local/bin/"
```

use ➡️

```bash
 slither contracts/Foo721.sol
```

### Notes

Whenever you install new libraries using Foundry, make sure to update your `remappings.txt` file by running `forge remappings > remappings.txt`. This is required because we use `hardhat-preprocessor` and the `remappings.txt` file to allow Hardhat to resolve libraries you install with Foundry.

### TODO

- [x] Fix hardhat coverage

![image](https://user-images.githubusercontent.com/45846424/225307686-0a0e37ff-1cb9-419a-bc2d-f92bbebd4871.png)

