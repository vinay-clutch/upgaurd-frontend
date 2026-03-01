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
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorConnection" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTls" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorData" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} unit="ms" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem'
            }}
            labelStyle={{ color: '#cbd5e1' }}
          />

          <Area
            type="monotone"
            dataKey="connection_time_ms"
            stackId="1"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorConnection)"
            name="Connection"
          />
          <Area
            type="monotone"
            dataKey="tls_handshake_time_ms"
            stackId="1"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorTls)"
            name="TLS Handshake"
          />
           <Area
            type="monotone"
            dataKey="data_transfer_time_ms"
            stackId="1"
            stroke="#ffc658"
            fillOpacity={1}
            fill="url(#colorData)"
            name="Data Transfer"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};