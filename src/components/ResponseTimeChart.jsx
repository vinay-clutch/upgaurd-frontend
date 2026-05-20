import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, CartesianGrid } from 'recharts';

export const ResponseTimeChart = ({ data }) => {
  // Bulletproof check: Data must exist, be an array, have length, AND actually have valid properties
  const hasValidData = data && Array.isArray(data) && data.length > 0 && data.some(item => item && Object.keys(item).length > 0);

  if (!hasValidData) {
    return (
      <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontStyle: 'italic', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem' }}>
        Waiting for monitoring data...
      </div>
    );
  }

  const chartData = data
    .filter(tick => tick && tick.timestamp)
    .map((tick, index) => {
      const conn = Number(tick.connection_time_ms);
      const tls = Number(tick.tls_handshake_time_ms);
      const dataX = Number(tick.data_transfer_time_ms);
      
      return {
        ...tick,
        connection_time_ms: isFinite(conn) ? conn : 0,
        tls_handshake_time_ms: isFinite(tls) ? tls : 0,
        data_transfer_time_ms: isFinite(dataX) ? dataX : 0,
        time: new Date(tick.timestamp).toLocaleTimeString(),
        // Add a unique key combining timestamp and index to prevent XAxis collisions
        uniqueKey: `${tick.timestamp}-${index}`
      };
    })
    .reverse(); 

  // Recharts stacking logic can crash with only 1 data point in some versions
  if (chartData.length < 2) {
    return (
      <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontStyle: 'italic' }}>
        Collecting baseline samples (need 2+ ticks)...
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorConnection" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f09a" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00f09a" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTls" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorData" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="uniqueKey" 
            tickFormatter={(val) => val.split('-')[0].split(' ').pop()} // Show only time part of key if needed, or just use "time"
            stroke="#94a3b8" 
            fontSize={10} 
            tick={({ x, y, payload }) => {
              // Custom tick to show the time string we formatted
              const item = chartData.find(d => d.uniqueKey === payload.value);
              return (
                <text x={x} y={y + 12} fill="#64748b" fontSize={10} textAnchor="middle">
                  {item?.time}
                </text>
              );
            }}
          />
          <YAxis stroke="#94a3b8" fontSize={12} unit="ms" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem'
            }}
            labelStyle={{ color: '#cbd5e1' }}
            labelFormatter={(value) => {
              const item = chartData.find(d => d.uniqueKey === value);
              return item?.time || value;
            }}
          />

          <Area
            type="monotone"
            dataKey="connection_time_ms"
            stackId="responseTime"
            stroke="#00f09a"
            fillOpacity={1}
            fill="url(#colorConnection)"
            name="Connection"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="tls_handshake_time_ms"
            stackId="responseTime"
            stroke="#06b6d4"
            fillOpacity={1}
            fill="url(#colorTls)"
            name="TLS Handshake"
            isAnimationActive={false}
          />
           <Area
            type="monotone"
            dataKey="data_transfer_time_ms"
            stackId="responseTime"
            stroke="#22d3ee"
            fillOpacity={1}
            fill="url(#colorData)"
            name="Data Transfer"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
