import { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export const EmailModal = ({ isOpen, onClose, onEmailUpdated }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await onEmailUpdated?.(email);
      setEmail('');
    } catch (err) {
      console.error('Error updating email:', err);
      setError(err.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-white/10 w-96 shadow-2xl rounded-md bg-slate-900/80 text-white">
        <div className="mt-3">
          <div className="flex items-center mb-4">
            <i className="fas fa-envelope text-indigo-400 text-lg mr-3" />
            <h3 className="text-lg font-medium">Complete Your Profile</h3>
          </div>
          
          <p className="text-sm text-slate-300 mb-6">
            Please provide your email address to receive important notifications about your monitored websites.
          </p>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-slate-400 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="your@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                type="submit" 
                disabled={loading || !email.trim()}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner /> : 'Save Email'}
              </button>
            </div>
          </form>
          
          <p className="text-xs text-slate-400 mt-3 text-center">
            This information helps us send you alerts when your websites go down.
          </p>
        </div>
      </div>
    </div>
  );
};