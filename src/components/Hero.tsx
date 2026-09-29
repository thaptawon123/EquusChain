import React from 'react';
import { ArrowRight, ShieldCheck, ShoppingBag, Eye } from 'lucide-react';
import { HERO_IMAGE } from '../data/mockHorses';
import { ADMIN_WALLET_ADDRESS } from '../services/web3Service';

interface HeroProps {
  onExplore: () => void;
  onOpenAdmin: () => void;
  onOpenStable: () => void;
  isAdmin: boolean;
  lang: 'th' | 'en';
  totalHorsesCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  onExplore,
  onOpenAdmin,
  onOpenStable,
  isAdmin,
  lang,
  totalHorsesCount
}) => {
  return (
    <section className="relative overflow-hidden border-b border-stone-800 bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Meta kicker (Zero pill discipline - clean unboxed typography) */}
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90 mb-3 tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Ethereum Sepolia Network</span>
              <span aria-hidden="true">·</span>
              <span>Chain ID: 11155111</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">Direct Sales</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-100 leading-[1.15] text-balance">
              {lang === 'th' ? (
                <>
                  ตลาดซื้อขายม้าแข่งบนบล็อคเชน{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                    ราคา 0.01 - 0.02 SepoliaETH
                  </span>
                </>
              ) : (
                <>
                  Live Equine Marketplace on{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                    Sepolia (0.01 - 0.02 ETH)
                  </span>
                </>
              )}
            </h1>

            {/* Sub-prose with receiver notice */}
            <p className="mt-4 text-base sm:text-lg text-stone-400 leading-relaxed max-w-2xl">
              {lang === 'th'
                ? `ตลาดซื้อขายม้าแข่งดิจิทัลของจริงผ่านเครือข่าย Sepolia ทุกรายการซื้อโอนเงินเข้าบัญชีแอดมิน ${ADMIN_WALLET_ADDRESS.slice(0, 6)}...${ADMIN_WALLET_ADDRESS.slice(-4)} โดยตรง ไร้ตัวกลาง`
                : `Authentic digital equine marketplace on Ethereum Sepolia. All sales proceeds dispatch directly to seller ${ADMIN_WALLET_ADDRESS}.`}
            </p>

            {/* Clean Actions: Non-admins can only explore and view purchased */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onExplore}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md transition-all group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'th' ? 'เลือกซื้อม้าในตลาด (0.01 - 0.02 ETH)' : 'Explore Horses (0.01 - 0.02 ETH)'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenStable}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-stone-200 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-lg transition-colors font-mono"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>{lang === 'th' ? 'ม้าที่ฉันซื้อไปแล้ว' : 'My Purchased Horses'}</span>
              </button>

              {/* ONLY rendered for the real admin */}
              {isAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors font-mono"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'th' ? 'เมนูแอดมิน' : 'Admin Panel'}</span>
                </button>
              )}
            </div>

            {/* Proof Metrics adjacent to claims */}
            <div className="mt-8 pt-6 border-t border-stone-800/60 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-stone-100 tabular-nums">
                  {totalHorsesCount}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {lang === 'th' ? 'ม้าในตลาด' : 'Listed Horses'}
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  0.01 - 0.02
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {lang === 'th' ? 'ราคา (SepoliaETH)' : 'Price Range (ETH)'}
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-stone-100 tabular-nums truncate max-w-[120px]">
                  0x6437...
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {lang === 'th' ? 'บัญชีรับเงิน' : 'Receiver Wallet'}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Focal Point */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl group">
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                  src={HERO_IMAGE}
                  alt="EquusChain Premium Racing Horse"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                  }}
                />
                
                {/* Visual contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent pointer-events-none" />
                
                {/* On-card subtle caption */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-stone-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Real Sepolia Trading</span>
                  </div>
                  <span className="text-amber-400 font-bold">0.010 - 0.020 SepoliaETH</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
