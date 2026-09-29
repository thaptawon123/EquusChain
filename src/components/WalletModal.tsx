import React, { useState } from 'react';
import { WalletState, Web3Transaction } from '../types/horse';
import { X, Wallet, ArrowUpRight, Copy, Check, RefreshCw, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onRefreshBalance: () => void;
  onSwitchToSepolia: () => void;
  onConnectMetaMask: () => void;
  transactions: Web3Transaction[];
  lang: 'th' | 'en';
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onRefreshBalance,
  onSwitchToSepolia,
  onConnectMetaMask,
  transactions,
  lang
}) => {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshBalance();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                <span>{lang === 'th' ? 'กระเป๋าเงิน MetaMask บน Sepolia' : 'MetaMask on Sepolia'}</span>
                {wallet.isSepolia && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                    Chain 11155111
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-stone-400 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${wallet.isSepolia ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{wallet.networkName}</span>
                <span aria-hidden="true">·</span>
                <span>{wallet.isMetaMask ? 'MetaMask Injected' : 'Connected'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Network Switch Warning if not on Sepolia */}
          {!wallet.isSepolia && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{lang === 'th' ? 'โปรดสลับไปยังเครือข่าย Sepolia Testnet' : 'Please switch to Sepolia Testnet'}</span>
              </div>
              <button
                onClick={onSwitchToSepolia}
                className="px-3 py-1 bg-amber-400 text-stone-950 font-bold rounded hover:bg-amber-300 transition-colors"
              >
                {lang === 'th' ? 'สลับทันที' : 'Switch'}
              </button>
            </div>
          )}

          {/* Address Box */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 uppercase tracking-wider mb-1">
              <span>{lang === 'th' ? 'ที่อยู่บัญชีใน MetaMask (Account 1)' : 'MetaMask Account'}</span>
              <a
                href={`https://sepolia.etherscan.io/address/${wallet.address}`}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Sepolia Etherscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs sm:text-sm text-stone-200 select-all truncate">
                {wallet.address}
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-900 rounded transition-colors"
                title="Copy Address"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Balance card with Live Sepolia balance */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800">
            <div className="flex items-center justify-between text-xs font-mono text-stone-400 uppercase tracking-wider">
              <span>{lang === 'th' ? 'ยอดคงเหลือบนเชน Sepolia' : 'On-Chain Sepolia Balance'}</span>
              <button
                onClick={handleRefresh}
                className="text-stone-400 hover:text-stone-200 flex items-center gap-1 text-[11px]"
                title="Refresh on-chain balance"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{lang === 'th' ? 'อัปเดตยอด' : 'Refresh'}</span>
              </button>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-amber-400 tabular-nums">
                {wallet.balanceEth.toFixed(4)}
              </span>
              <span className="font-mono text-stone-200 font-semibold text-xl">SepoliaETH</span>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="text-stone-400">
                {lang === 'th' ? 'ต้องการ SepoliaETH เพิ่ม?' : 'Need more SepoliaETH?'}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded border border-stone-700 inline-flex items-center gap-1"
                >
                  <span>Google Faucet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://sepoliafaucet.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 inline-flex items-center gap-1"
                >
                  <span>Alchemy Faucet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onConnectMetaMask}
              className="flex-1 py-2.5 px-3 text-xs font-semibold bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg text-stone-200 transition-colors font-mono flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'เชื่อมต่อใหม่ / สลับบัญชี' : 'Reconnect MetaMask'}</span>
            </button>

            {!wallet.isSepolia && (
              <button
                onClick={onSwitchToSepolia}
                className="flex-1 py-2.5 px-3 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg transition-colors font-mono"
              >
                {lang === 'th' ? 'สลับไป Sepolia' : 'Switch Network'}
              </button>
            )}
          </div>

          {/* Recent On-Chain Transactions */}
          <div>
            <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>{lang === 'th' ? 'ธุรกรรมบน Sepolia (On-Chain Activity)' : 'Sepolia Transactions'}</span>
              <span className="text-[11px] text-stone-500">{transactions.length} txs</span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-4 text-center text-xs font-mono text-stone-500 border border-dashed border-stone-800 rounded-lg">
                {lang === 'th' ? 'ยังไม่มีธุรกรรมที่ดำเนินการผ่านกระเป๋านี้' : 'No transactions recorded yet in this session'}
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.hash}
                    className="p-2.5 rounded-lg bg-stone-950 border border-stone-800/80 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-200">
                          {tx.type} {tx.horseName}
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">
                          Block #{tx.blockNumber}
                        </span>
                      </div>
                      <a
                        href={tx.etherscanUrl || `https://sepolia.etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-amber-400/90 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate max-w-[200px]">{tx.hash}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-amber-400 tabular-nums">
                        {tx.amountEth > 0 ? `-${tx.amountEth} SepoliaETH` : '0 ETH'}
                      </div>
                      <div className="text-[10px] text-emerald-400">Confirmed</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
