import React, { useState } from 'react';
import { HorseItem, WalletState, Bloodline, Gender, EquinePassport } from '../types/horse';
import {
  ShieldCheck,
  PlusCircle,
  Sparkles,
  Package,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Check,
  X,
  DollarSign,
  FileText,
  Upload
} from 'lucide-react';
import { ADMIN_WALLET_ADDRESS } from '../services/web3Service';
import { HORSE_NFT_CONTRACT_ADDRESS } from '../contracts/contractData';
import {
  goldenThoroughbred,
  arabianStallion,
  pearlAndalusian,
  heroEquine
} from '../data/mockHorses';

interface AdminPanelProps {
  wallet: WalletState;
  horses: HorseItem[];
  onAdminMint: (newHorse: HorseItem) => void;
  onApproveListing: (horse: HorseItem) => void;
  onRejectListing: (horse: HorseItem, reason: string) => void;
  onDelistHorse: (horse: HorseItem) => void;
  onGoMarketplace: () => void;
  onSwitchAccount?: () => void;
  lang: 'th' | 'en';
}

const AVAILABLE_IMAGES = [
  {
    url: goldenThoroughbred,
    label: 'Golden Palomino (Thoroughbred)'
  },
  {
    url: arabianStallion,
    label: 'Obsidian Midnight (Arabian)'
  },
  {
    url: pearlAndalusian,
    label: 'Dappled Pearl (Andalusian)'
  },
  {
    url: heroEquine,
    label: 'Emerald Dawn (Pegasus)'
  }
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  wallet,
  horses,
  onAdminMint,
  onApproveListing,
  onRejectListing,
  onDelistHorse,
  onGoMarketplace,
  onSwitchAccount,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'mint' | 'inventory'>('queue');
  const [name, setName] = useState('');
  const [bloodline, setBloodline] = useState<Bloodline>('Thoroughbred');
  const [gender, setGender] = useState<Gender>('Stallion');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [priceEth, setPriceEth] = useState<number>(0.015);
  const [isMinting, setIsMinting] = useState(false);
  const [rejectingHorseId, setRejectingHorseId] = useState<number | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');

  // Equine Passport Form State
  const [certNumber, setCertNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('สมาคมกีฬาขี่ม้าแห่งประเทศไทย (TEF) & สมาคมผู้เพาะพันธุ์ม้าแข่ง');
  const [microchipId, setMicrochipId] = useState('');
  const [physicalMarkings, setPhysicalMarkings] = useState('');
  const [uploadedDocumentName, setUploadedDocumentName] = useState('');
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState<string | undefined>(undefined);

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedDocumentName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedDocumentUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const isAdmin = wallet.isConnected && wallet.address.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase();

  // Strict Access Control: If NOT the real admin, block access!
  if (!isAdmin) {
    return (
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-lg px-4 text-center p-8 rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-100 mb-2">
            {lang === 'th' ? 'ไม่มีสิทธิ์เข้าถึง (สงวนเฉพาะบัญชีแอดมิน)' : 'Access Restricted (Admin Only)'}
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed mb-4">
            {lang === 'th'
              ? `ระบบนี้เป็นแพลตฟอร์มบล็อคเชนจริงบนเครือข่าย Ethereum Sepolia ผู้ที่ไม่ได้เชื่อมต่อด้วยบัญชีแอดมินจะไม่สามารถแก้ไข มิ้นต์ม้า หรืออนุมัติการวางขายได้ มีสิทธิ์เฉพาะการซื้อและส่งคำขอขายม้าของตนเองเท่านั้น`
              : `This platform runs on Ethereum Sepolia. Only the authorized administrator wallet can mint horses, manage contracts, or approve sales. Non-admin accounts have buyer permissions only.`}
          </p>

          <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 font-mono text-xs text-left mb-6 space-y-2">
            <div className="flex justify-between text-stone-500 text-[11px]">
              <span>{lang === 'th' ? 'กระเป๋าแอดมินที่ได้รับอนุญาต:' : 'Authorized Admin Address:'}</span>
              <span className="text-amber-400 font-bold">Admin Authority</span>
            </div>
            <div className="text-amber-300 font-bold text-[11px] truncate select-all bg-amber-500/10 p-2 rounded border border-amber-500/20">
              {ADMIN_WALLET_ADDRESS}
            </div>
            <div className="pt-2 border-t border-stone-900 flex justify-between text-stone-500 text-[11px]">
              <span>{lang === 'th' ? 'กระเป๋าปัจจุบันที่คุณเชื่อมต่อ:' : 'Your Connected Wallet:'}</span>
              <span className="text-stone-300 truncate max-w-[200px]">
                {wallet.isConnected ? wallet.address : (lang === 'th' ? 'ยังไม่ได้เชื่อมต่อ MetaMask' : 'Not Connected')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onGoMarketplace}
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 transition-colors flex items-center justify-center gap-2 font-mono shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'th' ? 'กลับไปยังตลาดซื้อขายม้า' : 'Return to Marketplace'}</span>
            </button>

            {onSwitchAccount && (
              <button
                onClick={onSwitchAccount}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors flex items-center justify-center gap-2 font-mono"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{lang === 'th' ? 'สลับบัญชีใน MetaMask เพื่อเข้าสู่ระบบแอดมิน' : 'Switch Account in MetaMask'}</span>
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Pending listing requests from users waiting for admin approval
  const pendingRequests = horses.filter((h) => h.listingStatus === 'pending_approval');
  const adminHorses = horses.filter(
    (h) => h.owner.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase()
  );

  const handleMintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsMinting(true);
    await new Promise((r) => setTimeout(r, 600));

    const randomSpeed = Math.floor(75 + Math.random() * 22);
    const randomStamina = Math.floor(72 + Math.random() * 25);
    const randomAgility = Math.floor(70 + Math.random() * 26);
    const randomTemperament = Math.floor(70 + Math.random() * 24);

    const tokenId = Math.floor(107 + Math.random() * 890);
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const dnaHash = `0x${randomHex}`;

    const passportData: EquinePassport = {
      certificateNumber: certNumber.trim() || `TEF-REG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      issuingAuthority: issuingAuthority.trim() || 'สมาคมกีฬาขี่ม้าแห่งประเทศไทย (TEF) & สมาคมผู้เพาะพันธุ์ม้าแข่ง',
      issueDate: new Date().toISOString().split('T')[0],
      microchipId: microchipId.trim() || `98514100${Math.floor(1000000 + Math.random() * 9000000)}`,
      physicalMarkings: physicalMarkings.trim() || 'มีแต้มด่างสีขาวบริเวณหน้าผาก, ข้อเท้าขาว, ขวัญปกติบริเวณลำตัว',
      colorAndCoat: AVAILABLE_IMAGES[selectedImageIndex].label,
      registrarSignature: 'น.สพ. วรพงษ์ เกียรติวานิช (นายทะเบียนกลาง)',
      documentFileName: uploadedDocumentName || `Equine_Passport_TEF_${tokenId}.pdf`,
      documentUrl: uploadedDocumentUrl,
      verifiedHash: dnaHash
    };

    const newHorse: HorseItem = {
      id: Date.now(),
      tokenId,
      name: name.trim(),
      thaiName: `${name.trim()} (ERC-721 #${tokenId})`,
      bloodline,
      gender,
      generation: 0,
      speed: randomSpeed,
      stamina: randomStamina,
      agility: randomAgility,
      temperament: randomTemperament,
      racesWon: 0,
      totalRaces: 0,
      birthDate: new Date().toISOString().split('T')[0],
      image: AVAILABLE_IMAGES[selectedImageIndex].url,
      priceEth: Math.min(0.02, Math.max(0.01, Number(priceEth))),
      isListed: true, // Immediately listed on marketplace
      listingStatus: 'approved_listed',
      owner: ADMIN_WALLET_ADDRESS,
      description: `Official stable release. Genesis ${bloodline} ${gender}. Direct sales proceed to ${ADMIN_WALLET_ADDRESS}.`,
      thaiDescription: `ม้าปฐมบท (Genesis) สายเลือด ${bloodline} จากคอกแอดมิน วางขายในตลาดราคา ${priceEth} SepoliaETH รายได้เข้ากระเป๋าแอดมินโดยตรง`,
      dnaHash,
      contractAddress: HORSE_NFT_CONTRACT_ADDRESS,
      passport: passportData
    };

    setIsMinting(false);
    onAdminMint(newHorse);
    setName('');
    setCertNumber('');
    setMicrochipId('');
    setPhysicalMarkings('');
    setUploadedDocumentName('');
    setUploadedDocumentUrl(undefined);
  };

  const handleConfirmReject = (horse: HorseItem) => {
    onRejectListing(horse, rejectionNote || 'ไม่ผ่านเกณฑ์การตรวจสอบสายพันธุ์ของแอดมิน');
    setRejectingHorseId(null);
    setRejectionNote('');
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Admin Header & Security Badge */}
        <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'th' ? 'เข้าสู่ระบบในฐานะแอดมิน (สิทธิ์อนุมัติและมิ้นต์)' : 'Authenticated Administrator (Approval & Minting Authority)'}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                {lang === 'th' ? 'แดชบอร์ดผู้ดูแลระบบ (Admin Dashboard)' : 'Admin Escrow & Minting Studio'}
              </h2>
            </div>

            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs font-mono">
              <div className="text-[10px] text-stone-500 uppercase tracking-wider">
                {lang === 'th' ? 'กระเป๋าแอดมินผู้ดูแลและรับเงิน' : 'Admin Authority Wallet'}
              </div>
              <div className="font-bold text-amber-400 select-all truncate mt-0.5 max-w-sm">
                {ADMIN_WALLET_ADDRESS}
              </div>
              <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{lang === 'th' ? 'ปลอดภัย: มีสิทธิ์อนุมัติรายการขายและมิ้นต์ม้า' : 'Secured: Full listing escrow & mint authority'}</span>
              </div>
            </div>
          </div>

          {/* Admin Navigation Sub-tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-stone-800 font-mono text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('queue')}
              className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'queue'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200 bg-stone-950 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'คิวรออนุมัติการวางขาย' : 'Listing Approval Queue'}</span>
              {pendingRequests.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  activeTab === 'queue' ? 'bg-stone-950 text-amber-400' : 'bg-amber-400 text-stone-950'
                }`}>
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('mint')}
              className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'mint'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200 bg-stone-950 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'มิ้นต์ม้าตัวใหม่ (Genesis)' : 'Mint New Horse'}</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'inventory'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-stone-200 bg-stone-950 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'ม้าของแอดมินในตลาด' : 'Admin Listed Horses'}</span>
              <span className="text-[10px] text-stone-500 font-mono">({adminHorses.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: APPROVAL QUEUE */}
        {activeTab === 'queue' && (
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>{lang === 'th' ? 'รายการคำขอวางขายที่รอแอดมินอนุมัติ' : 'Pending Listing Requests'}</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {lang === 'th'
                    ? 'เมื่อผู้ใช้งานส่งคำขอขายม้า จะต้องผ่านการอนุมัติจากแอดมินก่อนเท่านั้น จึงจะแสดงผลในตลาด เพื่อความปลอดภัยสูงสุด'
                    : 'User listings require administrator inspection and approval before becoming visible on the public market.'}
                </p>
              </div>
              <div className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
                {pendingRequests.length} {lang === 'th' ? 'รายการที่รอ' : 'pending'}
              </div>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="py-16 text-center text-stone-500 font-mono text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-400/70 mx-auto mb-3" />
                <p className="text-stone-300 font-semibold text-sm">
                  {lang === 'th' ? 'ไม่มีคำขอที่รอการอนุมัติในขณะนี้' : 'No pending listing requests at this time'}
                </p>
                <p className="text-stone-500 text-xs mt-1">
                  {lang === 'th'
                    ? 'เมื่อผู้ใช้ทั่วไปกด "ส่งคำขอวางขาย" จากคอกม้า รายการจะเข้ามาแสดงที่นี่ทันที'
                    : 'When users submit a sell request from their stable, it will appear here for your review.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((horse) => (
                  <div
                    key={horse.id}
                    className="p-4 rounded-xl bg-stone-950 border border-amber-500/30 hover:border-amber-400/60 transition-colors flex flex-col justify-between font-mono"
                  >
                    <div>
                      <div className="flex gap-3">
                        <img
                          src={horse.image}
                          alt={horse.name}
                          className="w-20 h-20 rounded-lg object-cover border border-stone-800 shrink-0"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src.includes('/src/assets/images/')) {
                              target.src = target.src.replace('/src/assets/images/', '/images/');
                            } else if (!target.src.includes(goldenThoroughbred)) {
                              target.src = goldenThoroughbred;
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-[11px] text-amber-400">
                            <span>#{horse.tokenId}</span>
                            <span>·</span>
                            <span>{horse.bloodline}</span>
                            <span>·</span>
                            <span>{horse.gender}</span>
                          </div>
                          <div className="font-bold text-sm text-stone-100 truncate mt-0.5">
                            {lang === 'th' ? horse.thaiName : horse.name}
                          </div>
                          <div className="text-[11px] text-stone-400 mt-1 truncate">
                            {lang === 'th' ? 'ผู้ขอขาย: ' : 'Seller: '}
                            <span className="text-stone-300">{horse.owner}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats & Requested Price */}
                      <div className="mt-3 p-2.5 rounded-lg bg-stone-900 border border-stone-800 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-[10px] text-stone-500">{lang === 'th' ? 'สเตตัส (Speed/Stam)' : 'Stats'}</div>
                          <div className="font-bold text-stone-200 mt-0.5">⚡ {horse.speed} / ❤️ {horse.stamina}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-amber-400 font-semibold">{lang === 'th' ? 'ราคาที่ขอตั้งขาย' : 'Requested Price'}</div>
                          <div className="font-bold text-amber-300 text-sm mt-0.5">{horse.pendingPriceEth ?? horse.priceEth} SepoliaETH</div>
                        </div>
                      </div>
                    </div>

                    {/* Reject Dialog or Action Buttons */}
                    {rejectingHorseId === horse.id ? (
                      <div className="mt-3 pt-3 border-t border-stone-800 space-y-2">
                        <div className="text-[11px] text-rose-300 font-semibold">{lang === 'th' ? 'ระบุเหตุผลการปฏิเสธ:' : 'Rejection Reason:'}</div>
                        <input
                          type="text"
                          value={rejectionNote}
                          onChange={(e) => setRejectionNote(e.target.value)}
                          placeholder={lang === 'th' ? 'เช่น ราคาไม่เหมาะสม หรือต้องการเอกสารเพิ่มเติม' : 'Reason for rejection'}
                          className="w-full py-1.5 px-2.5 rounded bg-stone-900 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-rose-400"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setRejectingHorseId(null)}
                            className="py-1 px-3 rounded text-xs text-stone-400 border border-stone-800"
                          >
                            {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
                          </button>
                          <button
                            onClick={() => handleConfirmReject(horse)}
                            className="flex-1 py-1 px-3 rounded bg-rose-500 hover:bg-rose-400 text-stone-950 font-bold text-xs"
                          >
                            {lang === 'th' ? 'ยืนยันปฏิเสธคำขอ' : 'Confirm Rejection'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-stone-800 flex items-center gap-2">
                        <button
                          onClick={() => setRejectingHorseId(horse.id)}
                          className="py-2 px-3 rounded-lg text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{lang === 'th' ? 'ปฏิเสธ' : 'Reject'}</span>
                        </button>
                        <button
                          onClick={() => onApproveListing(horse)}
                          className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Check className="w-4 h-4" />
                          <span>{lang === 'th' ? 'อนุมัติการวางขายทันที' : 'Approve & Publish to Market'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MINT NEW GENESIS HORSE */}
        {activeTab === 'mint' && (
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl max-w-2xl mx-auto">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-stone-800">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  {lang === 'th' ? 'มิ้นต์ม้าตัวใหม่เข้าสู่ตลาด (เฉพาะแอดมิน)' : 'Mint & List New Horse (Admin Only)'}
                </h3>
                <p className="text-xs text-stone-400">
                  {lang === 'th' ? 'สร้างม้าแข่งตัวใหม่ กำหนดราคา 0.01 - 0.02 SepoliaETH เพื่อวางขายในตลาดทันที' : 'Create new horse with pricing restricted between 0.01 - 0.02 SepoliaETH.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleMintSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-stone-300 mb-1 uppercase">
                  {lang === 'th' ? 'ชื่อม้า (Horse Name)' : 'Horse Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'th' ? 'เช่น สายฟ้าพญาเพลิง, Apex Sovereign' : 'e.g. Imperial Thunder'}
                  className="w-full py-2.5 px-3 rounded-lg bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1 uppercase">
                    {lang === 'th' ? 'สายเลือด (Bloodline)' : 'Bloodline'}
                  </label>
                  <select
                    value={bloodline}
                    onChange={(e) => setBloodline(e.target.value as Bloodline)}
                    className="w-full py-2.5 px-3 rounded-lg bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Thoroughbred">Thoroughbred (ความเร็วสูง)</option>
                    <option value="Arabian">Arabian (อึดทนทาน)</option>
                    <option value="Andalusian">Andalusian (คล่องแคล่ว)</option>
                    <option value="Pegasus">Pegasus (เร่งความเร็ว)</option>
                    <option value="Mustang">Mustang (ดุดัน)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 uppercase">
                    {lang === 'th' ? 'เพศ (Gender)' : 'Gender'}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full py-2.5 px-3 rounded-lg bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Stallion">Stallion (พ่อพันธุ์)</option>
                    <option value="Mare">Mare (แม่พันธุ์)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-stone-300 uppercase">
                    {lang === 'th' ? 'ราคาเปิดขาย (0.01 - 0.02 SepoliaETH)' : 'Listing Price (0.01 - 0.02 SepoliaETH)'}
                  </label>
                  <span className="text-amber-400 font-bold">{priceEth} ETH</span>
                </div>
                <input
                  type="range"
                  min="0.010"
                  max="0.020"
                  step="0.001"
                  value={priceEth}
                  onChange={(e) => setPriceEth(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-2 uppercase">
                  {lang === 'th' ? 'เลือกลักษณะสายพันธุ์และรูปม้า' : 'Select Appearance & Coat'}
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {AVAILABLE_IMAGES.map((item, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                        selectedImageIndex === idx
                          ? 'border-amber-400 ring-2 ring-amber-400/20 scale-95'
                          : 'border-stone-800 hover:border-stone-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src.includes('/src/assets/images/')) {
                            target.src = target.src.replace('/src/assets/images/', '/images/');
                          }
                        }}
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-1 text-[11px] text-stone-500">
                  {AVAILABLE_IMAGES[selectedImageIndex].label}
                </div>
              </div>

              {/* Equine Passport & Document Upload Module */}
              <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/30 space-y-3.5">
                <div className="flex items-center gap-2 pb-2.5 border-b border-stone-800">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-stone-200">
                    {lang === 'th' ? 'เอกสารใบสิชล / ใบรูปพรรณม้า (Equine Passport)' : 'Equine Passport & Identification Document'}
                  </span>
                  <span className="ml-auto text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    🔒 {lang === 'th' ? 'เฉพาะผู้ซื้อที่เห็น' : 'Buyer Exclusivity'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 leading-relaxed">
                  🛡️ {lang === 'th'
                    ? 'เพื่อความปลอดภัยสูงสุดและป้องกันการสวมสิทธิ์: ข้อมูลใบสิชล รหัสไมโครชิป และไฟล์เอกสารที่อัปโหลดจะถูกเข้ารหัสคุ้มครอง คนทั่วไปในตลาดจะไม่เห็นเอกสาร ผู้ที่ทำรายการซื้อและได้กรรมสิทธิ์เท่านั้นที่จะเห็นเอกสารนี้'
                    : 'Maximum Security: Equine passport and uploaded scan files are cryptographically protected and will only be revealed to the confirmed buyer after purchase to prevent identity theft.'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 text-[11px] mb-1">
                      {lang === 'th' ? 'เลขที่ใบสิชล (Certificate No.)' : 'Certificate Number'}
                    </label>
                    <input
                      type="text"
                      value={certNumber}
                      onChange={(e) => setCertNumber(e.target.value)}
                      placeholder="e.g. TEF-REG-2026-8890"
                      className="w-full py-2 px-3 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 text-[11px] mb-1">
                      {lang === 'th' ? 'รหัสไมโครชิป (ISO 11784 RFID)' : 'RFID Microchip ID'}
                    </label>
                    <input
                      type="text"
                      value={microchipId}
                      onChange={(e) => setMicrochipId(e.target.value)}
                      placeholder="e.g. 985141002349182"
                      className="w-full py-2 px-3 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 text-[11px] mb-1">
                    {lang === 'th' ? 'สมาคม / หน่วยงานผู้ออกใบรับรอง' : 'Issuing Authority'}
                  </label>
                  <input
                    type="text"
                    value={issuingAuthority}
                    onChange={(e) => setIssuingAuthority(e.target.value)}
                    placeholder="สมาคมกีฬาขี่ม้าแห่งประเทศไทย (TEF)"
                    className="w-full py-2 px-3 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-600 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 text-[11px] mb-1">
                    {lang === 'th' ? 'บันทึกตำหนิรูปพรรณม้าอย่างละเอียด (ด่างหน้า, ถุงเท้าขาว, ขวัญ)' : 'Physical Markings & Identification'}
                  </label>
                  <textarea
                    rows={2}
                    value={physicalMarkings}
                    onChange={(e) => setPhysicalMarkings(e.target.value)}
                    placeholder={lang === 'th' ? 'เช่น แต้มด่างดาวสีขาวบนหน้าผาก, ข้อเท้าขาวขาหลังขวา, ขวัญ 2 จุดบริเวณแผงคอ' : 'Describe star markings, socks, whorls...'}
                    className="w-full py-2 px-3 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 placeholder-stone-600 focus:border-amber-400 focus:outline-none resize-none"
                  />
                </div>

                {/* File Upload Field */}
                <div>
                  <label className="block text-stone-300 text-[11px] mb-1">
                    {lang === 'th' ? 'อัปโหลดเอกสารใบสิชล / รูปพรรณ (PDF / ภาพสแกน)' : 'Upload Passport Document / Scan File'}
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer py-2.5 px-3 rounded-lg border border-dashed border-stone-700 hover:border-amber-400 bg-stone-900 hover:bg-stone-850 transition-colors flex items-center justify-center gap-2 text-stone-300">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span className="truncate">
                        {uploadedDocumentName || (lang === 'th' ? 'คลิกเพื่อเลือกไฟล์เอกสาร (PDF, JPG, PNG)' : 'Select document file')}
                      </span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleDocumentFileChange}
                        className="hidden"
                      />
                    </label>
                    {uploadedDocumentName && (
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedDocumentName('');
                          setUploadedDocumentUrl(undefined);
                        }}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded border border-rose-500/20"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">
                    {lang === 'th'
                      ? '* หากไม่มีไฟล์สแกน ระบบจะสร้างใบสิชลดิจิทัลมาตรฐานสมาคม TEF ให้โดยอัตโนมัติ'
                      : '* If no file uploaded, an official certified digital passport will be generated.'}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isMinting || !name.trim()}
                className="w-full mt-4 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isMinting ? (
                  <span>{lang === 'th' ? 'กำลังบันทึกลงบล็อคเชน...' : 'Creating horse on-chain...'}</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{lang === 'th' ? `มิ้นต์และวางขายที่ราคา ${priceEth} SepoliaETH` : `Mint & List at ${priceEth} SepoliaETH`}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ADMIN INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2 text-stone-200 font-bold">
                <Package className="w-5 h-5 text-amber-400" />
                <span className="font-serif text-lg">{lang === 'th' ? 'ม้าในความดูแลของแอดมิน' : 'Admin Listed Horses'}</span>
              </div>
              <span className="font-mono text-xs text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded">
                {adminHorses.length} {lang === 'th' ? 'ตัวในตลาด' : 'items'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {adminHorses.map((horse) => (
                <div
                  key={horse.id}
                  className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-3 font-mono"
                >
                  <img
                    src={horse.image}
                    alt={horse.name}
                    className="w-14 h-14 rounded-lg object-cover border border-stone-800 shrink-0"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.includes('/src/assets/images/')) {
                        target.src = target.src.replace('/src/assets/images/', '/images/');
                      } else if (!target.src.includes(goldenThoroughbred)) {
                        target.src = goldenThoroughbred;
                      }
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-stone-100 truncate">
                      {lang === 'th' ? horse.thaiName : horse.name}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {horse.bloodline} · #{horse.tokenId}
                    </div>
                    <div className="text-amber-400 font-bold text-xs mt-1">
                      {horse.priceEth} SepoliaETH
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => onDelistHorse(horse)}
                      className="p-1.5 rounded text-stone-400 hover:text-rose-400 hover:bg-stone-900 text-xs"
                      title={lang === 'th' ? 'นำออกจากตลาด' : 'Delist'}
                    >
                      {horse.isListed ? (
                        <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">Delist</span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Listed</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Wallet Proof Box */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono text-stone-400 space-y-2 mt-4">
              <div className="text-stone-300 font-bold flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'th' ? 'ปลายทางรับเงินจริง (Destination Receiver)' : 'Sales Proceeds Destination'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-stone-400">
                {lang === 'th'
                  ? `เมื่อผู้ใช้งานทั่วไปกดซื้อ ระบบจะส่งคำสั่งโอน SepoliaETH ไปยังที่อยู่ ${ADMIN_WALLET_ADDRESS} โดยตรงบนเชนจริง`
                  : `All buyer payments are dispatched directly to ${ADMIN_WALLET_ADDRESS} on the Ethereum Sepolia network.`}
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
