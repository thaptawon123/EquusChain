import React, { useState } from 'react';
import { Download, Copy, Check, FileCode, Play, Terminal, ExternalLink, Code2 } from 'lucide-react';
import {
  HORSE_NFT_SOL,
  HORSE_MARKETPLACE_SOL,
  NFT_ABI,
  MARKETPLACE_ABI,
  HORSE_NFT_CONTRACT_ADDRESS,
  MARKETPLACE_CONTRACT_ADDRESS
} from '../contracts/contractData';

interface SolidityViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
}

export const SolidityViewerModal: React.FC<SolidityViewerModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [selectedFile, setSelectedFile] = useState<'HorseNFT.sol' | 'HorseMarketplace.sol' | 'ABI'>('HorseNFT.sol');
  const [copied, setCopied] = useState(false);
  const [simulatedCallResult, setSimulatedCallResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCode =
    selectedFile === 'HorseNFT.sol'
      ? HORSE_NFT_SOL
      : selectedFile === 'HorseMarketplace.sol'
      ? HORSE_MARKETPLACE_SOL
      : JSON.stringify({ NFT_ABI, MARKETPLACE_ABI }, null, 2);

  const handleDownload = () => {
    const filename = selectedFile === 'ABI' ? 'EquusChain_ABIs.json' : selectedFile;
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateCall = (method: string) => {
    if (method === 'getHorse') {
      setSimulatedCallResult(`// Return getHorse(101):
{
  name: "Golden Eclipse",
  bloodline: 0 /* Thoroughbred */,
  gender: 0 /* Stallion */,
  generation: 0,
  speed: 96,
  stamina: 92,
  agility: 89,
  temperament: 84,
  racesWon: 14,
  totalRaces: 16,
  sireId: 0,
  damId: 0,
  dnaHash: "0x8fa314a938cde9910d93821034f8921b380a13efd890123847aaef10928374a1"
}`);
    } else if (method === 'getListing') {
      setSimulatedCallResult(`// Return getListing("${HORSE_NFT_CONTRACT_ADDRESS}", 101):
{
  seller: "0x3A21c8B3D8412F5e70901e956cA3D12948cDe4B1",
  nftAddress: "${HORSE_NFT_CONTRACT_ADDRESS}",
  tokenId: 101,
  price: 2850000000000000000 /* 2.85 ETH */,
  active: true,
  listedAt: 1711200000
}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-5xl rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                <span>{lang === 'th' ? 'สมาร์ตคอนแทรกต์บล็อคเชน (.sol)' : 'Smart Contract Source Code (.sol)'}</span>
                <span className="text-xs font-mono text-amber-400/90 font-normal border border-amber-500/30 px-1.5 py-0.5 rounded">
                  Solidity ^0.8.20
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                {lang === 'th'
                  ? 'ไฟล์สัญญาอัจฉริยะสำหรับซื้อขายและมิ้นต์ม้า สามารถดาวน์โหลด นำไปคอมไพล์ หรือดีพลอยบน Ethereum / EVM ได้ทันที'
                  : 'Open-source contracts for trading, breeding, and racing equine NFTs. Ready for Remix, Hardhat, or Foundry.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Toolbar & File Tabs */}
        <div className="px-4 py-2.5 bg-stone-950/90 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-lg border border-stone-800">
            <button
              onClick={() => { setSelectedFile('HorseNFT.sol'); setSimulatedCallResult(null); }}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedFile === 'HorseNFT.sol'
                  ? 'bg-amber-400 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              HorseNFT.sol
            </button>
            <button
              onClick={() => { setSelectedFile('HorseMarketplace.sol'); setSimulatedCallResult(null); }}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedFile === 'HorseMarketplace.sol'
                  ? 'bg-amber-400 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              HorseMarketplace.sol
            </button>
            <button
              onClick={() => { setSelectedFile('ABI'); setSimulatedCallResult(null); }}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedFile === 'ABI'
                  ? 'bg-amber-400 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ABI JSON
            </button>
          </div>

          {/* Action buttons: Download & Copy */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
              <span>{copied ? (lang === 'th' ? 'คัดลอกแล้ว' : 'Copied!') : (lang === 'th' ? 'คัดลอกโค้ด' : 'Copy Code')}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? `ดาวน์โหลด ${selectedFile}` : `Download ${selectedFile}`}</span>
            </button>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 overflow-auto bg-stone-950 p-4 font-mono text-xs text-stone-300 leading-relaxed select-text">
          <pre className="overflow-x-auto whitespace-pre font-mono p-3 bg-stone-950/70 rounded-lg border border-stone-800/80">
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Interactive Contract Tester & Deployment Guide Drawer */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-stone-300 font-semibold font-mono">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>{lang === 'th' ? 'ทดสอบคำสั่งสัญญาอัจฉริยะ (View Simulator)' : 'Interactive Contract Call Simulator'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSimulateCall('getHorse')}
                className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono border border-stone-700"
              >
                call getHorse(101)
              </button>
              <button
                onClick={() => handleSimulateCall('getListing')}
                className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono border border-stone-700"
              >
                call getListing(101)
              </button>
            </div>
          </div>

          {simulatedCallResult && (
            <div className="mt-2 p-2.5 rounded bg-stone-950 border border-amber-500/30 text-amber-200/90 font-mono text-[11px] whitespace-pre-wrap">
              {simulatedCallResult}
            </div>
          )}

          <div className="mt-3 pt-2.5 border-t border-stone-800 text-stone-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span>{lang === 'th' ? 'การนำไปใช้งาน: ' : 'Quick Deploy: '}</span>
              <a
                href="https://remix.ethereum.org"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Ethereum Remix IDE</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-stone-600">·</span>
              <span>Hardhat / Foundry Compatible</span>
            </div>

            <span className="text-[11px] font-mono text-stone-500">
              Contract: {HORSE_NFT_CONTRACT_ADDRESS.slice(0, 10)}...{HORSE_NFT_CONTRACT_ADDRESS.slice(-6)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
