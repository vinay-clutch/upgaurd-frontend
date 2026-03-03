import { useState } from 'react';
import { api } from '../services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'react-hot-toast';

export const AddWebsiteModal = ({ isOpen, onClose, onAdd }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.createWebsite(url);
      toast.success('Website added for monitoring');
      onAdd?.();
      setUrl('');
      onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md p-8 border border-white/10 shadow-2xl rounded-3xl bg-[#0a0a0d] text-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium mb-4">Add New Website</h3>
          <form onSubmit={handleSubmit}>
            {error && <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 px-4 py-3 rounded mb-4">{error}</div>}
            <div className="mb-4">
              <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-2">Website URL</label>
              <input
                type="url"
                id="url"
                className="w-full px-3 py-3 border border-white/10 bg-white/5 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-[#00f09a] focus:border-[#00f09a] transition-all"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button 
                type="submit" 
                disabled={loading} 
                className="px-6 py-2 text-sm font-bold text-[#050505] bg-[#00f09a] rounded-xl hover:bg-[#00cc82] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#00f09a]/10"
              >
                {loading ? <LoadingSpinner /> : 'Add Website'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


