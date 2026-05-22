/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Trash2, CheckCircle2, Star } from 'lucide-react';
import { SavedFont } from '../types';
import { getOptimizedLinkCode, getCssCode } from '../utils/fontUtils';
import { useLoadFont } from '../hooks/useLoadFont';

export interface FontCardProps {
  font: SavedFont;
  index: number;
  onDelete: (id: string) => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
  onToggleFavorite?: (id: string) => void;
}

const FontCard: React.FC<FontCardProps> = ({ font, index, onDelete, onShowToast, onToggleFavorite }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);

  const formattedNumber = (index + 1).toString().padStart(3, '0');

  // Dynamically load the font for preview using custom hook
  useLoadFont(font.url);

  const handleCopyLink = () => {
    const code = getOptimizedLinkCode(font.url);
    navigator.clipboard.writeText(code);
    setCopiedLink(true);
    onShowToast('Link code copied to clipboard', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCss = () => {
    const code = getCssCode(font.name);
    navigator.clipboard.writeText(code);
    setCopiedCss(true);
    onShowToast('CSS copied to clipboard', 'success');
    setTimeout(() => setCopiedCss(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -2 }}
      className={`glass rounded-card p-5 sm:p-6 shadow-subtle hover:shadow-medium transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:gap-8 items-stretch sm:items-start ${
        font.isFavorite ? 'border-l-2 border-l-earth bg-earth/[0.02]' : ''
      }`}
      id={`font-card-${font.id}`}
    >
      <div className="flex sm:flex-col items-center justify-between sm:justify-start pt-1 shrink-0">
        <span className={`text-[10px] font-bold font-mono tracking-widest px-2.5 py-1 rounded transition-colors ${
          font.isFavorite 
            ? 'bg-earth/20 text-earth border border-earth/30' 
            : 'bg-white/5 text-text-secondary border border-transparent'
        }`}>
          {formattedNumber}
        </span>
        {/* On mobile, show bookmark status icon next to index number block */}
        {font.isFavorite && (
          <span className="sm:hidden text-xs font-bold text-earth flex items-center gap-1 font-mono uppercase tracking-widest">
            <Star size={12} className="fill-earth" /> fav
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-base sm:text-lg font-semibold text-text-primary tracking-normal truncate" style={{ fontFamily: `'${font.name}', sans-serif` }}>
            {font.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleFavorite?.(font.id)}
              className={`p-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
                font.isFavorite 
                  ? 'text-earth bg-earth/10' 
                  : 'text-text-secondary hover:text-earth hover:bg-earth/5'
              }`}
              id={`favorite-btn-${font.id}`}
              title={font.isFavorite ? 'Remove bookmark' : 'Bookmark / Favorite font'}
            >
              <Star size={16} className={font.isFavorite ? 'fill-earth' : ''} />
            </button>
            <button
              onClick={() => onDelete(font.id)}
              className="text-text-secondary hover:text-error transition-colors p-1.5 rounded-full hover:bg-error/10"
              id={`delete-btn-${font.id}`}
              title="Delete font"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div 
          className="text-xl sm:text-2xl my-6 sm:my-8 leading-tight text-text-primary overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ fontFamily: `'${font.name}', sans-serif` }}
        >
          The quick brown fox jumps over the lazy dog
        </div>

        <div className="text-[10px] text-text-secondary font-mono mb-5 sm:mb-6 break-all bg-black/40 p-3 rounded-xl border border-separator/5 select-all">
          {font.url}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-system-blue text-white rounded-button text-sm font-bold hover:bg-system-blue-hover transition-all active:scale-95 shadow-lg shadow-system-blue/20 cursor-pointer"
            id={`copy-link-btn-${font.id}`}
          >
            {copiedLink ? <CheckCircle2 size={14} className="text-vibrant" /> : <Copy size={14} />}
            Copy Link
          </button>
          <button
            onClick={handleCopyCss}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 glass text-text-primary rounded-button text-sm font-bold hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
            id={`copy-css-btn-${font.id}`}
          >
            {copiedCss ? <CheckCircle2 size={14} className="text-vibrant" /> : <Copy size={14} />}
            Copy CSS
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FontCard;
