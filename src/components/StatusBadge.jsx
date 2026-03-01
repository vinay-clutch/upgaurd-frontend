export const StatusBadge = ({ status }) => {
  const normalized = (status || '').toString().toLowerCase();
  const config =
    normalized === 'up'
      ? { color: 'text-emerald-300', bg: 'bg-emerald-500/10 ring-1 ring-emerald-400/30', text: 'UP', icon: 'fa-check-circle' }
      : normalized === 'down'
      ? { color: 'text-rose-300', bg: 'bg-rose-500/10 ring-1 ring-rose-400/30', text: 'DOWN', icon: 'fa-times-circle' }
      : { color: 'text-slate-300', bg: 'bg-slate-500/10 ring-1 ring-white/10', text: 'UNKNOWN', icon: 'fa-question-circle' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      <i className={`fas ${config.icon} mr-1`} />
      {config.text}
    </span>
  );
};


