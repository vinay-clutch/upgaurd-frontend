export const StatusBadge = ({ status }) => {
  const normalized = (status || '').toString().toLowerCase();
  const config =
    normalized === 'up'
      ? { color: 'text-[#bc2c12]', bg: 'bg-[#bc2c12]/10 ring-1 ring-[#bc2c12]/20', text: 'STABLE', icon: 'fa-check-double' }
      : normalized === 'down'
      ? { color: 'text-rose-500', bg: 'bg-rose-500/10 ring-1 ring-rose-500/30', text: 'CRITICAL', icon: 'fa-exclamation-triangle' }
      : { color: 'text-slate-500', bg: 'bg-white/5 ring-1 ring-white/5', text: 'INITIALIZING', icon: 'fa-circle-notch fa-spin' };

  return (
    <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.bg} ${config.color} shadow-lg shadow-black/50`}>
      <i className={`fas ${config.icon} mr-2`} />
      {config.text}
    </span>
  );
};
