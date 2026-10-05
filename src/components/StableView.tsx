import React, { useState } from 'react';
import { HorseItem } from '../types/horse';
import { HorseCard } from './HorseCard';
import { ShoppingBag, ArrowRight, ShieldCheck, Clock, Tag, PlusCircle, Wallet } from 'lucide-react';
import { ADMIN_WALLET_ADDRESS } from '../services/web3Service';

interface StableViewProps {
  horses: HorseItem[];
  userAddress: string;
  isConnected: boolean;
  onConnectMetaMask: () => void;
  onSelectHorse: (horse: HorseItem) => void;
  onGoMarketplace: () => void;
  lang: 'th' | 'en';
}

export const StableView: React.FC<StableViewProps> = ({
  horses,
  userAddress,
  isConnected,
  onConnectMetaMask,
  onSelectHorse,
  onGoMarketplace,
  lang
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'stable' | 'pending' | 'listed'>('all');

  const myPurchasedHorses = horses.filter(
    (h) => h.owner.toLowerCase() === userAddress.toLowerCase()
  );

  const pendingCount = myPurchasedHorses.filter((h) => h.listingStatus === 'pending_approval').length;
  const listedCount = myPurchasedHorses.filter((h) => h.isListed && h.listingStatus !== 'pending_approval').length;
  const stableCount = myPurchasedHorses.filter((h) => !h.isListed && h.listingStatus !== 'pending_approval').length;

  if (!isConnected) {
    return (
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-lg px-4 text-center p-8 rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Wallet className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-100 mb-2">
            {lang === 'th' ? 'กรุณาเชื่อมต่อ MetaMask เพื่อดูคอกม้า' : 'Connect MetaMask to View Stable'}
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed mb-6">
            {lang === 'th'
              ? 'เชื่อมต่อกระเป๋า MetaMask บนเครือข่าย Sepolia เพื่อตรวจสอบรายการม้าแข่งที่คุณซื้อและเป็นเจ้าของ'
              : 'Connect your MetaMask wallet on Sepolia network to inspect and manage your purchased racehorses.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={onConnectMetaMask}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 transition-colors flex items-center justify-center gap-2 font-mono shadow-md"
            >
              <Wallet className="w-4 h-4" />
              <span>{lang === 'th' ? 'เชื่อมต่อ MetaMask บน Sepolia' : 'Connect MetaMask on Sepolia'}</span>
            </button>
            <button
              onClick={onGoMarketplace}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors font-mono"
            >
              <span>{lang === 'th' ? '← กลับไปยังตลาดซื้อขาย' : '← Return to Marketplace'}</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  const filteredHorses = myPurchasedHorses.filter((h) => {
    if (filterMode === 'pending') return h.listingStatus === 'pending_approval';
    if (filterMode === 'listed') return h.isListed && h.listingStatus !== 'pending_approval';
    if (filterMode === 'stable') return !h.isListed && h.listingStatus !== 'pending_approval';
    return true;
  });

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'รายการม้าที่คุณครอบครอง' : 'Purchased Collection'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-bold">{myPurchasedHorses.length} {lang === 'th' ? 'ตัวในคอกของคุณ' : 'Horses Owned'}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
              {lang === 'th' ? 'คอกม้าของฉัน (My Stable & Horses)' : 'My Stable & Owned Horses'}
            </h2>
            <p className="mt-1 text-xs text-stone-400">
              {lang === 'th'
                ? 'ม้าที่คุณซื้อหรือครอบครอง คุณสามารถส่งคำขอให้แอดมินอนุมัติเพื่อวางขายในตลาดได้'
                : 'Your collection of racehorses. Submit a listing request for admin approval to sell on the public market.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoMarketplace}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-mono shadow-md"
            >
              <span>{lang === 'th' ? 'เลือกซื้อม้าเพิ่มในตลาด' : 'Browse More Horses'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Security / Escrow Notice Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              {lang === 'th'
                ? `🛡️ ระบบความปลอดภัย: หากต้องการขายม้า ให้คลิกที่ตัวม้าแล้วกด "ส่งคำขอวางขาย" แอดมิน (${ADMIN_WALLET_ADDRESS.slice(0, 6)}...${ADMIN_WALLET_ADDRESS.slice(-4)}) จะตรวจสอบก่อนเปิดขายในตลาด`
                : `🛡️ Security Notice: To sell your horse, click it and select "List for Sale". Admin (${ADMIN_WALLET_ADDRESS.slice(0, 6)}...${ADMIN_WALLET_ADDRESS.slice(-4)}) reviews and approves listings for market safety.`}
            </span>
          </div>
          {pendingCount > 0 && (
            <span className="bg-amber-400 text-stone-950 px-2.5 py-1 rounded text-[11px] font-bold shrink-0">
              {pendingCount} {lang === 'th' ? 'รายการรอแอดมินอนุมัติ' : 'Pending Admin Approval'}
            </span>
          )}
        </div>

        {/* Filter Pills */}
        {myPurchasedHorses.length > 0 && (
          <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto pb-1">
            <button
              onClick={() => setFilterMode('all')}
              className={`py-1.5 px-3 rounded-lg transition-colors ${
                filterMode === 'all'
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {lang === 'th' ? 'ทั้งหมด' : 'All'} ({myPurchasedHorses.length})
            </button>

            <button
              onClick={() => setFilterMode('stable')}
              className={`py-1.5 px-3 rounded-lg transition-colors ${
                filterMode === 'stable'
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {lang === 'th' ? 'อยู่ในคอก (พร้อมขาย/ฝึก)' : 'In Stable'} ({stableCount})
            </button>

            <button
              onClick={() => setFilterMode('pending')}
              className={`py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5 ${
                filterMode === 'pending'
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{lang === 'th' ? 'รอแอดมินอนุมัติ' : 'Pending Approval'}</span>
              <span>({pendingCount})</span>
            </button>

            <button
              onClick={() => setFilterMode('listed')}
              className={`py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5 ${
                filterMode === 'listed'
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <Tag className="w-3 h-3 text-emerald-400" />
              <span>{lang === 'th' ? 'กำลังวางขายในตลาด' : 'Listed in Market'}</span>
              <span>({listedCount})</span>
            </button>
          </div>
        )}

        {/* Content */}
        {myPurchasedHorses.length === 0 ? (
          <div className="my-16 text-center max-w-md mx-auto p-8 rounded-2xl border border-dashed border-stone-800 bg-stone-900/40">
            <div className="mx-auto w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-2xl mb-4">
              🐎
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-100 mb-2">
              {lang === 'th' ? 'คุณยังไม่มีม้าในคอก' : 'No Horses in Your Stable Yet'}
            </h3>
            <p className="text-xs text-stone-400 mb-6 leading-relaxed">
              {lang === 'th'
                ? 'เลือกซื้อม้าแข่งตัวแรกของคุณในราคาเพียง 0.01 - 0.02 SepoliaETH ผ่าน MetaMask หรือสั่งซื้อเพื่อทดสอบระบบ'
                : 'Acquire your first racehorse for just 0.01 - 0.02 SepoliaETH. Purchased horses appear in your stable.'}
            </p>
            <button
              onClick={onGoMarketplace}
              className="px-5 py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-mono shadow-md"
            >
              {lang === 'th' ? 'ไปยังตลาดเพื่อซื้อม้า' : 'Go to Marketplace'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHorses.map((horse) => (
              <div key={horse.id} className="relative group">
                <HorseCard
                  horse={horse}
                  onSelect={onSelectHorse}
                  isOwner={true}
                  lang={lang}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
