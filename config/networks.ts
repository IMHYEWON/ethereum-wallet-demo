export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockTime: number;
  isTestnet: boolean;
}

export const NETWORKS: Record<string, NetworkConfig> = {
  mainnet: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockTime: 12,
    isTestnet: false,
  },
  sepolia: {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
    explorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18,
    },
    blockTime: 12,
    isTestnet: true,
  },
  goerli: {
    name: 'Goerli Testnet',
    chainId: 5,
    rpcUrl: 'https://goerli.infura.io/v3/YOUR_PROJECT_ID',
    explorerUrl: 'https://goerli.etherscan.io',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockTime: 12,
    isTestnet: true,
  },
  localhost: {
    name: 'Local Development',
    chainId: 1337,
    rpcUrl: 'http://localhost:8545',
    explorerUrl: 'http://localhost:3000',
    nativeCurrency: {
      name: 'Local Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockTime: 0,
    isTestnet: true,
  },
};

export const DEFAULT_NETWORK = 'sepolia';

export function getNetworkConfig(chainId: number): NetworkConfig | undefined {
  return Object.values(NETWORKS).find(network => network.chainId === chainId);
}

export function getNetworkConfigByName(name: string): NetworkConfig | undefined {
  return NETWORKS[name];
}

export function isTestnet(chainId: number): boolean {
  const network = getNetworkConfig(chainId);
  return network?.isTestnet ?? false;
}
