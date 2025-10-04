import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Clock, AlertCircle, CheckCircle, Target } from 'lucide-react';
import { AssessmentData, AssessmentResults, calculateAssessmentResults, Recommendation } from '../utils/assessmentLogic';
import AnimatedContent from '../components/AnimatedContent';

export default function RecommendationsPage() {
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
          <p className="text-gray-600">Generating personalized recommendations...</p>
        </div>
      </div>
    );
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'Medium': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'Low': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const groupedRecommendations = results.recommendations.reduce((acc, rec) => {
    if (!acc[rec.pillar]) {
      acc[rec.pillar] = [];
    }
    acc[rec.pillar].push(rec);
    return acc;
  }, {} as Record<string, Recommendation[]>);

  const priorityOrder = ['High', 'Medium', 'Low'];
  const sortedRecommendations = results.recommendations.sort((a, b) => 
    priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">AI Readiness Recommendations</span>
              </div>
            </div>
            <Button onClick={() => navigate('/report')}>
              View Full Report
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Personalized AI Readiness Roadmap
          </h1>
          <p className="text-lg text-gray-600">
            Strategic recommendations to accelerate {assessmentData.companyName}'s AI transformation journey
          </p>
        </div>

        {/* Summary Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle>Recommendation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {results.recommendations.filter(r => r.priority === 'High').length}
                </div>
                <div className="text-sm text-gray-600">High Priority Actions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {results.recommendations.filter(r => r.priority === 'Medium').length}
                </div>
                <div className="text-sm text-gray-600">Medium Priority Actions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {results.recommendations.filter(r => r.priority === 'Low').length}
                </div>
                <div className="text-sm text-gray-600">Low Priority Actions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority-Based Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Priority Action Items</h2>
          <div className="space-y-4">
            {sortedRecommendations.map((recommendation, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getPriorityIcon(recommendation.priority)}
                      <div>
                        <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-1">
                          <span>Pillar: {recommendation.pillar}</span>
                          <span>•</span>
                          <span>Timeline: {recommendation.timeline}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(recommendation.priority)}>
                      {recommendation.priority} Priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{recommendation.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pillar-Based Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommendations by Pillar - All 7 AI Readiness Pillars</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {Object.entries(groupedRecommendations).map(([pillar, recommendations]) => (
              <Card key={pillar}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span>{pillar}</span>
                  </CardTitle>
                  <CardDescription>
                    {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''} for improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{rec.title}</h4>
                          <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{rec.timeline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Implementation Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Suggested Implementation Timeline</CardTitle>
            <CardDescription>
              A phased approach to implementing your AI readiness improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Phase 1: Immediate Actions (0-3 months)</h3>
                <ul className="space-y-1">
                  {results.recommendations
                    .filter(r => r.priority === 'High')
                    .map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700">• {rec.title}</li>
                    ))}
                </ul>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="text-lg font-semibold text-yellow-700 mb-2">Phase 2: Foundation Building (3-9 months)</h3>
                <ul className="space-y-1">
                  {results.recommendations
                    .filter(r => r.priority === 'Medium')
                    .map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700">• {rec.title}</li>
                    ))}
                </ul>
              </div>
              
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-green-700 mb-2">Phase 3: Optimization (9+ months)</h3>
                <ul className="space-y-1">
                  {results.recommendations
                    .filter(r => r.priority === 'Low')
                    .map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700">• {rec.title}</li>
                    ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Ready to Get Started?</CardTitle>
            <CardDescription>
              Take the next step in your AI transformation journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/report')}
              >
                <div className="text-center">
                  <div className="font-medium">Download Full Report</div>
                  <div className="text-sm opacity-90">Get detailed analysis and action plans</div>
                </div>
              </Button>
              
              <Button 
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/benchmarking')}
              >
                <div className="text-center">
                  <div className="font-medium">View Benchmarking</div>
                  <div className="text-sm text-gray-500">Compare with industry peers</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}