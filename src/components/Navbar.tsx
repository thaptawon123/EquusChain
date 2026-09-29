import React from 'react';
import { Wallet, AlertTriangle, ShieldCheck, ShoppingBag } from 'lucide-react';
import { WalletState } from '../types/horse';
import { ADMIN_WALLET_ADDRESS } from '../services/web3Service';

interface NavbarProps {
  currentTab: 'marketplace' | 'stable' | 'admin';
  setCurrentTab: (tab: 'marketplace' | 'stable' | 'admin') => void;
  wallet: WalletState;
  onOpenWallet: () => void;
  onSwitchToSepolia: () => void;
  onConnectMetaMask: () => void;
  lang: 'th' | 'en';
  setLang: (lang: 'th' | 'en') => void;
  ownedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  wallet,
  onOpenWallet,
  onSwitchToSepolia,
  onConnectMetaMask,
  lang,
  setLang,
  ownedCount
}) => {
  const isAdmin = wallet.isConnected && wallet.address.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text wordmark in display face */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('marketplace')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:border-amber-400/60 transition-colors">
              <span className="font-serif text-lg font-bold">🐎</span>
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-stone-100 group-hover:text-amber-400 transition-colors">
                EquusChain
              </span>
              <span className="hidden sm:inline text-xs text-amber-400/90 ml-2 font-mono">
                Sepolia
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-400">
          <button
            onClick={() => setCurrentTab('marketplace')}
            className={`transition-colors hover:text-stone-100 ${
              currentTab === 'marketplace'
                ? 'text-amber-400 font-semibold'
                : 'text-stone-400'
            }`}
          >
            {lang === 'th' ? 'ตลาดซื้อขายม้า' : 'Marketplace'}
          </button>

          {/* User's purchased horses */}
          <button
            onClick={() => setCurrentTab('stable')}
            className={`transition-colors hover:text-stone-100 flex items-center gap-1.5 ${
              currentTab === 'stable'
                ? 'text-amber-400 font-semibold'
                : 'text-stone-400'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'th' ? 'ม้าที่ฉันซื้อไปแล้ว' : 'My Purchased Horses'}</span>
            {ownedCount > 0 && (
              <span className="text-xs font-mono text-amber-400/90 bg-amber-400/10 px-1.5 py-0.5 rounded">
                {ownedCount}
              </span>
            )}
          </button>

          {/* Admin Panel Tab - ONLY visible to REAL ADMIN (0x6437b1540da8566D1297bFb4126BA7324108387b) */}
          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`transition-colors hover:text-amber-300 flex items-center gap-1.5 ${
                currentTab === 'admin'
                  ? 'text-amber-400 font-semibold'
                  : 'text-stone-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'th' ? 'เมนูแอดมิน (มิ้นต์ม้า)' : 'Admin Panel'}</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                Admin
              </span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Network indicator badge */}
          {wallet.isConnected && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border border-stone-800 bg-stone-900/80">
              {wallet.isSepolia ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-stone-300">Sepolia</span>
                </>
              ) : (
                <button
                  onClick={onSwitchToSepolia}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Switch to Sepolia</span>
                </button>
              )}
            </div>
          )}

          {/* Language selector */}
          <button
            onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
            className="px-2.5 py-1 text-xs font-mono text-stone-400 hover:text-stone-200 border border-stone-800 rounded-md hover:border-stone-700 transition-colors"
            title="Switch Language"
          >
            {lang === 'th' ? 'EN' : 'ไทย'}
          </button>

          {/* Connect / Wallet button */}
          {wallet.isConnected ? (
            <button
              onClick={onOpenWallet}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-500/50 rounded-lg text-stone-200 transition-all shadow-sm group"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-400 group-hover:scale-105 transition-transform" />
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-amber-400 font-semibold tabular-nums">
                  {wallet.balanceEth.toFixed(3)} SepoliaETH
                </span>
                <span className="text-stone-500 hidden sm:inline">|</span>
                <span className="text-stone-300 hidden sm:inline">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onConnectMetaMask}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg transition-colors font-mono"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'เชื่อมต่อ MetaMask' : 'Connect MetaMask'}</span>
            </button>
          )}
        </div>

      </div>

      {/* Network Alert Banner */}
      {wallet.isConnected && !wallet.isSepolia && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-1.5 text-center text-xs font-mono text-amber-300 flex items-center justify-center gap-2">
          <span>⚠️ {lang === 'th' ? 'คุณไม่ได้อยู่บนเครือข่าย Sepolia' : 'You are currently on a different network'}</span>
          <button
            onClick={onSwitchToSepolia}
            className="underline font-bold text-amber-200 hover:text-white"
          >
            {lang === 'th' ? 'กดที่นี่เพื่อสลับไปยังเครือข่าย Sepolia' : 'Click here to switch to Sepolia'}
          </button>
        </div>
      )}

      {/* Mobile nav subbar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-800/60 py-2 px-3 bg-stone-950/95 text-xs">
        <button
          onClick={() => setCurrentTab('marketplace')}
          className={`py-1 px-2 rounded ${currentTab === 'marketplace' ? 'text-amber-400 font-semibold' : 'text-stone-400'}`}
        >
          {lang === 'th' ? 'ตลาดม้า' : 'Market'}
        </button>
        <button
          onClick={() => setCurrentTab('stable')}
          className={`py-1 px-2 rounded ${currentTab === 'stable' ? 'text-amber-400 font-semibold' : 'text-stone-400'}`}
        >
          {lang === 'th' ? 'ม้าที่ซื้อแล้ว' : 'Purchased'} ({ownedCount})
        </button>
        {isAdmin && (
          <button
            onClick={() => setCurrentTab('admin')}
            className={`py-1 px-2 rounded font-mono text-amber-400 ${currentTab === 'admin' ? 'font-bold' : ''}`}
          >
            {lang === 'th' ? 'แอดมิน' : 'Admin'}
          </button>
        )}
      </div>
    </header>
  );
};
