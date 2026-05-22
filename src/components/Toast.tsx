/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div 
            className={`flex items-center gap-3 px-6 py-3.5 rounded-full shadow-prominent glass ${
              type === 'success' 
                ? 'text-success' 
                : 'text-error'
            }`}
            id="toast-notification"
          >
            {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-semibold text-text-primary capitalize">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
