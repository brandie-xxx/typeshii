/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Trash2, CheckCircle2 } from 'lucide-react';
import { SavedColor } from '../types';

export interface ColorCardProps {
  color: SavedColor;
  onDelete: (id: string) => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

const ColorCard: React.FC<ColorCardProps> = ({ color, onDelete, onShowToast }) => {
  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedTailwind, setCopiedTailwind] = useState(false);

  const displayHex = color.hex.startsWith('#') ? color.hex : `#${color.hex}`;

  const handleCopyHex = () => {
    navigator.clipboard.writeText(displayHex);
    setCopiedHex(true);
    onShowToast(`Copied ${displayHex} to clipboard!`, 'success');
    setTimeout(() => setCopiedHex(false), 2000);
  };

  const handleCopyTailwind = (e: React.MouseEvent) => {
    e.stopPropagation();
    const tw = `bg-[${displayHex}]`;
    navigator.clipboard.writeText(tw);
    setCopiedTailwind(true);
    onShowToast(`Copied Tailwind class "${tw}"!`, 'success');
    setTimeout(() => setCopiedTailwind(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      className="glass rounded-xl overflow-hidden shadow-subtle hover:shadow-medium border border-separator/35 transition-all duration-300 flex flex-col"
      id={`color-card-${color.id}`}
    >
      {/* Color Swatch Block */}
      <div 
        className="h-28 sm:h-32 w-full relative group cursor-pointer transition-transform duration-300 flex items-center justify-center"
        style={{ backgroundColor: displayHex }}
        onClick={handleCopyHex}
        title="Click to copy hex code"
      >
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <span className="bg-bg-primary/80 border border-separator/40 hover:bg-bg-primary text-text-primary text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg select-none">
            {copiedHex ? <CheckCircle2 size={12} className="text-vibrant" /> : <Copy size={12} />}
            Copy HEX
          </span>
        </div>
      </div>

      {/* Info Panel */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-black/25">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-xs font-semibold text-text-secondary truncate tracking-wide">
                {color.name || 'Untitled Swatch'}
              </p>
              <p className="text-sm font-bold font-mono tracking-widest text-text-primary mt-0.5 select-all">
                {displayHex.toUpperCase()}
              </p>
            </div>
            
            <button
              onClick={() => onDelete(color.id)}
              className="text-text-secondary hover:text-error transition-colors p-1.5 rounded-full hover:bg-error/10 cursor-pointer"
              title="Delete palette color"
              id={`delete-color-btn-${color.id}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Action utility helpers */}
        <div className="pt-3 border-t border-separator/10 mt-3 flex gap-2">
          <button
            onClick={handleCopyTailwind}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 bg-white/5 border border-separator/10 hover:bg-white/10 transition-all rounded-lg text-[10px] font-bold font-mono text-text-secondary hover:text-text-primary cursor-pointer select-none"
            title="Copy Tailwind dynamic class code"
            id={`copy-tw-btn-${color.id}`}
          >
            {copiedTailwind ? <CheckCircle2 size={10} className="text-vibrant" /> : <Copy size={10} />}
            Tailwind Class
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ColorCard;
