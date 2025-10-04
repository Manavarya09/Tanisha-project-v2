import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, TrendingUp, Users, Download } from 'lucide-react';
import ScoreCard from '../components/ScoreCard';
import RadarChart from '../components/RadarChart';
import { AssessmentData, AssessmentResults, calculateAssessmentResults } from '../utils/assessmentLogic';
import AnimatedContent from '../components/AnimatedContent';

export default function ResultsDashboard() {
  const navigate = useNavigate();
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('assessmentData');
    if (!savedData) {
      navigate('/assessment');
      return;
    }

    try {
      const data: AssessmentData = JSON.parse(savedData);
      console.log('Loaded assessment data:', data);
      
      const calculatedResults = calculateAssessmentResults(data);
      console.log('Calculated results:', calculatedResults);

      if (!calculatedResults.pillarScores || !Array.isArray(calculatedResults.pillarScores)) {
        console.error('Invalid pillar scores data:', calculatedResults.pillarScores);
        console.error('Type of pillarScores:', typeof calculatedResults.pillarScores);
        navigate('/assessment');
        return;
      }
      
      setAssessmentData(data);
      setResults(calculatedResults);
    } catch (error) {
      console.error('Error processing assessment data:', error);
      navigate('/assessment');
    }
  }, [navigate]);

  if (!results || !assessmentData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating your AI readiness score...</p>
        </div>
      </div>
    );
  }

  // Safety check to ensure pillarScores is an array
  if (!Array.isArray(results.pillarScores)) {
    console.error('pillarScores is not an array:', results.pillarScores);
    console.error('Full results object:', results);
    navigate('/assessment');
    return null;
  }

  // Additional safety check for empty array
  if (results.pillarScores.length === 0) {
    console.error('pillarScores array is empty');
    navigate('/assessment');
    return null;
  }

  const radarData = results.pillarScores.map(pillar => ({
    pillar: pillar.name,
    score: pillar.percentage,
    fullMark: 100
  }));

  const barData = results.pillarScores.map(pillar => ({
    name: pillar.name,
    score: pillar.percentage,
    color: pillar.color
  }));

  const getOverallLevelColor = (level: string) => {
    switch (level) {
      case 'Exceptional': return 'bg-green-100 text-green-800 border-green-200';
      case 'Advanced': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Above Average': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Average': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Below Average': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Needs Improvement': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get assessment type from assessmentData
  const assessmentType = assessmentData?.assessmentType === 'paid' ? 'Paid Assessment' : 'Free Assessment';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">AI Readiness Dashboard</span>
              <span className="ml-4 px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">{assessmentType}</span>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => navigate('/benchmarking')}>
                <TrendingUp className="h-4 w-4 mr-2" />
                View Benchmarks
              </Button>
              <Button variant="outline" onClick={() => navigate('/recommendations')}>
                <Users className="h-4 w-4 mr-2" />
                Get Recommendations
              </Button>
              <Button onClick={() => navigate(`/report?type=${assessmentData?.assessmentType || 'free'}`)}>
                <FileText className="h-4 w-4 mr-2" />
                Detailed Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {assessmentData.companyName} - AI Readiness Assessment
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Industry: {assessmentData.industry}</span>
            <span>•</span>
            <span>Company Size: {assessmentData.companySize}</span>
            <span>•</span>
            <span>Assessment Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Overall AI Readiness Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <span className="text-6xl font-bold text-blue-600">
                {results.overallPercentage}
              </span>
              <span className="text-2xl text-gray-500 ml-2">%</span>
            </div>
            <Badge className={`text-lg px-4 py-2 ${getOverallLevelColor(results.overallLevel)}`}>
              {results.overallLevel}
            </Badge>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Your organization scores in the {results.industryPercentile}th percentile compared to other {assessmentData.industry.toLowerCase()} companies.
            </p>
          </CardContent>
        </Card>

        {/* Pillar Scores */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pillar Breakdown - All 7 Pillars</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.pillarScores.map((pillar, index) => (
              <ScoreCard
                key={index}
                title={pillar.name}
                score={pillar.score}
                maxScore={pillar.maxScore}
                percentage={pillar.percentage}
                level={pillar.level}
                color={pillar.color}
              />
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>AI Readiness Profile</CardTitle>
              <CardDescription>
                Visual representation of your readiness across all four pillars
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadarChart data={radarData} />
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Pillar Comparison</CardTitle>
              <CardDescription>
                Compare your performance across different readiness areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Score']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Bar 
                      dataKey="score" 
                      fill="#2563EB"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Explore your results in more detail and get actionable recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/benchmarking')}
              >
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Industry Benchmarking</div>
                  <div className="text-sm text-gray-500">Compare with peers</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/recommendations')}
              >
                <Users className="h-8 w-8 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Get Recommendations</div>
                  <div className="text-sm text-gray-500">Actionable next steps</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate(`/report?type=${assessmentData?.assessmentType || 'free'}`)}
              >
                <Download className="h-8 w-8 text-purple-600" />
                <div className="text-center">
                  <div className="font-medium">Download Report</div>
                  <div className="text-sm text-gray-500">Comprehensive analysis</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}