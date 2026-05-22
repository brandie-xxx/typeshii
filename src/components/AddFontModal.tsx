/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { extractFontName } from '../utils/fontUtils';
import { useLoadFont } from '../hooks/useLoadFont';

interface AddFontModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, url: string) => void;
}

export default function AddFontModal({ isOpen, onClose, onSave }: AddFontModalProps) {
  const [input, setInput] = useState('');
  const [detectedName, setDetectedName] = useState<string | null>(null);
  const [actualUrl, setActualUrl] = useState<string>('');

  useEffect(() => {
    if (input.trim()) {
      const name = extractFontName(input);
      setDetectedName(name);
      
      // Extract the relevant CSS URL for preview
      const urls = Array.from(input.matchAll(/href="([^"]+)"/g)).map(m => m[1]);
      const fontUrl = urls.find(u => u.includes('fonts.googleapis.com/css2')) || urls[0] || input;
      setActualUrl(fontUrl);
    } else {
      setDetectedName(null);
      setActualUrl('');
    }
  }, [input]);

  // Load font for preview in modal using custom hook
  useLoadFont(actualUrl);

  const handleSave = () => {
    if (detectedName && actualUrl) {
      onSave(detectedName, actualUrl);
      setInput('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed left-4 right-4 sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 top-auto bottom-4 sm:bottom-auto w-auto sm:max-w-md glass rounded-modal shadow-prominent z-50 overflow-hidden border border-separator/45"
            id="add-font-modal"
          >
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-separator/35">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">Add Font</h2>
              <button 
                onClick={onClose}
                className="text-text-secondary hover:text-vibrant transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
                id="close-modal-btn"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                  Paste Google Fonts link block:
                </label>
                <textarea
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={'<link rel="preconnect" href="...">\n<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">'}
                  className="w-full h-28 sm:h-32 p-3 sm:p-4 text-xs sm:text-sm bg-bg-primary/90 border border-separator rounded-input text-text-primary focus:outline-none focus:border-vibrant focus:ring-4 focus:ring-vibrant/10 transition-all resize-none font-mono"
                  id="font-link-input"
                />
              </div>

              <div className="space-y-4">
                {detectedName && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-vibrant text-xs sm:text-sm font-bold bg-vibrant/10 px-3 py-2 rounded-xl border border-vibrant/20"
                  >
                    <Check size={16} />
                    <span>Font detected: {detectedName}</span>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <span className="text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider">Preview:</span>
                  <div className="p-6 sm:p-8 bg-bg-primary/40 border border-separator/30 rounded-input min-h-[100px] sm:min-h-[120px] flex items-center justify-center text-center">
                    {detectedName ? (
                      <div className="space-y-2">
                        <div 
                          className="text-xl sm:text-2xl text-text-primary leading-tight font-medium"
                          style={{ fontFamily: `'${detectedName}', sans-serif` }}
                        >
                          The quick brown fox
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-vibrant font-bold font-mono bg-vibrant/10 px-2 py-0.5 rounded-md uppercase tracking-widest inline-block border border-vibrant/20">{detectedName}</div>
                      </div>
                    ) : (
                      <span className="text-text-secondary italic text-xs">Paste a Google Font link block above</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 border-t border-separator/20 bg-bg-primary/20 flex justify-end items-center gap-3">
              <button
                onClick={onClose}
                className="text-xs sm:text-sm font-bold text-text-secondary hover:text-text-primary transition-colors hover:bg-white/5 py-2 px-4 rounded-full cursor-pointer"
                id="cancel-save-btn"
              >
                Cancel
              </button>
              <button
                disabled={!detectedName}
                onClick={handleSave}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-button font-bold text-xs sm:text-sm bg-system-blue text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-system-blue-hover transition-all active:scale-95 shadow-md hover:shadow-lg hover:shadow-system-blue/20 cursor-pointer"
                id="confirm-save-btn"
              >
                Save Font
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
