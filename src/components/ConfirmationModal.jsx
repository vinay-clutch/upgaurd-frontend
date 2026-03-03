import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Pause, Play, Trash2, X } from 'lucide-react';

export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'info', // 'info', 'warning', 'danger'
  loading = false 
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger': return <Trash2 className="w-6 h-6 text-rose-500" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'pause': return <Pause className="w-6 h-6 text-amber-500" />;
      case 'resume': return <Play className="w-6 h-6 text-[#00f09a]" />;
      default: return <AlertTriangle className="w-6 h-6 text-[#00f09a]" />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger': return 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20';
      case 'warning':
      case 'pause': return 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/20';
      case 'resume': return 'bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] shadow-[#00f09a]/20';
      default: return 'bg-[#00f09a] hover:bg-[#00cc82] text-[#050505] shadow-[#00f09a]/20';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10`}>
                  {getIcon()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {message}
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 ${getButtonClass()}`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : confirmText}
                </button>
              </div>
            </div>

            {/* Subtle glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#00f09a] to-transparent opacity-30" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
