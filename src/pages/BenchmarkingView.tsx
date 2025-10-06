import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowLeft, TrendingUp, Award, Target } from 'lucide-react';
import { AssessmentData, AssessmentResults, calculateAssessmentResults, industryBenchmarks } from '../utils/assessmentLogic';
import AnimatedContent from '../components/AnimatedContent';

export default function BenchmarkingView() {
  const navigate = useNavigate();
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('assessmentData');
    if (!savedData) {
      navigate('/assessment');
      return;
    }

    const data: AssessmentData = JSON.parse(savedData);
    const calculatedResults = calculateAssessmentResults(data);
    
    setAssessmentData(data);
    setResults(calculatedResults);
  }, [navigate]);

  if (!results || !assessmentData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading benchmark data...</p>
        </div>
      </div>
    );
  }

  const industryData = industryBenchmarks[assessmentData.industry as keyof typeof industryBenchmarks] || industryBenchmarks.Other;
  
  const benchmarkData = [
    {
      category: 'Your Score',
      score: results.overallPercentage,
      color: '#2563EB'
    },
    {
      category: 'Industry Average',
      score: industryData.average,
      color: '#6B7280'
    },
    {
      category: 'Top 25%',
      score: industryData.top25,
      color: '#10B981'
    },
    {
      category: 'Top 10%',
      score: industryData.top10,
      color: '#F59E0B'
    }
  ];

  const pillarBenchmarkData = results.pillarScores.map(pillar => ({
    name: pillar.name,
    yourScore: pillar.percentage,
    industryAvg: industryData.average - 5 + Math.random() * 10, // Simulate pillar-specific averages
    top25: industryData.top25 - 3 + Math.random() * 6
  }));

  const getPercentileMessage = (percentile: number) => {
    if (percentile >= 90) return "Exceptional performance - you're in the top 10%";
    if (percentile >= 75) return "Strong performance - you're in the top 25%";
    if (percentile >= 50) return "Above average performance";
    if (percentile >= 25) return "Below average - room for improvement";
    return "Significant improvement needed";
  };

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (percentile >= 75) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (percentile >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (percentile >= 25) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/results')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Results
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">Industry Benchmarking</span>
              </div>
            </div>
            <Button onClick={() => navigate('/recommendations')}>
              Get Recommendations
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Industry Benchmarking Analysis
          </h1>
          <p className="text-lg text-gray-600">
            See how {assessmentData.companyName} compares to other {assessmentData.industry.toLowerCase()} companies
          </p>
        </div>

        {/* Percentile Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-6 w-6 text-blue-600" />
              <span>Your Industry Ranking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="mb-4">
                <span className="text-5xl font-bold text-blue-600">
                  {Math.round(results.industryPercentile)}
                </span>
                <span className="text-xl text-gray-500 ml-1">th percentile</span>
              </div>
              <Badge className={`text-lg px-4 py-2 ${getPercentileColor(results.industryPercentile)}`}>
                {getPercentileMessage(results.industryPercentile)}
              </Badge>
              <p className="text-gray-600 mt-4">
                You scored higher than {Math.round(results.industryPercentile)}% of companies in the {assessmentData.industry} industry
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Overall Benchmark Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Score Comparison</CardTitle>
            <CardDescription>
              How your overall AI readiness score compares to industry benchmarks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                  <Bar 
                    dataKey="score" 
                    fill={(entry) => entry.color}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pillar-by-Pillar Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pillar-by-Pillar Comparison</CardTitle>
            <CardDescription>
              Detailed comparison of your performance in each readiness pillar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pillarBenchmarkData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="yourScore" 
                    stroke="#2563EB" 
                    strokeWidth={3}
                    name="Your Score"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="industryAvg" 
                    stroke="#6B7280" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Industry Average"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="top25" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    name="Top 25%"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Insights and Analysis */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Strengths</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.pillarScores
                  .filter(pillar => pillar.percentage >= industryData.average)
                  .map((pillar, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-green-800">{pillar.name}</span>
                      <Badge className="bg-green-100 text-green-800">
                        +{Math.round(pillar.percentage - industryData.average)}% vs avg
                      </Badge>
                    </div>
                  ))}
                {results.pillarScores.filter(pillar => pillar.percentage >= industryData.average).length === 0 && (
                  <p className="text-gray-500 italic">Focus on improving all pillars to exceed industry average</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span>Improvement Opportunities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.pillarScores
                  .filter(pillar => pillar.percentage < industryData.average)
                  .map((pillar, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium text-orange-800">{pillar.name}</span>
                      <Badge className="bg-orange-100 text-orange-800">
                        {Math.round(pillar.percentage - industryData.average)}% vs avg
                      </Badge>
                    </div>
                  ))}
                {results.pillarScores.filter(pillar => pillar.percentage < industryData.average).length === 0 && (
                  <p className="text-gray-500 italic">All pillars are performing above industry average!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Industry Context */}
        <Card>
          <CardHeader>
            <CardTitle>Industry Context</CardTitle>
            <CardDescription>
              Understanding AI adoption in the {assessmentData.industry} sector
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {industryData.average}%
                </div>
                <div className="text-sm text-gray-600">Industry Average</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {industryData.top25}%
                </div>
                <div className="text-sm text-gray-600">Top 25% Threshold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {industryData.top10}%
                </div>
                <div className="text-sm text-gray-600">Top 10% Threshold</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Industry Insight:</strong> The {assessmentData.industry} sector shows varying levels of AI readiness. 
                Companies that score above {industryData.top25}% are typically well-positioned for successful AI implementation, 
                while those below {industryData.average}% should focus on foundational improvements before pursuing advanced AI initiatives.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}