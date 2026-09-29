import React, { useState } from 'react';
import { Bloodline, Gender, HorseItem, WalletState } from '../types/horse';
import { X, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import { HORSE_NFT_CONTRACT_ADDRESS } from '../contracts/contractData';

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onMintSuccess: (newHorse: HorseItem) => void;
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

export const MintModal: React.FC<MintModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onMintSuccess,
  lang
}) => {
  const [name, setName] = useState('');
  const [bloodline, setBloodline] = useState<Bloodline>('Thoroughbred');
  const [gender, setGender] = useState<Gender>('Stallion');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMinting, setIsMinting] = useState(false);

  if (!isOpen) return null;

  const MINT_FEE = 0.05;
  const canAfford = wallet.balanceEth >= MINT_FEE;

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!canAfford) return;

    setIsMinting(true);
    // Simulate transaction submission
    await new Promise((r) => setTimeout(r, 1200));

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
      priceEth: 1.5,
      isListed: false, // In user stable
      owner: wallet.address,
      description: `Newly minted Genesis ${bloodline} ${gender}. Unique on-chain DNA with exceptional raw traits.`,
      thaiDescription: `ม้าปฐมบท (Genesis) สายเลือด ${bloodline} เพศ${gender === 'Stallion' ? 'ผู้' : 'เมีย'} สร้างขึ้นใหม่บนบล็อคเชน พร้อมค่าพันธุกรรมสุ่มพิเศษ`,
      dnaHash,
      contractAddress: HORSE_NFT_CONTRACT_ADDRESS
    };

    setIsMinting(false);
    onMintSuccess(newHorse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-xl rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-100">
                {lang === 'th' ? 'มิ้นต์ม้าสายพันธุ์ปฐมบท (Mint Genesis Horse)' : 'Mint Genesis Horse NFT'}
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                {lang === 'th' ? 'สร้างม้าแข่งตัวใหม่ลงบนบล็อคเชนด้วยฟังก์ชัน mintHorse() ใน HorseNFT.sol' : 'Executes mintHorse() on HorseNFT.sol with on-chain pseudo-random DNA.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleMint} className="p-6 space-y-4">
          
          {/* Horse Name */}
          <div>
            <label className="block text-xs font-mono text-stone-300 mb-1.5 uppercase">
              {lang === 'th' ? 'ชื่อม้า (Horse Name)' : 'Horse Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'th' ? 'เช่น Shadow Runner, สุริยันเกรียงไกร' : 'e.g. Thunder Sovereign'}
              className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 outline-none transition-colors"
            />
          </div>

          {/* Bloodline & Gender Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1.5 uppercase">
                {lang === 'th' ? 'สายเลือด (Bloodline)' : 'Bloodline'}
              </label>
              <select
                value={bloodline}
                onChange={(e) => setBloodline(e.target.value as Bloodline)}
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-lg px-3 py-2.5 text-sm text-stone-100 outline-none"
              >
                <option value="Thoroughbred">Thoroughbred (ความเร็วสูง)</option>
                <option value="Arabian">Arabian (อึดทนทาน)</option>
                <option value="Andalusian">Andalusian (คล่องแคล่ว)</option>
                <option value="Pegasus">Pegasus (เร่งแซง)</option>
                <option value="Mustang">Mustang (ดุดัน)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1.5 uppercase">
                {lang === 'th' ? 'เพศ (Gender)' : 'Gender'}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-lg px-3 py-2.5 text-sm text-stone-100 outline-none"
              >
                <option value="Stallion">{lang === 'th' ? 'ม้าพ่อพันธุ์ (Stallion)' : 'Stallion'}</option>
                <option value="Mare">{lang === 'th' ? 'ม้าแม่พันธุ์ (Mare)' : 'Mare'}</option>
              </select>
            </div>
          </div>

          {/* Appearance / Coat Select */}
          <div>
            <label className="block text-xs font-mono text-stone-300 mb-1.5 uppercase">
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
            <div className="mt-1 text-[11px] font-mono text-stone-500">
              {AVAILABLE_IMAGES[selectedImageIndex].label}
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="p-3.5 rounded-lg bg-stone-950 border border-stone-800 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-stone-400">
              <span>{lang === 'th' ? 'ค่าธรรมเนียมมิ้นต์ (Smart Contract Fee)' : 'Mint Fee'}</span>
              <span className="text-stone-200 font-semibold">{MINT_FEE} SepoliaETH</span>
            </div>
            <div className="flex justify-between text-stone-500 text-[11px]">
              <span>{lang === 'th' ? 'ค่าแก๊สบน Sepolia' : 'Estimated Gas on Sepolia'}</span>
              <span>~0.0035 SepoliaETH</span>
            </div>
            <div className="pt-2 border-t border-stone-800/80 flex justify-between text-stone-200 font-bold">
              <span>{lang === 'th' ? 'ยอดรวมสุทธิ' : 'Total Required'}</span>
              <span className="text-amber-400">0.0535 SepoliaETH</span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isMinting || !canAfford || !name.trim()}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                canAfford && name.trim()
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 shadow-md'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              {isMinting ? (
                <span className="font-mono text-xs">{lang === 'th' ? 'กำลังส่งคำสั่งไปยัง MetaMask บน Sepolia...' : 'Confirming on Sepolia in MetaMask...'}</span>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>{lang === 'th' ? `ยืนยันการมิ้นต์ (${MINT_FEE} SepoliaETH)` : `Mint Horse Token (${MINT_FEE} SepoliaETH)`}</span>
                </>
              )}
            </button>
            {!canAfford && (
              <div className="mt-2 text-center text-xs text-rose-400 font-mono">
                {lang === 'th' ? 'ยอด SepoliaETH ไม่เพียงพอ กรุณากดปุ่มกระเป๋าเพื่อรับ SepoliaETH ฟรี' : 'Insufficient SepoliaETH. Click wallet to get testnet ETH.'}
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
