import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, CartesianGrid } from 'recharts';

export const ResponseTimeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-slate-400">No data available for chart.</div>;
  }


  const chartData = data.map(tick => ({
    ...tick,
    time: new Date(tick.timestamp).toLocaleTimeString(),
  })).reverse(); 

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorConnection" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bc2c12" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#bc2c12" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTls" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorData" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis 
            dataKey="time" 
            stroke="#475569" 
            fontSize={10} 
            tickLine={false}
            axisLine={false}
            tick={{ fontWeight: 800, letterSpacing: '1px' }}
          />
          <YAxis 
            stroke="#475569" 
            fontSize={10} 
            unit="ms" 
            tickLine={false}
            axisLine={false}
            tick={{ fontWeight: 800 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0c0c0e',
              borderColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              padding: '12px'
            }}
            itemStyle={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}
            labelStyle={{ color: '#bc2c12', fontWeight: 900, marginBottom: '8px', fontSize: '10px' }}
          />

          <Area
            type="monotone"
            dataKey="connection_time_ms"
            stackId="1"
            stroke="#bc2c12"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorConnection)"
            name="NET CONNECT"
          />
          <Area
            type="monotone"
            dataKey="tls_handshake_time_ms"
            stackId="1"
            stroke="#ea580c"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTls)"
            name="TLS SECURE"
          />
           <Area
            type="monotone"
            dataKey="data_transfer_time_ms"
            stackId="1"
            stroke="#f97316"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorData)"
            name="TRANSFER"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
