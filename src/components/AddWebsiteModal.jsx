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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-white/10 w-96 shadow-2xl rounded-md bg-slate-900/80 text-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium mb-4">Add New Website</h3>
          <form onSubmit={handleSubmit}>
            {error && <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 px-4 py-3 rounded mb-4">{error}</div>}
            <div className="mb-4">
              <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-2">Website URL</label>
              <input
                type="url"
                id="url"
                className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-slate-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-300 ring-1 ring-white/10 rounded-md hover:bg-white/5">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <LoadingSpinner /> : 'Add Website'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


