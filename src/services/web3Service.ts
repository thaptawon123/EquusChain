import { ethers } from 'ethers';
import { HORSE_NFT_SOL, HORSE_MARKETPLACE_SOL } from '../contracts/contractData';

export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';

export const SEPOLIA_CONFIG = {
  chainId: SEPOLIA_CHAIN_ID_HEX,
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'SepoliaETH',
    decimals: 18,
  },
  rpcUrls: [
    'https://rpc.sepolia.org',
    'https://ethereum-sepolia-rpc.publicnode.com',
    'https://1rpc.io/sepolia'
  ],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

// Admin wallet receiving all horse sales
export const ADMIN_WALLET_ADDRESS = '0x6437b1540da8566D1297bFb4126BA7324108387b';
export const SEPOLIA_MARKETPLACE_RECEIVER = '0x6437b1540da8566D1297bFb4126BA7324108387b';

export interface Web3ProviderState {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  balanceEth: number;
  chainId: number | null;
  isSepolia: boolean;
  hasMetaMask: boolean;
  isConnecting: boolean;
  error: string | null;
}

export async function getEthereum(): Promise<any> {
  if (typeof window === 'undefined') return null;
  return (window as any).ethereum || null;
}

/**
 * Switch or add Sepolia network in MetaMask
 */
export async function switchToSepolia(): Promise<boolean> {
  const eth = await getEthereum();
  if (!eth) throw new Error('MetaMask not detected');

  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
    return true;
  } catch (switchError: any) {
    // 4902: Chain not added yet
    if (switchError.code === 4902) {
      try {
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [SEPOLIA_CONFIG],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Sepolia network:', addError);
        throw addError;
      }
    }
    console.error('Failed to switch to Sepolia:', switchError);
    throw switchError;
  }
}

/**
 * Connect to MetaMask on Sepolia
 */
export async function connectSepoliaWallet(): Promise<{
  address: string;
  balance: number;
  chainId: number;
}> {
  const eth = await getEthereum();
  if (!eth) {
    throw new Error('ไม่พบ MetaMask ในเบราว์เซอร์ กรุณาติดตั้ง MetaMask Extension');
  }

  // Ensure Sepolia
  await switchToSepolia();

  // Request accounts
  const accounts: string[] = await eth.request({
    method: 'eth_requestAccounts',
  });

  if (!accounts || accounts.length === 0) {
    throw new Error('ไม่ได้เลือกบัญชีใน MetaMask');
  }

  const provider = new ethers.BrowserProvider(eth);
  const network = await provider.getNetwork();
  const balanceBigInt = await provider.getBalance(accounts[0]);
  const balance = parseFloat(ethers.formatEther(balanceBigInt));

  return {
    address: accounts[0],
    balance,
    chainId: Number(network.chainId),
  };
}

/**
 * Fetch live balance from Sepolia
 */
export async function fetchSepoliaBalance(address: string): Promise<number> {
  const eth = await getEthereum();
  if (!eth) return 0;
  try {
    const provider = new ethers.BrowserProvider(eth);
    const balanceBigInt = await provider.getBalance(address);
    return parseFloat(ethers.formatEther(balanceBigInt));
  } catch (err) {
    console.error('Error fetching balance:', err);
    return 0;
  }
}

/**
 * Send real Sepolia ETH transaction via MetaMask
 */
export async function sendSepoliaTransaction({
  to,
  amountEth,
  data = '0x',
}: {
  to: string;
  amountEth: number;
  data?: string;
}): Promise<{ hash: string; blockNumber: number }> {
  const eth = await getEthereum();
  if (!eth) throw new Error('MetaMask not detected');

  await switchToSepolia();

  const provider = new ethers.BrowserProvider(eth);
  const signer = await provider.getSigner();

  const tx = await signer.sendTransaction({
    to,
    value: ethers.parseEther(amountEth.toFixed(6)),
    data: data || '0x',
  });

  // Wait for 1 confirmation on Sepolia
  const receipt = await tx.wait(1);

  return {
    hash: tx.hash,
    blockNumber: receipt?.blockNumber || 0,
  };
}
