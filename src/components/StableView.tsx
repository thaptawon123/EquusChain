import React from 'react';
import { HorseItem } from '../types/horse';
import { HorseCard } from './HorseCard';
import { ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

interface StableViewProps {
  horses: HorseItem[];
  userAddress: string;
  onSelectHorse: (horse: HorseItem) => void;
  onGoMarketplace: () => void;
  lang: 'th' | 'en';
}

export const StableView: React.FC<StableViewProps> = ({
  horses,
  userAddress,
  onSelectHorse,
  onGoMarketplace,
  lang
}) => {
  const myPurchasedHorses = horses.filter(
    (h) => h.owner.toLowerCase() === userAddress.toLowerCase()
  );

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'รายการม้าที่คุณครอบครอง' : 'Purchased Collection'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-bold">{myPurchasedHorses.length} {lang === 'th' ? 'ตัวที่ซื้อไปแล้ว' : 'Horses Owned'}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
              {lang === 'th' ? 'ม้าที่ฉันซื้อไปแล้ว (Purchased Horses)' : 'My Purchased Horses'}
            </h2>
            <p className="mt-1 text-xs text-stone-400">
              {lang === 'th'
                ? 'ม้าแข่งที่คุณสั่งซื้อผ่านกระเป๋าเงิน MetaMask บนเครือข่าย Sepolia เรียบร้อยแล้ว'
                : 'Horses successfully acquired via your MetaMask wallet on the Sepolia network.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoMarketplace}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-mono"
            >
              <span>{lang === 'th' ? 'เลือกซื้อม้าเพิ่มในตลาด' : 'Browse More Horses'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {myPurchasedHorses.length === 0 ? (
          <div className="my-16 text-center max-w-md mx-auto p-8 rounded-2xl border border-dashed border-stone-800 bg-stone-900/40">
            <div className="mx-auto w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-2xl mb-4">
              🐎
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-100 mb-2">
              {lang === 'th' ? 'คุณยังไม่ได้ซื้อม้าตัวใด' : 'No Purchased Horses Yet'}
            </h3>
            <p className="text-xs text-stone-400 mb-6 leading-relaxed">
              {lang === 'th'
                ? 'เลือกซื้อม้าแข่งตัวแรกของคุณในราคาเพียง 0.01 - 0.02 SepoliaETH ผ่าน MetaMask เมื่อซื้อสำเร็จ ม้าจะเข้ามาอยู่ในหน้านี้ทันที'
                : 'Acquire your first racehorse for just 0.01 - 0.02 SepoliaETH. Purchased horses will be cataloged here.'}
            </p>
            <button
              onClick={onGoMarketplace}
              className="px-5 py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-mono"
            >
              {lang === 'th' ? 'ไปยังตลาดเพื่อซื้อม้า' : 'Go to Marketplace'}
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPurchasedHorses.map((horse) => (
              <div key={horse.id} className="relative group">
                <div className="absolute top-3 left-3 z-10 bg-emerald-500/90 text-stone-950 px-2 py-0.5 rounded text-[11px] font-bold font-mono shadow">
                  ✓ {lang === 'th' ? 'ซื้อแล้ว' : 'Purchased'}
                </div>
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
