import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Toast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      setMessage(e.detail);
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    };
    window.addEventListener('show-toast', handler);
    return () => window.removeEventListener('show-toast', handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          style={{
            position: 'fixed',
            bottom: 80, // Above bottom tab
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 99,
            fontSize: 14,
            fontWeight: 600,
            zIndex: 9999,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const showToast = (msg: string) => {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: msg }));
};
