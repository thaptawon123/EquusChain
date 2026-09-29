import React from 'react';
import { FileCode, Download, ShieldCheck, Cpu, Terminal, ArrowRight } from 'lucide-react';
import { HORSE_NFT_CONTRACT_ADDRESS, MARKETPLACE_CONTRACT_ADDRESS } from '../contracts/contractData';

interface DocsViewProps {
  onOpenContracts: () => void;
  lang: 'th' | 'en';
}

export const DocsView: React.FC<DocsViewProps> = ({ onOpenContracts, lang }) => {
  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title */}
        <div className="pb-6 border-b border-stone-800">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>EquusChain Protocol Specifications</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-100">
            {lang === 'th' ? 'สถาปัตยกรรมบล็อคเชน & Smart Contract' : 'Blockchain Architecture & Smart Contracts'}
          </h2>
          <p className="mt-2 text-sm text-stone-400 leading-relaxed max-w-3xl">
            {lang === 'th'
              ? 'ระบบตลาดซื้อขายม้าแข่งดิจิทัลถูกพัฒนาด้วยสัญญาอัจฉริยะภาษา Solidity มาตรฐาน ERC-721 พร้อมสัญญาตัวกลางซื้อขายแบบไร้คนกลาง (Trustless Escrow Marketplace)'
              : 'Decentralized equine racing & marketplace infrastructure powered by modular Solidity contracts with on-chain genetic verification.'}
          </p>
        </div>

        {/* Section 1: Contracts breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-amber-400 font-semibold">TOKEN CONTRACT</span>
                <span className="font-mono text-[11px] text-stone-500">ERC-721</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-100 mb-2">
                HorseNFT.sol
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                {lang === 'th'
                  ? 'ดูแลการเป็นเจ้าของม้า (Ownership), ค่าสเตตัสพันธุกรรม (Speed, Stamina, Agility, Temperament), การคำนวณ DNA ด้วย Keccak-256 และระบบเพาะพันธุ์ (Breeding)'
                  : 'Manages NFT ownership, on-chain genetic attributes, pseudo-random DNA generation, and offspring breeding mechanics.'}
              </p>
              <div className="space-y-1.5 font-mono text-xs text-stone-300">
                <div className="text-[11px] text-stone-500 uppercase">ฟังก์ชันหลัก (Core Functions):</div>
                <div className="bg-stone-950 p-2 rounded border border-stone-800/80">
                  • <code>mintHorse(name, bloodline, gender, uri)</code><br />
                  • <code>breedHorses(sireId, damId, foalName)</code><br />
                  • <code>trainHorse(tokenId)</code>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs font-mono text-stone-400">
              <span>Max Supply: 10,000</span>
              <button
                onClick={onOpenContracts}
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>{lang === 'th' ? 'ดูโค้ด .sol' : 'View .sol'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-amber-400 font-semibold">EXCHANGE CONTRACT</span>
                <span className="font-mono text-[11px] text-stone-500">Escrow / Non-Custodial</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-100 mb-2">
                HorseMarketplace.sol
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                {lang === 'th'
                  ? 'สัญญาสำหรับการฝากขาย (Listing), ซื้อด้วย ETH ทันที (Atomic Buy), การหักส่วนแบ่งธรรมเนียมตลาด 2.5% และระบบป้องกัน Reentrancy Attack'
                  : 'Trustless marketplace executing atomic item purchases, 2.5% platform fee split, cancellation safeguards, and reentrancy protection.'}
              </p>
              <div className="space-y-1.5 font-mono text-xs text-stone-300">
                <div className="text-[11px] text-stone-500 uppercase">ฟังก์ชันหลัก (Core Functions):</div>
                <div className="bg-stone-950 p-2 rounded border border-stone-800/80">
                  • <code>listItem(nftAddress, tokenId, price)</code><br />
                  • <code>buyItem(nftAddress, tokenId)</code> (payable)<br />
                  • <code>cancelListing(nftAddress, tokenId)</code>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs font-mono text-stone-400">
              <span>Platform Fee: 2.5%</span>
              <button
                onClick={onOpenContracts}
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>{lang === 'th' ? 'ดูโค้ด .sol' : 'View .sol'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Deployment Step-by-Step */}
        <div className="p-6 sm:p-8 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs text-stone-400 uppercase">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>{lang === 'th' ? 'ขั้นตอนการดีพลอยไปยังเครือข่ายจริง (Deployment Steps)' : 'Step-by-Step Deployment Guide'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
              <div className="text-amber-400 font-bold mb-1">01. ดาวน์โหลดไฟล์ .sol</div>
              <p className="text-stone-400 leading-relaxed">
                คลิกปุ่ม &quot;ไฟล์สัญญา (.sol)&quot; ด้านบนเพื่อดาวน์โหลด <code>HorseNFT.sol</code> และ <code>HorseMarketplace.sol</code>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
              <div className="text-amber-400 font-bold mb-1">02. เปิดใน Remix IDE</div>
              <p className="text-stone-400 leading-relaxed">
                นำไฟล์ไปวางใน <a href="https://remix.ethereum.org" target="_blank" rel="noreferrer" className="text-amber-400 underline">Remix Ethereum</a> เลือก Solidity Compiler version <code>0.8.20</code>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
              <div className="text-amber-400 font-bold mb-1">03. Deploy สู่ Testnet / Mainnet</div>
              <p className="text-stone-400 leading-relaxed">
                เชื่อมต่อ MetaMask สู่เครือข่าย Sepolia หรือ Ethereum Mainnet แล้วกด Deploy สัญญาตามลำดับ
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
