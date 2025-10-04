import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarChartProps {
  data: Array<{
    pillar: string;
    score: number;
    fullMark: number;
  }>;
}

export default function RadarChart({ data }: RadarChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="pillar" 
            tick={{ fontSize: 12, fill: '#374151' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fontSize: 10, fill: '#6B7280' }}
          />
          <Radar
            name="AI Readiness Score"
            dataKey="score"
            stroke="#2563EB"
            fill="#2563EB"
            fillOpacity={0.1}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}