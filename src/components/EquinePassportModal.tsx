import React, { useRef } from 'react';
import { HorseItem } from '../types/horse';
import { X, ShieldCheck, Printer, Download, Award, FileText, Lock, QrCode, ExternalLink, CheckCircle } from 'lucide-react';

interface EquinePassportModalProps {
  horse: HorseItem;
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
}

export const EquinePassportModal: React.FC<EquinePassportModalProps> = ({
  horse,
  isOpen,
  onClose,
  lang
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !horse.passport) return null;

  const passport = horse.passport;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-3xl rounded-2xl border border-amber-500/40 bg-stone-900 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Controls */}
        <div className="p-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">
              {lang === 'th' ? 'เอกสารใบสิชล / ใบรูปพรรณม้าต้นฉบับ (กรรมสิทธิ์เฉพาะผู้ซื้อ)' : 'Official Equine Passport & Identification (Owner Only)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 px-3 rounded-lg text-xs font-mono text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors flex items-center gap-1.5"
              title="Print Certificate"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'th' ? 'พิมพ์ / พีดีเอฟ' : 'Print / PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Styled like an authentic Official Equine Passport document) */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto bg-stone-950">
          <div
            ref={certificateRef}
            className="relative p-6 sm:p-8 rounded-xl border-2 border-amber-600/50 bg-stone-900 text-stone-100 shadow-inner overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(ellipse at 50% 10%, rgba(245, 158, 11, 0.04) 0%, transparent 70%)'
            }}
          >
            {/* Watermark Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
              <span className="text-9xl font-serif font-black tracking-widest text-amber-400 rotate-[-25deg]">
                EQUUS
              </span>
            </div>

            {/* Document Header */}
            <div className="text-center pb-6 border-b border-amber-500/30">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 mb-3 shadow-md">
                <Award className="w-7 h-7" />
              </div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                {passport.issuingAuthority}
              </div>
              <h1 className="mt-1 font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-100">
                ใบรูปพรรณและทะเบียนประวัติม้า
              </h1>
              <div className="text-xs font-serif text-stone-400 italic">
                Official Equine Passport & Identification Certificate
              </div>

              {/* Certificate No and Issue Date */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
                <span className="px-2.5 py-1 bg-stone-950 border border-stone-800 rounded text-amber-300">
                  <span className="text-stone-500">เลขที่ใบสิชล (Cert No.):</span> {passport.certificateNumber}
                </span>
                <span className="px-2.5 py-1 bg-stone-950 border border-stone-800 rounded text-stone-300">
                  <span className="text-stone-500">วันออกเอกสาร:</span> {passport.issueDate}
                </span>
              </div>
            </div>

            {/* Main Certificate Content Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Photo & Microchip Barcode Column */}
              <div className="md:col-span-4 space-y-4">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-amber-500/30 bg-stone-950 shadow-md">
                  <img
                    src={horse.image}
                    alt={horse.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500/90 text-stone-950 font-mono text-[10px] font-bold shadow">
                    SEALED & VERIFIED
                  </div>
                </div>

                {/* Microchip Badge */}
                <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 font-mono text-center">
                  <div className="text-[10px] uppercase text-stone-500 tracking-wider">
                    {lang === 'th' ? 'รหัสไมโครชิปฝังตัวม้า (ISO 11784 RFID)' : 'RFID Microchip ID'}
                  </div>
                  <div className="mt-1 text-sm font-bold text-amber-400 tracking-widest select-all">
                    {passport.microchipId}
                  </div>
                  <div className="mt-1 text-[9px] text-stone-500">
                    Transponder Standard 134.2 kHz FDX-B
                  </div>
                </div>

                {/* Uploaded File preview notice if available */}
                {passport.documentFileName && (
                  <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs font-mono text-amber-300 flex items-center justify-between">
                    <span className="truncate max-w-[170px] text-[11px] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{passport.documentFileName}</span>
                    </span>
                    {passport.documentUrl && (
                      <a
                        href={passport.documentUrl}
                        download={passport.documentFileName}
                        className="p-1 hover:text-white transition-colors"
                        title="Download uploaded file"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Data Specifications Column */}
              <div className="md:col-span-8 space-y-4 text-xs font-mono">
                
                {/* Identification Table */}
                <div className="bg-stone-950 rounded-lg border border-stone-800 overflow-hidden divide-y divide-stone-800/80">
                  <div className="p-2.5 flex justify-between">
                    <span className="text-stone-400">{lang === 'th' ? 'ชื่อม้าจดทะเบียน' : 'Registered Name'}:</span>
                    <span className="font-bold text-stone-100">{horse.thaiName} ({horse.name})</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-stone-400">{lang === 'th' ? 'สายพันธุ์ (Stud Book)' : 'Breed'}:</span>
                    <span className="text-amber-300 font-semibold">{horse.bloodline}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-stone-400">{lang === 'th' ? 'เพศ' : 'Gender'}:</span>
                    <span className="text-stone-200">{horse.gender === 'Stallion' ? 'ม้าผู้ (Stallion)' : 'ม้าเมีย (Mare)'}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-stone-400">{lang === 'th' ? 'วัน/เดือน/ปีเกิด' : 'Date of Birth'}:</span>
                    <span className="text-stone-200">{horse.birthDate}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-stone-400">{lang === 'th' ? 'สีและลักษณะขน' : 'Color & Coat'}:</span>
                    <span className="text-stone-200">{passport.colorAndCoat}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-stone-400">{lang === 'th' ? 'พ่อพันธุ์ (Sire)' : 'Sire'}:</span>
                    <span className="text-stone-200">{horse.sireName || 'Genesis Stud'}</span>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span className="text-stone-400">{lang === 'th' ? 'แม่พันธุ์ (Dam)' : 'Dam'}:</span>
                    <span className="text-stone-200">{horse.damName || 'Genesis Dam'}</span>
                  </div>
                </div>

                {/* Physical Markings Details (Crucial for preventing identity theft) */}
                <div className="p-3.5 rounded-lg bg-stone-950 border border-amber-500/20">
                  <div className="text-[11px] uppercase font-bold text-amber-400 tracking-wider mb-1.5 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'th' ? 'บันทึกตำหนิรูปพรรณม้าอย่างละเอียด (Physical Markings)' : 'Physical Markings & Distinctive Identification'}</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {passport.physicalMarkings}
                  </p>
                </div>

                {/* Owner and Blockchain Fingerprint */}
                <div className="p-3 rounded-lg bg-stone-950/70 border border-stone-800 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">{lang === 'th' ? 'ผู้ครอบครองกรรมสิทธิ์ปัจจุบัน' : 'Current Legal Owner'}:</span>
                    <span className="text-stone-300 select-all font-mono">{horse.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{lang === 'th' ? 'เลขทะเบียนสัญญาบล็อคเชน' : 'Token ID'}:</span>
                    <span className="text-amber-400 font-bold">ERC-721 #{horse.tokenId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">{lang === 'th' ? 'ลายเซ็นดิจิทัลรับรอง (Hash)' : 'Document Hash'}:</span>
                    <span className="text-stone-400 truncate max-w-[200px]">{passport.verifiedHash}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Signatures & Official Stamp */}
            <div className="mt-8 pt-6 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500/60 bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-mono font-bold text-center leading-tight">
                  TEF<br />PASSPORT
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-200">{passport.registrarSignature}</div>
                  <div className="text-[10px] text-stone-500 font-mono">กองทะเบียนและสัตวแพทย์ สมาคมกีฬาขี่ม้าแห่งประเทศไทย</div>
                </div>
              </div>

              <div className="text-right text-[10px] font-mono text-stone-500">
                <div>🔒 {lang === 'th' ? 'เอกสารเข้ารหัสคุ้มครองกรรมสิทธิ์เฉพาะผู้ซื้อ' : 'Cryptographically protected for verified owner'}</div>
                <div className="text-emerald-400 font-semibold mt-0.5">✓ Official Certified Equine Identity Document</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
