import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, CartesianGrid } from 'recharts';

export const ResponseTimeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-slate-700 font-bold uppercase tracking-widest text-xs italic">No telemetry data available.</div>;
  }

  const chartData = data.map(tick => ({
    ...tick,
    time: new Date(tick.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })).reverse(); 

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f09a" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#00f09a" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSec" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64748b" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.03)" />
          <XAxis 
            dataKey="time" 
            stroke="#334155" 
            fontSize={10} 
            tickLine={false}
            axisLine={false}
            tick={{ fontWeight: 700, letterSpacing: '1px' }}
          />
          <YAxis 
            stroke="#334155" 
            fontSize={10} 
            unit="ms" 
            tickLine={false}
            axisLine={false}
            tick={{ fontWeight: 700 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0b0b0d',
              borderColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
            itemStyle={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}
            labelStyle={{ color: '#00f09a', fontWeight: 900, marginBottom: '8px', fontSize: '10px' }}
          />

          <Area
            type="monotone"
            dataKey="total_response_time_ms"
            stroke="#00f09a"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorMain)"
            name="RESPONSE TIME"
          />
          <Area
            type="monotone"
            dataKey="connection_time_ms"
            stroke="#64748b"
            strokeWidth={1}
            strokeDasharray="5 5"
            fillOpacity={1}
            fill="url(#colorSec)"
            name="LATENCY"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
