import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HorseCard } from './components/HorseCard';
import { HorseDetailModal } from './components/HorseDetailModal';
import { AdminPanel } from './components/AdminPanel';
import { WalletModal } from './components/WalletModal';
import { StableView } from './components/StableView';
import { TxNotification } from './components/TxNotification';
import { INITIAL_HORSES } from './data/mockHorses';
import { HorseItem, WalletState, Web3Transaction } from './types/horse';
import { Search, ArrowUpDown, AlertCircle, ShoppingBag, CheckCircle, PackageCheck } from 'lucide-react';
import {
  connectSepoliaWallet,
  switchToSepolia,
  fetchSepoliaBalance,
  sendSepoliaTransaction,
  getEthereum,
  SEPOLIA_CHAIN_ID,
  ADMIN_WALLET_ADDRESS
} from './services/web3Service';

const DEFAULT_USER_WALLET: WalletState = {
  address: "0x6437b1540da8566D1297bFb4126BA7324108387b",
  balanceEth: 5.0,
  isConnected: true,
  isMetaMask: true,
  networkName: "Sepolia Testnet",
  chainId: SEPOLIA_CHAIN_ID,
  isSepolia: true
};

export default function App() {
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [currentTab, setCurrentTab] = useState<'marketplace' | 'stable' | 'admin'>('marketplace');
  
  // Data State
  const [horses, setHorses] = useState<HorseItem[]>(INITIAL_HORSES);
  const [wallet, setWallet] = useState<WalletState>(DEFAULT_USER_WALLET);
  const [transactions, setTransactions] = useState<Web3Transaction[]>([]);
  const [latestTx, setLatestTx] = useState<Web3Transaction | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  // Modals
  const [selectedHorse, setSelectedHorse] = useState<HorseItem | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Search, Filters & View Mode (Available vs Sold)
  const [marketViewMode, setMarketViewMode] = useState<'available' | 'sold'>('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodline, setSelectedBloodline] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'speed' | 'stamina'>('price_asc');

  // Check if current connected user is the real administrator
  const isAdmin = wallet.isConnected && wallet.address.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase();

  // Sync MetaMask state on mount and listen to events
  const initWeb3 = useCallback(async () => {
    const eth = await getEthereum();
    if (!eth) return;

    try {
      const chainIdHex = await eth.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainIdHex, 16);
      const accounts: string[] = await eth.request({ method: 'eth_accounts' });

      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        const isSepolia = currentChainId === SEPOLIA_CHAIN_ID;
        const balance = await fetchSepoliaBalance(address);

        setWallet({
          address,
          balanceEth: balance || 5.0,
          isConnected: true,
          isMetaMask: true,
          networkName: isSepolia ? "Sepolia Testnet" : `Chain ${currentChainId}`,
          chainId: currentChainId,
          isSepolia
        });
      }

      // Event listeners
      eth.on('accountsChanged', async (newAccounts: string[]) => {
        if (newAccounts.length > 0) {
          const bal = await fetchSepoliaBalance(newAccounts[0]);
          setWallet((prev) => ({
            ...prev,
            address: newAccounts[0],
            balanceEth: bal || prev.balanceEth,
            isConnected: true
          }));
        } else {
          setWallet((prev) => ({ ...prev, isConnected: false }));
        }
      });

      eth.on('chainChanged', (newChainIdHex: string) => {
        const newChainId = parseInt(newChainIdHex, 16);
        const isSep = newChainId === SEPOLIA_CHAIN_ID;
        setWallet((prev) => ({
          ...prev,
          chainId: newChainId,
          isSepolia: isSep,
          networkName: isSep ? "Sepolia Testnet" : `Chain ${newChainId}`
        }));
      });

    } catch (err) {
      console.warn("Auto MetaMask check skipped:", err);
    }
  }, []);

  useEffect(() => {
    initWeb3();
  }, [initWeb3]);

  // Connect MetaMask directly
  const handleConnectMetaMask = async () => {
    setTxError(null);
    try {
      const res = await connectSepoliaWallet();
      setWallet({
        address: res.address,
        balanceEth: res.balance,
        isConnected: true,
        isMetaMask: true,
        networkName: "Sepolia Testnet",
        chainId: res.chainId,
        isSepolia: res.chainId === SEPOLIA_CHAIN_ID
      });
    } catch (err: any) {
      setTxError(err.message || "Failed to connect MetaMask");
    }
  };

  // Switch network to Sepolia
  const handleSwitchToSepolia = async () => {
    setTxError(null);
    try {
      await switchToSepolia();
      const eth = await getEthereum();
      if (eth) {
        const chainIdHex = await eth.request({ method: 'eth_chainId' });
        const cid = parseInt(chainIdHex, 16);
        setWallet((prev) => ({
          ...prev,
          chainId: cid,
          isSepolia: cid === SEPOLIA_CHAIN_ID,
          networkName: "Sepolia Testnet"
        }));
      }
    } catch (err: any) {
      setTxError(err.message || "Failed to switch to Sepolia network");
    }
  };

  // Refresh balance from Sepolia
  const handleRefreshBalance = async () => {
    if (wallet.address) {
      const bal = await fetchSepoliaBalance(wallet.address);
      setWallet((prev) => ({ ...prev, balanceEth: bal }));
    }
  };

  // Filtered horses based on mode (Available vs Sold)
  const displayedHorses = horses.filter((h) => {
    const isTargetMode = marketViewMode === 'available' ? h.isListed : !h.isListed;
    if (!isTargetMode) return false;

    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.thaiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(h.tokenId).includes(searchQuery);
    const matchesBloodline =
      selectedBloodline === 'all' || h.bloodline.toLowerCase() === selectedBloodline.toLowerCase();
    return matchesSearch && matchesBloodline;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.priceEth - b.priceEth;
    if (sortBy === 'price_desc') return b.priceEth - a.priceEth;
    if (sortBy === 'speed') return b.speed - a.speed;
    if (sortBy === 'stamina') return b.stamina - a.stamina;
    return 0;
  });

  const availableCount = horses.filter((h) => h.isListed).length;
  const soldCount = horses.filter((h) => !h.isListed).length;

  const ownedHorsesCount = horses.filter(
    (h) => h.owner.toLowerCase() === wallet.address.toLowerCase()
  ).length;

  // Real Buy on Sepolia -> Money goes directly to ADMIN_WALLET_ADDRESS (0x6437b1540da8566D1297bFb4126BA7324108387b)
  const handleBuyHorse = async (horse: HorseItem) => {
    setTxError(null);
    if (wallet.balanceEth < horse.priceEth) {
      setTxError(lang === 'th' ? 'ยอด SepoliaETH ในกระเป๋าไม่พอ' : 'Insufficient SepoliaETH');
      return;
    }

    try {
      const eth = await getEthereum();
      let txHash: string;
      let blockNum: number;

      if (eth) {
        // Send payment directly to admin address 0x6437b1540da8566D1297bFb4126BA7324108387b!
        const res = await sendSepoliaTransaction({
          to: ADMIN_WALLET_ADDRESS,
          amountEth: horse.priceEth,
        });
        txHash = res.hash;
        blockNum = res.blockNumber;
        await handleRefreshBalance();
      } else {
        txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        blockNum = Math.floor(5890000 + Math.random() * 5000);
        setWallet((prev) => ({
          ...prev,
          balanceEth: Math.max(0, prev.balanceEth - horse.priceEth - 0.0028)
        }));
      }

      // Transfer horse to buyer
      setHorses((prev) =>
        prev.map((h) =>
          h.id === horse.id
            ? { ...h, owner: wallet.address, isListed: false }
            : h
        )
      );

      const tx: Web3Transaction = {
        hash: txHash,
        type: 'BUY',
        timestamp: Date.now(),
        amountEth: horse.priceEth,
        horseName: horse.name,
        tokenId: horse.tokenId,
        status: 'confirmed',
        blockNumber: blockNum,
        etherscanUrl: `https://sepolia.etherscan.io/tx/${txHash}`
      };

      setTransactions((prev) => [tx, ...prev]);
      setLatestTx(tx);
      setSelectedHorse(null);

    } catch (err: any) {
      console.error("Buy transaction error:", err);
      setTxError(err.message || (lang === 'th' ? 'ผู้ใช้ยกเลิกการทำรายการใน MetaMask' : 'Transaction rejected in MetaMask'));
    }
  };

  // Admin Mint handler
  const handleAdminMint = (newHorse: HorseItem) => {
    setHorses((prev) => [newHorse, ...prev]);

    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const blockNum = Math.floor(5890000 + Math.random() * 5000);

    const tx: Web3Transaction = {
      hash: txHash,
      type: 'MINT',
      timestamp: Date.now(),
      amountEth: 0,
      horseName: newHorse.name,
      tokenId: newHorse.tokenId,
      status: 'confirmed',
      blockNumber: blockNum,
      etherscanUrl: `https://sepolia.etherscan.io/tx/${txHash}`
    };

    setTransactions((prev) => [tx, ...prev]);
    setLatestTx(tx);
    setCurrentTab('marketplace'); // Return to market to see newly listed horse
  };

  const handleListToggle = (horse: HorseItem, newPrice?: number) => {
    // Only admin can list/delist horses
    if (!isAdmin) return;

    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const blockNum = Math.floor(5890000 + Math.random() * 5000);

    setHorses((prev) =>
      prev.map((h) => {
        if (h.id === horse.id) {
          const willBeListed = !h.isListed;
          return {
            ...h,
            isListed: willBeListed,
            priceEth: newPrice !== undefined ? newPrice : h.priceEth
          };
        }
        return h;
      })
    );

    const tx: Web3Transaction = {
      hash: txHash,
      type: horse.isListed ? 'DELIST' : 'LIST',
      timestamp: Date.now(),
      amountEth: 0,
      horseName: horse.name,
      tokenId: horse.tokenId,
      status: 'confirmed',
      blockNumber: blockNum,
      etherscanUrl: `https://sepolia.etherscan.io/tx/${txHash}`
    };

    setTransactions((prev) => [tx, ...prev]);
    setLatestTx(tx);
    setSelectedHorse(null);
  };

  const handleTrainHorse = async (horse: HorseItem) => {
    setTxError(null);
    if (wallet.balanceEth < 0.005) return;

    try {
      const eth = await getEthereum();
      let txHash: string;
      let blockNum: number;

      if (eth) {
        const res = await sendSepoliaTransaction({
          to: ADMIN_WALLET_ADDRESS,
          amountEth: 0.005,
        });
        txHash = res.hash;
        blockNum = res.blockNumber;
        await handleRefreshBalance();
      } else {
        txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        blockNum = Math.floor(5890000 + Math.random() * 5000);
        setWallet((prev) => ({
          ...prev,
          balanceEth: Math.max(0, prev.balanceEth - 0.005)
        }));
      }

      setHorses((prev) =>
        prev.map((h) =>
          h.id === horse.id
            ? {
                ...h,
                speed: Math.min(99, h.speed + 1),
                stamina: Math.min(99, h.stamina + 1)
              }
            : h
        )
      );

      const tx: Web3Transaction = {
        hash: txHash,
        type: 'TRAIN',
        timestamp: Date.now(),
        amountEth: 0.005,
        horseName: horse.name,
        tokenId: horse.tokenId,
        status: 'confirmed',
        blockNumber: blockNum,
        etherscanUrl: `https://sepolia.etherscan.io/tx/${txHash}`
      };

      setTransactions((prev) => [tx, ...prev]);
      setLatestTx(tx);

      setSelectedHorse((prev) =>
        prev && prev.id === horse.id
          ? {
              ...prev,
              speed: Math.min(99, prev.speed + 1),
              stamina: Math.min(99, prev.stamina + 1)
            }
          : prev
      );

    } catch (err: any) {
      console.error("Train transaction error:", err);
      setTxError(err.message || (lang === 'th' ? 'ยกเลิกการทำรายการใน MetaMask' : 'Training cancelled in MetaMask'));
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* 3-Zone Top Bar - Admin tab shown ONLY to real admin */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        wallet={wallet}
        onOpenWallet={() => setIsWalletOpen(true)}
        onSwitchToSepolia={handleSwitchToSepolia}
        onConnectMetaMask={handleConnectMetaMask}
        lang={lang}
        setLang={setLang}
        ownedCount={ownedHorsesCount}
      />

      {/* Global Error Banner */}
      {txError && (
        <div className="bg-rose-500/15 border-b border-rose-500/30 px-4 py-2 text-xs font-mono text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{txError}</span>
          </div>
          <button
            onClick={() => setTxError(null)}
            className="text-rose-400 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      <main className="flex-1">
        {/* TAB: Marketplace */}
        {currentTab === 'marketplace' && (
          <div>
            <Hero
              onExplore={() => {
                const el = document.getElementById('market-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAdmin={() => setCurrentTab('admin')}
              onOpenStable={() => setCurrentTab('stable')}
              isAdmin={isAdmin}
              lang={lang}
              totalHorsesCount={horses.length}
            />

            {/* Filter & Collection Grid Section */}
            <section id="market-grid" className="py-10 sm:py-12 border-b border-stone-800/80 bg-stone-950">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                {/* Mode Selector: Available vs Sold ("ดูว่ามีม้าอะไรบ้างที่ซื้อไป") */}
                <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMarketViewMode('available')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                        marketViewMode === 'available'
                          ? 'bg-amber-400 text-stone-950 shadow-md'
                          : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{lang === 'th' ? 'ม้าที่กำลังวางขาย' : 'Available for Sale'}</span>
                      <span className="text-[11px] opacity-80">({availableCount})</span>
                    </button>

                    <button
                      onClick={() => setMarketViewMode('sold')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                        marketViewMode === 'sold'
                          ? 'bg-amber-400 text-stone-950 shadow-md'
                          : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                      }`}
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>{lang === 'th' ? 'ม้าที่ถูกซื้อไปแล้ว' : 'Purchased / Sold Horses'}</span>
                      <span className="text-[11px] opacity-80">({soldCount})</span>
                    </button>
                  </div>

                  <div className="text-xs font-mono text-stone-400 hidden sm:block">
                    {marketViewMode === 'available'
                      ? (lang === 'th' ? 'ราคา 0.01 - 0.02 SepoliaETH โอนเข้าบัญชีแอดมินโดยตรง' : '0.01 - 0.02 ETH proceeds to admin')
                      : (lang === 'th' ? 'รายการม้าแข่งที่มีผู้ซื้อไปแล้ว' : 'Catalog of already purchased horses')}
                  </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
                  
                  {/* Search box */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={lang === 'th' ? 'ค้นหาชื่อม้า, Token ID, สายพันธุ์...' : 'Search by horse name, Token ID, bloodline...'}
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-100 outline-none transition-colors"
                    />
                  </div>

                  {/* Filter tabs: Segmented controls */}
                  <div className="flex items-center gap-1.5 p-1 bg-stone-900/90 rounded-lg border border-stone-800 overflow-x-auto text-xs font-mono">
                    {['all', 'Thoroughbred', 'Arabian', 'Andalusian', 'Pegasus', 'Mustang'].map((breed) => (
                      <button
                        key={breed}
                        onClick={() => setSelectedBloodline(breed)}
                        className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                          selectedBloodline === breed
                            ? 'bg-amber-400 text-stone-950 font-semibold'
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {breed === 'all' ? (lang === 'th' ? 'ทุกสายพันธุ์' : 'All') : breed}
                      </button>
                    ))}
                  </div>

                  {/* Sort selector */}
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                    <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'price_asc' | 'price_desc' | 'speed' | 'stamina')}
                      className="bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-200 outline-none"
                    >
                      <option value="price_asc">{lang === 'th' ? 'ราคา: ต่ำไปสูง' : 'Price: Low to High'}</option>
                      <option value="price_desc">{lang === 'th' ? 'ราคา: สูงไปต่ำ' : 'Price: High to Low'}</option>
                      <option value="speed">{lang === 'th' ? 'ความเร็วสูงสุด (Speed)' : 'Highest Speed'}</option>
                      <option value="stamina">{lang === 'th' ? 'ความอึดทนทาน (Stamina)' : 'Highest Stamina'}</option>
                    </select>
                  </div>

                </div>

                {/* Horse Grid: 3-column desktop */}
                {displayedHorses.length === 0 ? (
                  <div className="py-20 text-center text-stone-500 font-mono text-sm">
                    {marketViewMode === 'available'
                      ? (lang === 'th' ? 'ไม่พบม้าที่กำลังวางขายตรงกับเงื่อนไข' : 'No available horses found matching the criteria.')
                      : (lang === 'th' ? 'ยังไม่มีม้าที่ถูกซื้อไปในหมวดนี้' : 'No sold horses in this category yet.')}
                  </div>
                ) : (
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {displayedHorses.map((horse) => (
                      <div key={horse.id} className="relative">
                        {!horse.isListed && (
                          <div className="absolute top-2.5 left-2.5 z-10 bg-stone-950/90 text-stone-300 border border-stone-700 px-2 py-0.5 rounded text-[11px] font-mono shadow">
                            ✓ {lang === 'th' ? 'มีผู้ซื้อไปแล้ว' : 'Sold'}
                          </div>
                        )}
                        <HorseCard
                          horse={horse}
                          onSelect={setSelectedHorse}
                          onQuickBuy={horse.isListed ? handleBuyHorse : undefined}
                          isOwner={horse.owner.toLowerCase() === wallet.address.toLowerCase()}
                          lang={lang}
                        />
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </section>
          </div>
        )}

        {/* TAB: My Stable / Purchased Horses */}
        {currentTab === 'stable' && (
          <StableView
            horses={horses}
            userAddress={wallet.address}
            onSelectHorse={setSelectedHorse}
            onGoMarketplace={() => setCurrentTab('marketplace')}
            lang={lang}
          />
        )}

        {/* TAB: Admin Panel (Only visible/accessible to Admin) */}
        {currentTab === 'admin' && (
          <AdminPanel
            wallet={wallet}
            horses={horses}
            onAdminMint={handleAdminMint}
            onGoMarketplace={() => setCurrentTab('marketplace')}
            lang={lang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-stone-950 py-8 text-xs text-stone-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-300">EquusChain</span>
            <span>·</span>
            <span>{lang === 'th' ? 'ตลาดซื้อขายม้าแข่งบนบล็อคเชน Sepolia จริง' : 'Digital Equine Marketplace on Ethereum Sepolia'}</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-stone-400">
            <span>
              {lang === 'th' ? 'บัญชีรับเงินแอดมิน: ' : 'Admin Receiver: '}
              <span className="text-amber-400">{ADMIN_WALLET_ADDRESS.slice(0, 6)}...{ADMIN_WALLET_ADDRESS.slice(-4)}</span>
            </span>
            <a
              href={`https://sepolia.etherscan.io/address/${ADMIN_WALLET_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="text-stone-400 hover:text-stone-200 transition-colors underline"
            >
              Sepolia Etherscan
            </a>
            <span>© 2026 EquusChain</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HorseDetailModal
        horse={selectedHorse}
        onClose={() => setSelectedHorse(null)}
        wallet={wallet}
        onBuy={handleBuyHorse}
        onListToggle={handleListToggle}
        onTrain={handleTrainHorse}
        lang={lang}
      />

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        wallet={wallet}
        onRefreshBalance={handleRefreshBalance}
        onSwitchToSepolia={handleSwitchToSepolia}
        onConnectMetaMask={handleConnectMetaMask}
        transactions={transactions}
        lang={lang}
      />

      {/* Web3 Transaction Notification Toast */}
      <TxNotification
        tx={latestTx}
        onClose={() => setLatestTx(null)}
        lang={lang}
      />
    </div>
  );
}
