export type Bloodline = 'Thoroughbred' | 'Arabian' | 'Andalusian' | 'Pegasus' | 'Mustang';
export type Gender = 'Stallion' | 'Mare';

export interface HorseItem {
  id: number;
  tokenId: number;
  name: string;
  thaiName: string;
  bloodline: Bloodline;
  gender: Gender;
  generation: number;
  speed: number;        // 1 - 100
  stamina: number;      // 1 - 100
  agility: number;      // 1 - 100
  temperament: number;  // 1 - 100
  racesWon: number;
  totalRaces: number;
  birthDate: string;
  sireName?: string;
  damName?: string;
  image: string;
  priceEth: number;
  isListed: boolean;
  owner: string;
  description: string;
  thaiDescription: string;
  dnaHash: string;
  contractAddress: string;
  accentColor?: string;
}

export interface Web3Transaction {
  hash: string;
  type: 'BUY' | 'MINT' | 'LIST' | 'DELIST' | 'TRAIN' | 'BREED';
  timestamp: number;
  amountEth: number;
  horseName: string;
  tokenId: number;
  status: 'confirmed' | 'pending' | 'failed';
  blockNumber: number;
  etherscanUrl?: string;
}

export interface WalletState {
  address: string;
  balanceEth: number;
  isConnected: boolean;
  isMetaMask: boolean;
  networkName: string;
  chainId: number;
  isSepolia: boolean;
}
