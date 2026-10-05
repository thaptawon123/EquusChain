import React from 'react';
import { HorseItem } from '../types/horse';
import { Zap, Activity, Award, ShoppingBag, Eye, Clock, ShieldCheck, Tag } from 'lucide-react';
import { goldenThoroughbred } from '../data/mockHorses';

interface HorseCardProps {
  horse: HorseItem;
  onSelect: (horse: HorseItem) => void;
  onQuickBuy?: (horse: HorseItem) => void;
  isOwner: boolean;
  lang: 'th' | 'en';
}

export const HorseCard: React.FC<HorseCardProps> = ({
  horse,
  onSelect,
  onQuickBuy,
  isOwner,
  lang
}) => {
  const isPending = horse.listingStatus === 'pending_approval';

  return (
    <article
      onClick={() => onSelect(horse)}
      className="group cursor-pointer rounded-xl border border-stone-800/80 bg-stone-900/60 hover:bg-stone-900 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-950/20 flex flex-col overflow-hidden"
    >
      {/* Image visual slot */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
        <img
          src={horse.image}
          alt={horse.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.includes('/src/assets/images/')) {
              target.src = target.src.replace('/src/assets/images/', '/images/');
            } else if (!target.src.includes(goldenThoroughbred)) {
              target.src = goldenThoroughbred;
            }
          }}
        />

        {/* Fallback pattern if image is hidden */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center bg-stone-950 text-stone-700">
          <span className="font-serif text-5xl">🐎</span>
        </div>

        {/* Subtle Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

        {/* Top-Left: Approval / Listing Status Badge */}
        {isPending ? (
          <div className="absolute top-2.5 left-3 bg-amber-500/90 text-stone-950 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono font-semibold flex items-center gap-1 shadow-md">
            <Clock className="w-3 h-3" />
            <span>{lang === 'th' ? 'รอแอดมินอนุมัติ' : 'Pending Approval'}</span>
          </div>
        ) : isOwner ? (
          <div className="absolute top-2.5 left-3 bg-emerald-500/80 text-stone-950 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono font-semibold flex items-center gap-1 shadow-md">
            <span>{lang === 'th' ? 'ม้าของคุณ' : 'Your Horse'}</span>
          </div>
        ) : null}

        {/* Top-Right Token ID */}
        <div className="absolute top-2.5 right-3 bg-stone-950/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-mono text-stone-400 border border-stone-800">
          #{horse.tokenId}
        </div>

        {/* Bottom image overlay: Status */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs">
          <span className="font-mono text-amber-300 font-medium">
            {horse.gender === 'Stallion' ? (lang === 'th' ? 'พ่อม้า (Stallion)' : 'Stallion') : (lang === 'th' ? 'แม่ม้า (Mare)' : 'Mare')}
          </span>
          <span className="text-stone-300 font-mono">
            Gen {horse.generation}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Bloodline & Equine Passport Badge */}
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400/90 font-medium">{horse.bloodline}</span>
              <span aria-hidden="true">·</span>
              <span>{horse.racesWon}/{horse.totalRaces} Wins</span>
            </div>
            {horse.passport && (
              <span className="text-[10px] text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30 flex items-center gap-1 font-semibold" title="มีใบสิชล / ใบรูปพรรณม้ารับรอง">
                <span>🛡️ {lang === 'th' ? 'ใบสิชล TEF' : 'Passport'}</span>
              </span>
            )}
          </div>

          {/* Horse Title */}
          <h3 className="mt-1 font-serif text-base font-semibold text-stone-100 group-hover:text-amber-400 transition-colors truncate">
            {lang === 'th' ? horse.thaiName : horse.name}
          </h3>

          {/* Key Physical Stats */}
          <div className="mt-3 grid grid-cols-3 gap-2 border-y border-stone-800/60 py-2 text-xs font-mono">
            <div>
              <div className="text-stone-500 text-[10px] uppercase">
                {lang === 'th' ? 'ความเร็ว' : 'Speed'}
              </div>
              <div className="font-bold text-stone-200 tabular-nums">
                {horse.speed}
              </div>
            </div>
            <div>
              <div className="text-stone-500 text-[10px] uppercase">
                {lang === 'th' ? 'ความอึด' : 'Stamina'}
              </div>
              <div className="font-bold text-stone-200 tabular-nums">
                {horse.stamina}
              </div>
            </div>
            <div>
              <div className="text-stone-500 text-[10px] uppercase">
                {lang === 'th' ? 'คล่องแคล่ว' : 'Agility'}
              </div>
              <div className="font-bold text-stone-200 tabular-nums">
                {horse.agility}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing and Action row */}
        <div className="mt-3.5 pt-1 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-stone-500 font-mono">
              {isPending
                ? (lang === 'th' ? 'ขอตั้งขายที่' : 'Pending Price')
                : horse.isListed
                ? (lang === 'th' ? 'ราคาเสนอขาย' : 'Price')
                : (lang === 'th' ? 'สถานะ' : 'Status')}
            </div>
            {isPending ? (
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-base font-bold text-amber-300 tabular-nums">
                  {horse.pendingPriceEth ?? horse.priceEth}
                </span>
                <span className="font-mono text-xs text-stone-400">SepoliaETH</span>
              </div>
            ) : horse.isListed ? (
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
                  {horse.priceEth}
                </span>
                <span className="font-mono text-xs text-stone-400">SepoliaETH</span>
              </div>
            ) : (
              <div className="text-xs font-mono text-stone-400">
                {isOwner ? (lang === 'th' ? 'อยู่ในคอกของคุณ' : 'In Your Stable') : (lang === 'th' ? 'ไม่ได้วางขาย' : 'Not Listed')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onSelect(horse)}
              className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg border border-stone-800 transition-colors"
              title={lang === 'th' ? 'ดูรายละเอียด' : 'Inspect details'}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {horse.isListed && !isOwner && onQuickBuy && (
              <button
                onClick={() => onQuickBuy(horse)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-mono whitespace-nowrap shadow-sm hover:shadow"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'th' ? 'ซื้อทันที' : 'Buy'}</span>
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => onSelect(horse)}
                className="px-2.5 py-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors font-mono whitespace-nowrap"
              >
                {isPending ? (lang === 'th' ? 'ดูคำขอ' : 'Request') : (lang === 'th' ? 'จัดการ' : 'Manage')}
              </button>
            )}
          </div>
        </div>

      </div>
    </article>
  );
};
