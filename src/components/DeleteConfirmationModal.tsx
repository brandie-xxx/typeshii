/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  fontName: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({ isOpen, fontName, onClose, onConfirm }: DeleteConfirmationModalProps) {
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
            className="fixed left-4 right-4 sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 top-auto bottom-4 sm:bottom-auto w-auto sm:max-w-sm glass rounded-modal shadow-prominent z-50 overflow-hidden border border-separator/45"
            id="delete-confirmation-modal"
          >
            <div className="flex justify-between items-center p-5 sm:p-6 border-b border-separator/35">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">Delete Font?</h2>
              <button 
                onClick={onClose}
                className="text-text-secondary hover:text-error transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
                id="close-delete-modal-btn"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 sm:p-8 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-error/10 border border-error/20 text-error rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
                <AlertCircle size={28} className="sm:size-[32px]" />
              </div>
              <p className="text-text-primary mb-2 text-base sm:text-lg">
                Are you sure you want to delete <span className="font-bold">"{fontName}"</span>?
              </p>
              <p className="text-text-secondary text-xs sm:text-sm">
                This action cannot be undone.
              </p>
            </div>

            <div className="p-5 sm:p-6 border-t border-separator/25 bg-bg-primary/20 flex justify-center items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 sm:py-3 rounded-button font-bold text-xs sm:text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all cursor-pointer"
                id="cancel-delete-btn"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 sm:py-3 rounded-button font-bold text-xs sm:text-sm bg-error text-white hover:bg-[#D7332D] transition-all active:scale-95 shadow-md hover:shadow-lg shadow-error/20 cursor-pointer"
                id="confirm-delete-btn"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
