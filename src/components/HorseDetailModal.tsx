import React, { useState } from 'react';
import { HorseItem, WalletState } from '../types/horse';
import { X, ShieldCheck, Zap, Activity, Heart, Award, Copy, Check, Dumbbell, UserCheck, Clock, Tag, AlertCircle, ArrowRight, FileText, Lock, CheckCircle } from 'lucide-react';
import { ADMIN_WALLET_ADDRESS } from '../services/web3Service';
import { goldenThoroughbred } from '../data/mockHorses';
import { EquinePassportModal } from './EquinePassportModal';

interface HorseDetailModalProps {
  horse: HorseItem | null;
  onClose: () => void;
  wallet: WalletState;
  onConnectMetaMask: () => void;
  onBuy: (horse: HorseItem) => void;
  onRequestListing: (horse: HorseItem, priceEth: number, note?: string) => void;
  onCancelListingRequest: (horse: HorseItem) => void;
  onDelist: (horse: HorseItem) => void;
  onApproveListing?: (horse: HorseItem) => void;
  onTrain: (horse: HorseItem) => void;
  lang: 'th' | 'en';
}

export const HorseDetailModal: React.FC<HorseDetailModalProps> = ({
  horse,
  onClose,
  wallet,
  onConnectMetaMask,
  onBuy,
  onRequestListing,
  onCancelListingRequest,
  onDelist,
  onApproveListing,
  onTrain,
  lang
}) => {
  const [copied, setCopied] = useState(false);
  const [listPriceInput, setListPriceInput] = useState<string>(horse ? String(horse.priceEth) : '0.015');
  const [sellerNote, setSellerNote] = useState<string>('');
  const [showListingForm, setShowListingForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  if (!horse) return null;

  const isOwner = wallet.isConnected && wallet.address.toLowerCase() === horse.owner.toLowerCase();
  const isAdmin = wallet.isConnected && wallet.address.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase();
  const hasOwnerAccess = isOwner || isAdmin;
  const canAfford = wallet.balanceEth >= horse.priceEth;
  const isPending = horse.listingStatus === 'pending_approval';

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

  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(listPriceInput);
    if (isNaN(price) || price <= 0) return;
    onRequestListing(horse, price, sellerNote);
    setShowListingForm(false);
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
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.includes('/src/assets/images/')) {
                      target.src = target.src.replace('/src/assets/images/', '/images/');
                    } else if (!target.src.includes(goldenThoroughbred)) {
                      target.src = goldenThoroughbred;
                    }
                  }}
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

              {/* Equine Passport & Identification Section (Strict Access Control) */}
              {horse.passport && (
                <div className={`mt-3 p-4 rounded-xl border ${hasOwnerAccess ? 'bg-amber-500/5 border-amber-500/30' : 'bg-stone-900/60 border-stone-800'}`}>
                  <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                    <div className="flex items-center gap-1.5 text-stone-200 font-semibold">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'th' ? 'ใบสิชล / ใบรูปพรรณม้า (TEF)' : 'Equine Passport (TEF)'}</span>
                    </div>
                    {hasOwnerAccess ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>{lang === 'th' ? 'ปลดล็อคแล้ว (สิทธิ์เจ้าของ)' : 'Unlocked (Owner)'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400 bg-stone-800/80 border border-stone-700/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>{lang === 'th' ? 'คุ้มครองเฉพาะผู้ซื้อ' : 'Owner Only'}</span>
                      </span>
                    )}
                  </div>

                  {hasOwnerAccess ? (
                    /* Unlocked View for Confirmed Owner or Admin */
                    <div className="space-y-2 text-xs font-mono">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded bg-stone-950/80 border border-stone-800">
                          <span className="text-stone-500 block text-[10px]">{lang === 'th' ? 'เลขที่ใบสิชล' : 'Cert No.'}:</span>
                          <span className="text-amber-300 font-bold truncate select-all">{horse.passport.certificateNumber}</span>
                        </div>
                        <div className="p-2 rounded bg-stone-950/80 border border-stone-800">
                          <span className="text-stone-500 block text-[10px]">{lang === 'th' ? 'รหัสไมโครชิป' : 'Microchip ID'}:</span>
                          <span className="text-stone-200 font-bold select-all truncate">{horse.passport.microchipId}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-300 bg-stone-950/70 p-2.5 rounded border border-stone-800/80">
                        <span className="text-stone-500 text-[10px] block mb-0.5">{lang === 'th' ? 'ตำหนิรูปพรรณที่บันทึก' : 'Physical Markings'}:</span>
                        <span className="line-clamp-2">{horse.passport.physicalMarkings}</span>
                      </div>

                      <button
                        onClick={() => setIsPassportOpen(true)}
                        className="w-full mt-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 transition-colors flex items-center justify-center gap-1.5 shadow-md font-mono"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>{lang === 'th' ? '📄 เปิดดูใบสิชล / รูปพรรณฉบับเต็ม' : 'View Full Equine Passport'}</span>
                      </button>
                    </div>
                  ) : (
                    /* Locked View for Regular Marketplace Browsers */
                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-2.5 rounded bg-stone-950/90 border border-stone-800/80 text-[11px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-stone-500">{lang === 'th' ? 'เลขที่ใบสิชล' : 'Cert No.'}:</span>
                          <span className="text-stone-400 tracking-wider">TEF-REG-••••••••</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">{lang === 'th' ? 'รหัสไมโครชิป' : 'Microchip ID'}:</span>
                          <span className="text-stone-400 tracking-wider">9851410••••••••</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-stone-900 text-emerald-400">
                          <span>{lang === 'th' ? 'สถานะรับรอง' : 'Status'}:</span>
                          <span>✓ {lang === 'th' ? 'ตรวจสอบและผนึกเอกสารแล้ว' : 'Verified & Sealed'}</span>
                        </div>
                      </div>

                      <div className="p-2 rounded bg-amber-500/5 border border-amber-500/20 text-[11px] text-stone-400 flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">
                          {lang === 'th'
                            ? '🔒 เพื่อความปลอดภัย ป้องกันการสวมสิทธิ์และคัดลอกรูปพรรณ เอกสารใบสิชลและรหัสไมโครชิปตัวเต็มจะถูกปลดล็อคให้เฉพาะผู้ซื้อที่เป็นเจ้าของกรรมสิทธิ์เท่านั้น'
                            : '🔒 Protected: Equine passport and microchip details are unlocked exclusively to the verified owner after purchase to prevent identity theft.'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
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

            {/* Action Box */}
            <div className="mt-6 pt-5 border-t border-stone-800">
              {isOwner ? (
                /* Owner Actions & Listing Request Flow */
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{lang === 'th' ? 'คุณเป็นผู้ครอบครองม้าตัวนี้' : 'You own this horse in your stable'}</span>
                    </div>
                    {isAdmin && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40">
                        ADMIN
                      </span>
                    )}
                  </div>

                  {/* Listing State: Pending Approval */}
                  {isPending && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 font-semibold">
                        <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                        <span>{lang === 'th' ? 'กำลังรอแอดมินตรวจสอบและอนุมัติ' : 'Pending Admin Verification'}</span>
                      </div>
                      <p className="text-stone-300 text-[11px] leading-relaxed">
                        {lang === 'th'
                          ? `คำขอวางขายที่ราคา ${horse.pendingPriceEth ?? horse.priceEth} SepoliaETH ถูกส่งให้แอดมิน (${ADMIN_WALLET_ADDRESS.slice(0, 6)}...${ADMIN_WALLET_ADDRESS.slice(-4)}) เรียบร้อยแล้ว เพื่อความปลอดภัยของผู้ซื้อ`
                          : `Listing request for ${horse.pendingPriceEth ?? horse.priceEth} SepoliaETH has been submitted to admin for fraud protection.`}
                      </p>

                      <div className="pt-1 flex items-center gap-2">
                        <button
                          onClick={() => onCancelListingRequest(horse)}
                          className="py-1.5 px-3 rounded-lg text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                        >
                          {lang === 'th' ? 'ยกเลิกคำขอขาย' : 'Cancel Request'}
                        </button>
                        {isAdmin && onApproveListing && (
                          <button
                            onClick={() => onApproveListing(horse)}
                            className="py-1.5 px-3 rounded-lg text-xs font-medium text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors font-bold ml-auto"
                          >
                            {lang === 'th' ? '✓ อนุมัติทันที (แอดมิน)' : '✓ Approve Now (Admin)'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Listing State: Active on Marketplace */}
                  {horse.isListed && !isPending && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          <span>{lang === 'th' ? 'กำลังวางขายในตลาด' : 'Currently Listed on Marketplace'}</span>
                        </span>
                        <span className="text-amber-400 font-bold text-sm">
                          {horse.priceEth} SepoliaETH
                        </span>
                      </div>
                      <button
                        onClick={() => onDelist(horse)}
                        className="w-full py-2 px-3 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
                      >
                        {lang === 'th' ? 'นำม้าออกจากตลาด (ยกเลิกวางขาย)' : 'Delist from Marketplace'}
                      </button>
                    </div>
                  )}

                  {/* Listing State: In Stable (Unlisted or Rejected) */}
                  {!horse.isListed && !isPending && (
                    <>
                      {horse.listingStatus === 'rejected' && (
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">{lang === 'th' ? 'คำขอเดิมถูกปฏิเสธโดยแอดมิน' : 'Previous listing rejected by admin'}</div>
                            {horse.rejectionReason && (
                              <div className="text-[11px] text-stone-400 mt-0.5">{horse.rejectionReason}</div>
                            )}
                          </div>
                        </div>
                      )}

                      {!showListingForm ? (
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={handleTrainClick}
                            disabled={isProcessing || wallet.balanceEth < 0.005}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors disabled:opacity-50 font-mono"
                          >
                            <Dumbbell className="w-4 h-4 text-amber-400" />
                            <span>{lang === 'th' ? 'ฝึกฝน (+1 สเตตัส, 0.005 ETH)' : 'Train (+1 Stat, 0.005 ETH)'}</span>
                          </button>

                          <button
                            onClick={() => setShowListingForm(true)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-mono shadow-sm"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span>{lang === 'th' ? 'ส่งคำขอวางขาย' : 'List for Sale'}</span>
                          </button>
                        </div>
                      ) : (
                        /* Listing Request Form */
                        <form onSubmit={handleSubmitListing} className="p-3.5 rounded-xl bg-stone-950 border border-amber-500/30 space-y-3 font-mono">
                          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>{lang === 'th' ? 'ส่งคำขอวางขาย (แอดมินตรวจสอบก่อน)' : 'Request Listing (Admin Escrow)'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowListingForm(false)}
                              className="text-stone-500 hover:text-stone-300 text-xs"
                            >
                              ✕
                            </button>
                          </div>

                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">
                              {lang === 'th' ? 'กำหนดราคาขาย (SepoliaETH):' : 'Listing Price (SepoliaETH):'}
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                step="0.001"
                                min="0.001"
                                required
                                value={listPriceInput}
                                onChange={(e) => setListPriceInput(e.target.value)}
                                className="w-full py-2 px-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:border-amber-400 focus:outline-none"
                                placeholder="0.015"
                              />
                              <span className="absolute right-3 top-2 text-xs text-stone-500">SepoliaETH</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">
                              {lang === 'th' ? 'หมายเหตุถึงแอดมิน/ผู้ซื้อ (ถ้ามี):' : 'Note to Admin / Buyer (Optional):'}
                            </label>
                            <input
                              type="text"
                              value={sellerNote}
                              onChange={(e) => setSellerNote(e.target.value)}
                              placeholder={lang === 'th' ? 'ม้าแข่งสายเลือดแท้ พร้อมลงสนาม...' : 'Pedigree champion ready for competition...'}
                              className="w-full py-1.5 px-3 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200/90 leading-relaxed">
                            {lang === 'th'
                              ? `🛡️ เพื่อความปลอดภัย คำขอจะถูกส่งไปยังบัญชีแอดมิน (${ADMIN_WALLET_ADDRESS.slice(0, 6)}...${ADMIN_WALLET_ADDRESS.slice(-4)}) เพื่อตรวจรับรองสายพันธุ์ก่อนเปิดขายสาธารณะ`
                              : `🛡️ For marketplace safety, this listing will be reviewed and approved by admin (${ADMIN_WALLET_ADDRESS.slice(0, 6)}...${ADMIN_WALLET_ADDRESS.slice(-4)}) before public display.`}
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setShowListingForm(false)}
                              className="py-2 px-3 text-xs text-stone-400 hover:text-stone-200 rounded-lg border border-stone-800"
                            >
                              {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <span>{lang === 'th' ? 'ส่งคำขอให้แอดมินอนุมัติ' : 'Submit for Admin Approval'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </form>
                      )}
                    </>
                  )}
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
                      <div className="text-emerald-400 flex items-center gap-1 justify-end">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified Direct</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 p-2.5 bg-stone-950 rounded-lg border border-stone-800 text-[11px] font-mono text-stone-400 flex items-center justify-between">
                    <div>
                      <span className="text-stone-500">{lang === 'th' ? 'ผู้รับเงิน: ' : 'Receiver: '}</span>
                      <span className="text-amber-300 font-bold select-all">{ADMIN_WALLET_ADDRESS.slice(0, 8)}...{ADMIN_WALLET_ADDRESS.slice(-6)}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {lang === 'th' ? 'กระเป๋าแอดมิน' : 'Admin Wallet'}
                    </span>
                  </div>

                  {!wallet.isConnected ? (
                    <button
                      onClick={onConnectMetaMask}
                      className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 shadow-lg shadow-amber-950/40 font-mono"
                    >
                      <ShieldCheck className="w-4 h-4 text-stone-950" />
                      <span>{lang === 'th' ? 'เชื่อมต่อ MetaMask เพื่อซื้อม้า' : 'Connect MetaMask to Buy'}</span>
                    </button>
                  ) : (
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
                  )}
                </div>
              ) : (
                <div className="text-center py-4 bg-stone-950 rounded-xl border border-stone-800">
                  <div className="text-stone-400 font-mono text-xs font-semibold">
                    {lang === 'th' ? 'ม้าตัวนี้ไม่ได้เปิดขายในตลาด' : 'This horse is not currently listed for sale'}
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

      {/* Official Equine Passport Document Modal */}
      <EquinePassportModal
        horse={horse}
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        lang={lang}
      />
    </div>
  );
};

