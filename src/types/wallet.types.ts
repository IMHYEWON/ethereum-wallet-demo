export interface WalletInfo {
  address: string;
  privateKey: string;
  publicKey: string;
  mnemonic?: string;
  balance: string;
  nonce: number;
}

export interface WalletBackup {
  address: string;
  encryptedPrivateKey: string;
  iv: string;
  salt: string;
  mnemonic?: string;
  createdAt: Date;
}

export interface WalletImportOptions {
  privateKey?: string;
  mnemonic?: string;
  password?: string;
}

export interface WalletCreateOptions {
  password?: string;
  generateMnemonic?: boolean;
  mnemonicLength?: 12 | 15 | 18 | 21 | 24;
}

export interface WalletBalance {
  address: string;
  eth: string;
  tokens: TokenBalance[];
  lastUpdated: Date;
}

export interface TokenBalance {
  contractAddress: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
}
