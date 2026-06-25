import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface FiveDData {
  fundamental: number;
  technical: number;
  capital: number;
  news: number;
  sentiment: number;
}

interface FiveDRadarProps {
  data: FiveDData;
  size?: number;
  showLabels?: boolean;
}

export default function FiveDRadar({ data, size = 320, showLabels = true }: FiveDRadarProps) {
  const radarData = [
    { subject: '基本面', score: data.fundamental, fullMark: 100 },
    { subject: '技术面', score: data.technical, fullMark: 100 },
    { subject: '资金面', score: data.capital, fullMark: 100 },
    { subject: '消息面', score: data.news, fullMark: 100 },
    { subject: '舆情面', score: data.sentiment, fullMark: 100 },
  ];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { subject: string; score: number } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#131821] border border-[#1E293B] rounded-lg px-3 py-2 text-sm">
          <span className="text-[#94A3B8]">{item.subject}：</span>
          <span className="text-[#06B6D4] font-bold">{item.score}分</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
          <PolarGrid
            stroke="#1E293B"
            strokeWidth={1}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={showLabels ? { fill: '#94A3B8', fontSize: 13, fontWeight: 500 } : false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="评分"
            dataKey="score"
            stroke="#06B6D4"
            strokeWidth={2}
            fill="#06B6D4"
            fillOpacity={0.25}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
