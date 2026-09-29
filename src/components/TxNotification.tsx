import React from 'react';
import { CheckCircle2, ExternalLink, X } from 'lucide-react';
import { Web3Transaction } from '../types/horse';

interface TxNotificationProps {
  tx: Web3Transaction | null;
  onClose: () => void;
  lang: 'th' | 'en';
}

export const TxNotification: React.FC<TxNotificationProps> = ({ tx, onClose, lang }) => {
  if (!tx) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl border border-amber-500/40 bg-stone-950/95 p-4 shadow-2xl backdrop-blur-md text-stone-100 animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-emerald-500/20 p-1 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>

        <div className="flex-1 pr-2">
          <div className="font-semibold text-xs font-mono text-stone-200">
            {lang === 'th' ? 'ธุรกรรมสำเร็จบนบล็อคเชน' : 'Transaction Confirmed'}
          </div>
          <div className="text-xs text-stone-400 mt-0.5">
            {tx.type} {tx.horseName}
          </div>
          <div className="mt-1.5 flex items-center gap-2 font-mono text-[11px] text-amber-400/90">
            <span>Block #{tx.blockNumber}</span>
            <span>·</span>
            <span className="truncate max-w-[140px] text-stone-400">
              {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-stone-500 hover:text-stone-300 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
