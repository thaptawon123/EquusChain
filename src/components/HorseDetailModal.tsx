import React, { useState } from 'react';
import { HorseItem, WalletState } from '../types/horse';
import { X, ShieldCheck, Zap, Activity, Heart, Award, Copy, Check, Dumbbell, UserCheck } from 'lucide-react';
import { ADMIN_WALLET_ADDRESS } from '../services/web3Service';

interface HorseDetailModalProps {
  horse: HorseItem | null;
  onClose: () => void;
  wallet: WalletState;
  onBuy: (horse: HorseItem) => void;
  onListToggle: (horse: HorseItem, newPrice?: number) => void;
  onTrain: (horse: HorseItem) => void;
  lang: 'th' | 'en';
}

export const HorseDetailModal: React.FC<HorseDetailModalProps> = ({
  horse,
  onClose,
  wallet,
  onBuy,
  onListToggle,
  onTrain,
  lang
}) => {
  const [copied, setCopied] = useState(false);
  const [listPriceInput, setListPriceInput] = useState<string>(horse ? String(horse.priceEth) : '0.015');
  const [showPriceEdit, setShowPriceEdit] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!horse) return null;

  const isOwner = wallet.isConnected && wallet.address.toLowerCase() === horse.owner.toLowerCase();
  const isAdmin = wallet.isConnected && wallet.address.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase();
  const canAfford = wallet.balanceEth >= horse.priceEth;

  const handleCopyDna = () => {
    navigator.clipboard.writeText(horse.dnaHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuyClick = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsProcessing(false);
    onBuy(horse);
  };

  const handleTrainClick = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsProcessing(false);
    onTrain(horse);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Visual Showcase & Lineage */}
          <div className="md:col-span-6 bg-stone-950 flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r border-stone-800">
            <div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 bg-stone-900 shadow-inner">
                <img
                  src={horse.image}
                  alt={horse.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-mono text-stone-300 border border-stone-800">
                  Token #{horse.tokenId}
                </div>
                <div className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-mono text-amber-400 border border-stone-800">
                  Gen {horse.generation} · {horse.gender}
                </div>
              </div>

              {/* Lineage & Genealogy tree */}
              <div className="mt-5 p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>{lang === 'th' ? 'สายเลือดและตระกูล (Pedigree Lineage)' : 'Pedigree Lineage'}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded bg-stone-950/70 border border-stone-800/80">
                    <div className="text-[10px] text-stone-500 uppercase">{lang === 'th' ? 'พ่อพันธุ์ (Sire)' : 'Sire'}</div>
                    <div className="text-stone-200 font-semibold truncate mt-0.5">
                      {horse.sireName || 'Genesis Origin'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-stone-950/70 border border-stone-800/80">
                    <div className="text-[10px] text-stone-500 uppercase">{lang === 'th' ? 'แม่พันธุ์ (Dam)' : 'Dam'}</div>
                    <div className="text-stone-200 font-semibold truncate mt-0.5">
                      {horse.damName || 'Genesis Origin'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Race History */}
              <div className="mt-3 p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                <div className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'th' ? 'ประวัติสนามแข่ง (Racing Track Record)' : 'Racing Track Record'}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-stone-500">{lang === 'th' ? 'ชนะการแข่งขัน: ' : 'Victories: '}</span>
                    <span className="text-amber-400 font-bold">{horse.racesWon}</span>
                    <span className="text-stone-500"> / {horse.totalRaces}</span>
                  </div>
                  <div className="text-stone-400">
                    Win Rate: <span className="text-stone-100 font-bold">{Math.round((horse.racesWon / Math.max(1, horse.totalRaces)) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Contract Proof Footer */}
            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] font-mono text-stone-500 flex items-center justify-between">
              <span>Owner: {horse.owner.slice(0, 6)}...{horse.owner.slice(-4)}</span>
              <span className="text-emerald-400">Sepolia ERC-721</span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase & Attributes Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                <span>{horse.bloodline}</span>
                <span aria-hidden="true">·</span>
                <span>{horse.gender === 'Stallion' ? (lang === 'th' ? 'พ่อม้า' : 'Stallion') : (lang === 'th' ? 'แม่ม้า' : 'Mare')}</span>
                <span aria-hidden="true">·</span>
                <span>Gen {horse.generation}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                {lang === 'th' ? horse.thaiName : horse.name}
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-stone-400 leading-relaxed">
                {lang === 'th' ? horse.thaiDescription : horse.description}
              </p>

              {/* Physical Attributes Bar Graph */}
              <div className="mt-6 space-y-3.5">
                <div className="text-xs font-mono text-stone-300 font-semibold uppercase tracking-wider">
                  {lang === 'th' ? 'ค่าพลังพันธุกรรม (On-Chain DNA Attributes)' : 'On-Chain DNA Attributes'}
                </div>

                {/* Speed */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-stone-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      {lang === 'th' ? 'ความเร็วสูงสุด (Top Speed)' : 'Top Speed'}
                    </span>
                    <span className="text-amber-400 font-bold tabular-nums">{horse.speed} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                      style={{ width: `${horse.speed}%` }}
                    />
                  </div>
                </div>

                {/* Stamina */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-stone-400 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      {lang === 'th' ? 'ความอึดทนทาน (Stamina)' : 'Stamina Endurance'}
                    </span>
                    <span className="text-emerald-400 font-bold tabular-nums">{horse.stamina} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${horse.stamina}%` }}
                    />
                  </div>
                </div>

                {/* Agility */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-stone-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-sky-400" />
                      {lang === 'th' ? 'ความคล่องตัว (Agility)' : 'Agility'}
                    </span>
                    <span className="text-sky-400 font-bold tabular-nums">{horse.agility} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-all duration-500"
                      style={{ width: `${horse.agility}%` }}
                    />
                  </div>
                </div>

                {/* Temperament */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-stone-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      {lang === 'th' ? 'อารมณ์และสมาธิ (Temperament)' : 'Temperament'}
                    </span>
                    <span className="text-purple-400 font-bold tabular-nums">{horse.temperament} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-500"
                      style={{ width: `${horse.temperament}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* DNA Keccak-256 Hash box */}
              <div className="mt-5 p-3 rounded-lg bg-stone-950 border border-stone-800">
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mb-1">
                  <span>DNA HASH (KECCAK-256)</span>
                  <button
                    onClick={handleCopyDna}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-stone-300 break-all select-all">
                  {horse.dnaHash}
                </div>
              </div>
            </div>

            {/* Stable Contiguous Purchase Box */}
            <div className="mt-6 pt-5 border-t border-stone-800">
              {isOwner ? (
                /* Owner Actions */
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'th' ? 'คุณเป็นผู้ครอบครองม้าตัวนี้แล้ว' : 'You own this horse in your stable'}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleTrainClick}
                      disabled={isProcessing || wallet.balanceEth < 0.005}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors disabled:opacity-50 font-mono"
                    >
                      <Dumbbell className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'th' ? 'ฝึกฝน (+1 สเตตัส, 0.005 ETH)' : 'Train (+1 Stat, 0.005 ETH)'}</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => onListToggle(horse)}
                        className="py-2.5 px-3 text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors font-mono"
                      >
                        {horse.isListed ? (lang === 'th' ? 'ยกเลิกวางขาย' : 'Delist') : (lang === 'th' ? 'ตั้งขาย' : 'List')}
                      </button>
                    )}
                  </div>
                </div>
              ) : horse.isListed ? (
                /* Buy Box for regular buyers */
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-stone-500">
                        {lang === 'th' ? 'ราคาชำระผ่าน Sepolia' : 'Sepolia Purchase Price'}
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono text-2xl font-bold text-amber-400 tabular-nums">
                          {horse.priceEth}
                        </span>
                        <span className="font-mono text-stone-200 font-semibold text-sm">SepoliaETH</span>
                      </div>
                    </div>

                    <div className="text-right text-[11px] font-mono text-stone-500">
                      <div>Gas: ~0.0028 SepoliaETH</div>
                      <div className="text-emerald-400">Direct to Admin</div>
                    </div>
                  </div>

                  <div className="mb-3 p-2.5 bg-stone-950 rounded-lg border border-stone-800 text-[11px] font-mono text-stone-400">
                    <span className="text-stone-500">{lang === 'th' ? 'โอนเงินเข้าบัญชีแอดมิน: ' : 'Proceeds to: '}</span>
                    <span className="text-amber-300 font-bold select-all">{ADMIN_WALLET_ADDRESS}</span>
                  </div>

                  <button
                    onClick={handleBuyClick}
                    disabled={isProcessing || !canAfford}
                    className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 shadow-lg shadow-amber-950/40'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="font-mono text-xs">{lang === 'th' ? 'กำลังส่งคำสั่งไปยัง MetaMask บน Sepolia...' : 'Confirming on Sepolia in MetaMask...'}</span>
                    ) : canAfford ? (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{lang === 'th' ? `ซื้อผ่าน MetaMask บน Sepolia (${horse.priceEth} SepoliaETH)` : `Buy with MetaMask on Sepolia (${horse.priceEth} SepoliaETH)`}</span>
                      </>
                    ) : (
                      <span>{lang === 'th' ? 'ยอด SepoliaETH ไม่เพียงพอ' : 'Insufficient SepoliaETH Balance'}</span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 bg-stone-950 rounded-xl border border-stone-800">
                  <div className="text-emerald-400 font-mono text-xs font-semibold">
                    ✓ {lang === 'th' ? 'ม้าตัวนี้มีผู้ซื้อไปเรียบร้อยแล้ว' : 'This horse has already been purchased'}
                  </div>
                  <div className="text-[11px] font-mono text-stone-500 mt-1">
                    {lang === 'th' ? 'ผู้ครอบครอง: ' : 'Owner: '}
                    <span className="text-stone-300">{horse.owner.slice(0, 8)}...{horse.owner.slice(-6)}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
