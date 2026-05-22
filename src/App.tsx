/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Plus, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SavedFont, SavedColor } from './types';
import FontCard from './components/FontCard';
import ColorCard from './components/ColorCard';
import AddFontModal from './components/AddFontModal';
import Toast from './components/Toast';
import { Typewriter } from './components/ui/typewriter';

import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import { isValidHex, getAestheticColorName } from './utils/colorUtils';

const STORAGE_KEY_FONTS = 'type-ish-fonts';
const STORAGE_KEY_COLORS = 'type-ish-colors';

export default function App() {
  // Saved fonts state
  const [fonts, setFonts] = useState<SavedFont[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_FONTS);
    return saved ? JSON.parse(saved) : [];
  });

  // Saved colors state
  const [colors, setColors] = useState<SavedColor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COLORS);
    if (saved) return JSON.parse(saved);
    // Add default nice colors if empty to give highly premium look initially
    return [
      { id: '1', hex: '#40c463', name: 'Emerald Peak', dateAdded: Date.now() - 3000 },
      { id: '2', hex: '#d4b069', name: 'Golden Sol', dateAdded: Date.now() - 2000 },
      { id: '3', hex: '#1e6c38', name: 'Deep Jungle', dateAdded: Date.now() - 1000 },
    ];
  });

  // Main navigation view mode
  const [viewMode, setViewMode] = useState<'fonts' | 'colors'>('fonts');
  const [fontFilter, setFontFilter] = useState<'all' | 'favorites'>('all');
  
  // Modals & States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingFontId, setDeletingFontId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Inline color adder states
  const [hexInput, setHexInput] = useState('');

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FONTS, JSON.stringify(fonts));
  }, [fonts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COLORS, JSON.stringify(colors));
  }, [colors]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Font actions
  const handleSaveFont = (name: string, url: string) => {
    if (fonts.some(f => f.url === url)) {
      showToast('Font already exists in vault', 'error');
      return;
    }

    const newFont: SavedFont = {
      id: crypto.randomUUID(),
      name,
      url,
      dateAdded: Date.now(),
      isFavorite: false,
    };

    setFonts([newFont, ...fonts]);
    showToast('Font saved successfully', 'success');
  };

  const handleToggleFavorite = (id: string) => {
    setFonts(prevFonts => 
      prevFonts.map(font => 
        font.id === id ? { ...font, isFavorite: !font.isFavorite } : font
      )
    );
  };

  const handleDeleteFont = () => {
    if (deletingFontId) {
      setFonts(fonts.filter(f => f.id !== deletingFontId));
      setDeletingFontId(null);
      showToast('Font deleted', 'success');
    }
  };

  // Color actions
  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedHex = hexInput.trim();
    if (!isValidHex(formattedHex)) {
      showToast('Please type a valid HEX code', 'error');
      return;
    }

    const prefixHex = formattedHex.startsWith('#') ? formattedHex : `#${formattedHex}`;
    
    if (colors.some(c => c.hex.toLowerCase() === prefixHex.toLowerCase())) {
      showToast('Color already exists in palette', 'error');
      return;
    }

    const calculatedName = getAestheticColorName(prefixHex);

    const newColor: SavedColor = {
      id: crypto.randomUUID(),
      hex: prefixHex,
      name: calculatedName,
      dateAdded: Date.now()
    };

    setColors([newColor, ...colors]);
    setHexInput('');
    showToast(`Added color "${calculatedName}"!`, 'success');
  };

  const handleDeleteColor = (id: string) => {
    setColors(colors.filter(c => c.id !== id));
    showToast('Color removed from palette', 'success');
  };

  const fontToDelete = fonts.find(f => f.id === deletingFontId);

  const filteredFonts = fonts.filter(font => {
    if (fontFilter === 'favorites') return !!font.isFavorite;
    return true;
  });

  const previewColorValid = isValidHex(hexInput);
  const livePreviewColor = hexInput.trim() ? (hexInput.trim().startsWith('#') ? hexInput.trim() : `#${hexInput.trim()}`) : '';

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary antialiased">
      {/* Apple-grade polished Header with zero extra nested shadow lines */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-bg-primary/80 border-b border-separator/20 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
          <div className="flex items-center group cursor-pointer select-none">
            <div className="text-lg sm:text-xl font-bold tracking-normal text-text-primary font-mono select-none">
              <Typewriter 
                text={["typeshii", "type", "typeshii"]} 
                speed={120} 
                waitTime={2500} 
                deleteSpeed={60}
                cursorChar="_"
                className="font-bold text-vibrant"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View switcher Segment control */}
            <div className="flex bg-black/40 border border-separator/35 rounded-full p-1 self-center">
              <button
                onClick={() => setViewMode('fonts')}
                className={`px-5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer select-none ${
                  viewMode === 'fonts'
                    ? 'bg-system-blue text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Fonts
              </button>
              <button
                onClick={() => setViewMode('colors')}
                className={`px-5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer select-none ${
                  viewMode === 'colors'
                    ? 'bg-system-blue text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Colors
              </button>
            </div>

            {viewMode === 'fonts' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 bg-system-blue text-white rounded-full hover:bg-system-blue-hover transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg shadow-system-blue/20 cursor-pointer"
                id="add-font-trigger"
                title="Add Font"
              >
                <Plus size={18} className="sm:size-[22px]" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content body with clean single-bound grid layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16">
        <AnimatePresence mode="wait">
          {viewMode === 'fonts' ? (
            <motion.div
              key="fonts-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {fonts.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 sm:py-28 text-center"
                  id="empty-state"
                >
                  <div className="w-14 h-14 sm:w-18 sm:h-18 bg-white/5 border border-separator/20 rounded-2xl flex items-center justify-center text-vibrant mb-6">
                    <LayoutGrid size={24} className="sm:size-[28px]" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-2">Create your typography space</h2>
                  <p className="text-text-secondary max-w-sm mx-auto leading-relaxed mb-6 sm:mb-8 text-xs sm:text-sm">
                    No Google Fonts saved yet. Import standard Google Font code blocks to keep them for easy retrieval.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 sm:px-8 py-3 bg-system-blue text-white rounded-button text-xs sm:text-sm font-bold hover:bg-system-blue-hover transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-system-blue/30 cursor-pointer"
                    id="empty-state-add-btn"
                  >
                    Add Your First Font
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Title & Filter switch */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between border-b border-separator/10 pb-4">
                    <h2 className="text-lg font-extrabold text-text-primary tracking-normal flex items-center gap-2">
                      Fonts Collection
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-vibrant/10 text-vibrant border border-vibrant/20">
                        {fonts.length}
                      </span>
                    </h2>
                    
                    <div className="flex items-center bg-black/40 border border-separator/30 rounded-full p-1 self-start sm:self-auto">
                      <button
                        onClick={() => setFontFilter('all')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                          fontFilter === 'all'
                            ? 'bg-system-blue text-white shadow-md'
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFontFilter('favorites')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                          fontFilter === 'favorites'
                            ? 'bg-earth text-black shadow-md'
                            : 'text-text-secondary hover:text-earth'
                        }`}
                      >
                        Bookmarked ({fonts.filter(f => f.isFavorite).length})
                      </button>
                    </div>
                  </div>
                  
                  {filteredFonts.length === 0 ? (
                    <div className="p-12 sm:p-16 border border-dashed border-separator/30 rounded-2xl flex flex-col items-center justify-center text-center text-text-secondary">
                      <p className="text-sm font-bold mb-1">No bookmarked fonts</p>
                      <p className="text-xs max-w-xs text-text-secondary/60">
                        Click the star icon next to the trash bin on any font to bookmark it here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5 sm:gap-6">
                      <AnimatePresence mode="popLayout">
                        {filteredFonts.map((font, index) => (
                          <FontCard
                            key={font.id}
                            font={font}
                            index={index}
                            onDelete={(id) => setDeletingFontId(id)}
                            onShowToast={showToast}
                            onToggleFavorite={handleToggleFavorite}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            // Colors module
            <motion.div
              key="colors-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Quick Input interactive adder at top, with Zero Double-borders */}
              <div className="glass rounded-2xl p-5 sm:p-6 border border-separator/30">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
                  Save New Color Swatch
                </h3>
                <form onSubmit={handleAddColor} className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
                  <div className="flex-1 space-y-2">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest">Hex Code:</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-text-secondary font-mono text-sm">#</div>
                      <input
                        type="text"
                        value={hexInput}
                        onChange={(e) => setHexInput(e.target.value)}
                        placeholder="FF453A"
                        className="w-full pl-8 pr-12 py-3 bg-black/45 hover:bg-black/60 focus:bg-black/80 border border-separator/45 rounded-xl text-sm font-mono text-text-primary focus:outline-none focus:border-vibrant transition-all focus:ring-4 focus:ring-vibrant/5"
                        maxLength={7}
                        id="color-hex-input"
                      />
                      {/* Live visual dot color preview directly inside input wrapper */}
                      <div 
                        className="absolute right-3.5 w-5 h-5 rounded-full border border-white/20 shadow-sm transition-transform duration-300 scale-100"
                        style={{ backgroundColor: previewColorValid ? livePreviewColor : '#111' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="md:w-36 py-3 px-6 bg-system-blue text-white rounded-button text-xs font-bold hover:bg-system-blue-hover transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer md:mt-0"
                  >
                    <Plus size={14} /> Save Swatch
                  </button>
                </form>
              </div>

              {/* Color List Swatch layout */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-separator/10 pb-4">
                  <h2 className="text-lg font-extrabold text-text-primary tracking-normal flex items-center gap-2">
                    Color Palettes
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-vibrant/10 text-vibrant border border-vibrant/20">
                      {colors.length}
                    </span>
                  </h2>
                </div>

                {colors.length === 0 ? (
                  <div className="p-12 border border-dashed border-separator/30 rounded-2xl flex flex-col items-center justify-center text-center text-text-secondary">
                    <p className="text-sm font-bold mb-1">Your palette vault is empty</p>
                    <p className="text-xs max-w-xs text-text-secondary/60">
                      Type dynamic Hex values in the box above to build and save customized developer color blocks!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                    <AnimatePresence mode="popLayout">
                      {colors.map((color) => (
                        <ColorCard
                          key={color.id}
                          color={color}
                          onDelete={handleDeleteColor}
                          onShowToast={showToast}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AddFontModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFont}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingFontId}
        fontName={fontToDelete?.name || ''}
        onClose={() => setDeletingFontId(null)}
        onConfirm={handleDeleteFont}
      />

      <Toast
        message={toast?.message || null}
        type={toast?.type || 'success'}
        onClose={() => setToast(null)}
      />

      {/* Naturally-Scrolled Dynamic Footer with single thin bounds */}
      <footer className="w-full py-8 sm:py-10 border-t border-separator/20 bg-black/40 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-4">
          <div className="bg-white/5 px-4 py-2 rounded-full flex items-center gap-2 border border-separator/15">
            <p className="text-[10px] font-bold text-text-secondary tracking-wide uppercase">
              <span className="text-text-primary px-1">EXXCONTRA</span> SYSTEM WORKSPACE
            </p>
          </div>
          <p className="text-[9px] font-medium text-text-secondary/40 tracking-widest text-center uppercase">
            Copyright © 2026 TYPESHII VAULT. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
