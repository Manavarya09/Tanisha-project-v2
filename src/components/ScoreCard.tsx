import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: string;
  color: string;
}

export default function ScoreCard({ title, score, maxScore, percentage, level, color }: ScoreCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Exceptional': return 'text-green-600 bg-green-50';
      case 'Advanced': return 'text-blue-600 bg-blue-50';
      case 'Above Average': return 'text-indigo-600 bg-indigo-50';
      case 'Average': return 'text-yellow-600 bg-yellow-50';
      case 'Below Average': return 'text-orange-600 bg-orange-50';
      case 'Needs Improvement': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold" style={{ color }}>
              {score}
            </span>
            <span className="text-sm text-gray-500">
              / {maxScore}
            </span>
          </div>
          
          <Progress 
            value={percentage} 
            className="h-2"
            style={{ 
              '--progress-background': color,
            } as React.CSSProperties}
          />
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">
              {percentage}%
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(level)}`}>
              {level}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}