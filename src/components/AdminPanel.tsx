import React, { useState } from 'react';
import { HorseItem, WalletState, Bloodline, Gender } from '../types/horse';
import { ShieldCheck, PlusCircle, Sparkles, DollarSign, Package, Lock, ArrowLeft } from 'lucide-react';
import { ADMIN_WALLET_ADDRESS } from '../services/web3Service';
import { HORSE_NFT_CONTRACT_ADDRESS } from '../contracts/contractData';

interface AdminPanelProps {
  wallet: WalletState;
  horses: HorseItem[];
  onAdminMint: (newHorse: HorseItem) => void;
  onGoMarketplace: () => void;
  lang: 'th' | 'en';
}

const AVAILABLE_IMAGES = [
  {
    url: '/src/assets/images/horse_golden_thoroughbred_1790702796493.jpg',
    label: 'Golden Palomino (Thoroughbred)'
  },
  {
    url: '/src/assets/images/horse_arabian_stallion_1790702784701.jpg',
    label: 'Obsidian Midnight (Arabian)'
  },
  {
    url: '/src/assets/images/horse_pearl_andalusian_1790702807758.jpg',
    label: 'Dappled Pearl (Andalusian)'
  },
  {
    url: '/src/assets/images/hero_equine_nft_1790702770948.jpg',
    label: 'Emerald Dawn (Pegasus)'
  }
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  wallet,
  horses,
  onAdminMint,
  onGoMarketplace,
  lang
}) => {
  const [name, setName] = useState('');
  const [bloodline, setBloodline] = useState<Bloodline>('Thoroughbred');
  const [gender, setGender] = useState<Gender>('Stallion');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [priceEth, setPriceEth] = useState<number>(0.015);
  const [isMinting, setIsMinting] = useState(false);

  const isAdmin = wallet.isConnected && wallet.address.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase();

  // Strict Access Control: If NOT the real admin, block access!
  if (!isAdmin) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-md px-4 text-center p-8 rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-xl font-bold text-stone-100 mb-2">
            {lang === 'th' ? 'ไม่มีสิทธิ์เข้าถึง (เฉพาะแอดมิน)' : 'Access Restricted (Admin Only)'}
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed mb-4">
            {lang === 'th'
              ? `เมนูนี้สงวนไว้เฉพาะกระเป๋าผู้ดูแลระบบ ${ADMIN_WALLET_ADDRESS} เท่านั้น ผู้ใช้งานทั่วไปสามารถเลือกซื้อม้าได้ในตลาด`
              : `This panel is restricted exclusively to administrator ${ADMIN_WALLET_ADDRESS}. Buyers can browse and purchase horses in the marketplace.`}
          </p>
          <div className="p-2.5 bg-stone-950 rounded-lg border border-stone-800 font-mono text-[11px] text-stone-500 mb-6 truncate">
            {lang === 'th' ? 'กระเป๋าปัจจุบัน: ' : 'Your Wallet: '}
            <span className="text-stone-300">{wallet.address}</span>
          </div>
          <button
            onClick={onGoMarketplace}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 transition-colors flex items-center justify-center gap-2 font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'th' ? 'กลับไปยังตลาดซื้อขายม้า' : 'Return to Marketplace'}</span>
          </button>
        </div>
      </section>
    );
  }

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
      owner: ADMIN_WALLET_ADDRESS,
      description: `Official stable release. Genesis ${bloodline} ${gender}. Direct sales proceed to ${ADMIN_WALLET_ADDRESS}.`,
      thaiDescription: `ม้าปฐมบท (Genesis) สายเลือด ${bloodline} จากคอกแอดมิน วางขายในตลาดราคา ${priceEth} SepoliaETH รายได้เข้ากระเป๋าแอดมินโดยตรง`,
      dnaHash,
      contractAddress: HORSE_NFT_CONTRACT_ADDRESS
    };

    setIsMinting(false);
    onAdminMint(newHorse);
    setName('');
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'th' ? 'เข้าสู่ระบบในฐานะแอดมินเรียบร้อยแล้ว' : 'Authenticated as Administrator'}</span>
                <span aria-hidden="true">·</span>
                <span>Sepolia</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                {lang === 'th' ? 'เมนูแอดมิน (Admin Panel)' : 'Admin & Minting Studio'}
              </h2>
            </div>

            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs font-mono">
              <div className="text-[10px] text-stone-500 uppercase tracking-wider">
                {lang === 'th' ? 'กระเป๋าแอดมินผู้รับเงินจากการซื้อขาย' : 'Admin Receiving Wallet'}
              </div>
              <div className="font-bold text-amber-400 select-all truncate mt-0.5 max-w-sm">
                {ADMIN_WALLET_ADDRESS}
              </div>
              <div className="mt-1 text-[11px] text-stone-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{lang === 'th' ? 'การซื้อม้าทุกตัวจะส่ง SepoliaETH เข้าบัญชีนี้' : 'All horse purchase proceeds transfer to this account'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column: Mint Form Left, Admin Stats Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Mint Horse Form */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-stone-900 border border-stone-800">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-stone-800">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  {lang === 'th' ? 'มิ้นต์ม้าตัวใหม่เข้าสู่ตลาด' : 'Mint & List New Horse'}
                </h3>
                <p className="text-xs text-stone-400">
                  {lang === 'th' ? 'สร้างม้าแข่งตัวใหม่ กำหนดราคา 0.01 - 0.02 SepoliaETH เพื่อวางขายในตลาดทันที' : 'Create new horse with pricing restricted between 0.01 - 0.02 SepoliaETH.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleMintSubmit} className="space-y-4 text-xs font-mono">
              {/* Horse Name */}
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
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 outline-none"
                />
              </div>

              {/* Bloodline & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 uppercase">
                    {lang === 'th' ? 'สายเลือด (Bloodline)' : 'Bloodline'}
                  </label>
                  <select
                    value={bloodline}
                    onChange={(e) => setBloodline(e.target.value as Bloodline)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-lg px-3 py-2 text-stone-100 outline-none"
                  >
                    <option value="Thoroughbred">Thoroughbred (ความเร็วสูง)</option>
                    <option value="Arabian">Arabian (อึดทนทาน)</option>
                    <option value="Andalusian">Andalusian (คล่องแคล่ว)</option>
                    <option value="Pegasus">Pegasus (เร่งแซง)</option>
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
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-lg px-3 py-2 text-stone-100 outline-none"
                  >
                    <option value="Stallion">{lang === 'th' ? 'ม้าพ่อพันธุ์ (Stallion)' : 'Stallion'}</option>
                    <option value="Mare">{lang === 'th' ? 'ม้าแม่พันธุ์ (Mare)' : 'Mare'}</option>
                  </select>
                </div>
              </div>

              {/* Price selector restricted to 0.01 - 0.02 */}
              <div>
                <label className="block text-stone-300 mb-1 uppercase flex items-center justify-between">
                  <span>{lang === 'th' ? 'ราคาขายในตลาด (SepoliaETH)' : 'Marketplace Price (SepoliaETH)'}</span>
                  <span className="text-amber-400 text-[11px] font-bold">กำหนดไว้ที่ 0.01 - 0.02 ETH</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.001"
                    min="0.01"
                    max="0.02"
                    value={priceEth}
                    onChange={(e) => setPriceEth(parseFloat(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-lg px-3.5 py-2.5 text-sm font-bold text-amber-400 outline-none"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPriceEth(0.01)}
                      className="px-2 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[11px]"
                    >
                      0.010
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceEth(0.015)}
                      className="px-2 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[11px]"
                    >
                      0.015
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceEth(0.02)}
                      className="px-2 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[11px]"
                    >
                      0.020
                    </button>
                  </div>
                </div>
              </div>

              {/* Appearance / Coat Select */}
              <div>
                <label className="block text-stone-300 mb-1 uppercase">
                  {lang === 'th' ? 'รูปลักษณ์และสีขน (Visual Coat)' : 'Visual Coat'}
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
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-1 text-[11px] text-stone-500">
                  {AVAILABLE_IMAGES[selectedImageIndex].label}
                </div>
              </div>

              {/* Submit CTA */}
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

          {/* Right: Horses Listed by Admin */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800">
              <div className="flex items-center gap-2 text-stone-300 font-bold mb-3">
                <Package className="w-4 h-4 text-amber-400" />
                <span className="font-serif text-base">{lang === 'th' ? 'ม้าในความดูแลของแอดมิน' : 'Admin Listed Horses'}</span>
                <span className="ml-auto font-mono text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  {adminHorses.length} {lang === 'th' ? 'ตัว' : 'items'}
                </span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {adminHorses.map((horse) => (
                  <div
                    key={horse.id}
                    className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-3"
                  >
                    <img
                      src={horse.image}
                      alt={horse.name}
                      className="w-12 h-12 rounded-lg object-cover border border-stone-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-stone-100 truncate">
                        {lang === 'th' ? horse.thaiName : horse.name}
                      </div>
                      <div className="text-[11px] font-mono text-stone-400">
                        {horse.bloodline} · #{horse.tokenId}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-amber-400 font-bold text-xs tabular-nums">
                        {horse.priceEth} ETH
                      </div>
                      <div className="text-[10px] text-emerald-400">
                        {horse.isListed ? 'Listed' : 'Sold'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Wallet Proof Box */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono text-stone-400 space-y-2">
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

        </div>

      </div>
    </section>
  );
};
