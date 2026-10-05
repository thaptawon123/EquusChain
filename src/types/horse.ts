export type Bloodline = 'Thoroughbred' | 'Arabian' | 'Andalusian' | 'Pegasus' | 'Mustang';
export type Gender = 'Stallion' | 'Mare';

export type ListingStatus = 'unlisted' | 'pending_approval' | 'approved_listed' | 'rejected';

export interface ListingRequest {
  horseId: number;
  requestedPriceEth: number;
  requestedAt: number;
  sellerAddress: string;
  sellerNote?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: number;
  rejectionReason?: string;
}

export interface EquinePassport {
  certificateNumber: string;        // e.g. "TEF-REG-2024-8841" (เลขที่ใบสิชล / ทะเบียนรูปพรรณม้า)
  issuingAuthority: string;         // e.g. "สมาคมกีฬาขี่ม้าแห่งประเทศไทย (TEF) & สมาคมผู้เพาะพันธุ์ม้าแข่ง"
  issueDate: string;                // e.g. "2024-04-10"
  microchipId: string;              // e.g. "985141002349182" (ISO 11784 RFID Microchip)
  physicalMarkings: string;         // ตำหนิรูปพรรณอย่างละเอียด เช่น ด่างหน้า ถุงเท้าขาว ขวัญ
  colorAndCoat: string;             // สีและลักษณะขน
  registrarSignature: string;       // นายทะเบียนผู้ตรวจสอบ
  documentUrl?: string;             // URL หรือ Base64 ของเอกสาร/ไฟล์สแกน
  documentFileName?: string;        // ชื่อไฟล์เอกสารที่อัปโหลด เช่น "Equine_Passport_TEF101.pdf"
  verifiedHash: string;             // On-chain hash ตรวจสอบความถูกต้อง
}

export interface HorseItem {
  id: number;
  tokenId: number;
  name: string;
  thaiName: string;
  bloodline: Bloodline;
  gender: Gender;
  generation: number;
  speed: number;        // 1 - 100
  stamina: number;      // 1 - 100
  agility: number;      // 1 - 100
  temperament: number;  // 1 - 100
  racesWon: number;
  totalRaces: number;
  birthDate: string;
  sireName?: string;
  damName?: string;
  image: string;
  priceEth: number;
  isListed: boolean;
  listingStatus?: ListingStatus; // unlisted | pending_approval | approved_listed | rejected
  pendingPriceEth?: number;
  pendingListingDate?: string;
  rejectionReason?: string;
  owner: string;
  description: string;
  thaiDescription: string;
  dnaHash: string;
  contractAddress: string;
  accentColor?: string;
  passport?: EquinePassport;        // ใบสิชล / ใบรูปพรรณม้า (เฉพาะเจ้าของที่ซื้อเท่านั้นที่เห็น)
}

export interface Web3Transaction {
  hash: string;
  type: 'BUY' | 'MINT' | 'LIST' | 'DELIST' | 'TRAIN' | 'BREED';
  timestamp: number;
  amountEth: number;
  horseName: string;
  tokenId: number;
  status: 'confirmed' | 'pending' | 'failed';
  blockNumber: number;
  etherscanUrl?: string;
}

export interface WalletState {
  address: string;
  balanceEth: number;
  isConnected: boolean;
  isMetaMask: boolean;
  networkName: string;
  chainId: number;
  isSepolia: boolean;
}
