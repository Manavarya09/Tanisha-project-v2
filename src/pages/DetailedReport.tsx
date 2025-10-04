import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Download, FileText, BarChart3, TrendingUp, Target } from 'lucide-react';
import { AssessmentData, AssessmentResults, calculateAssessmentResults } from '../utils/assessmentLogic';
import AnimatedContent from '../components/AnimatedContent';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function DetailedReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('assessmentData');
    
    // Get assessment type from query param (default to 'free')
    const searchParams = new URLSearchParams(location.search);
    const typeFromUrl = searchParams.get('type') || 'free';
    
    if (!savedData) {
      // If no saved data but coming from a direct link, create mock data
      const mockData: AssessmentData = {
        companyName: 'Sample Company',
        industry: 'Technology',
        companySize: '51-200',
        region: 'Global',
        responses: {}
      };
      
      // Add type from URL
      const dataWithType = { ...mockData, assessmentType: typeFromUrl };
      
      // Generate results from mock data
      const calculatedResults = calculateAssessmentResults(dataWithType);
      
      setAssessmentData(dataWithType);
      setResults(calculatedResults);
      return;
    }

    // If we have saved data, use it
    const data: AssessmentData & { assessmentType?: string } = JSON.parse(savedData);
    const calculatedResults = calculateAssessmentResults(data);
    
    setAssessmentData(data);
    setResults(calculatedResults);
  }, [navigate, location.search]);

  if (!results || !assessmentData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating detailed report...</p>
        </div>
      </div>
    );
  }

  const handleExportReport = async () => {
    if (!results || !assessmentData) {
      return;
    }

    try {
      // Get the report content element
      const reportElement = document.getElementById('pdf-report-content');
      if (!reportElement) {
        alert('Report content not found. Please try again.');
        return;
      }

      // Show loading state on button
      const button = document.getElementById('export-pdf-button') as HTMLButtonElement;
      if (button) {
        const originalContent = button.innerHTML;
        button.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span> Generating PDF...';
        button.disabled = true;

        try {
          // Wait a moment for UI to update
          await new Promise(resolve => setTimeout(resolve, 100));

          // Configure html2canvas for better quality
          const canvas = await html2canvas(reportElement, {
            useCORS: true,
            logging: false,
            background: '#f8fafc',
            width: reportElement.scrollWidth,
            height: reportElement.scrollHeight
          });

          // Create PDF
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
          });

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          
          // Calculate scaling to fit width
          const ratio = pdfWidth / canvasWidth;
          const scaledHeight = canvasHeight * ratio;

          // Add pages as needed
          let heightLeft = scaledHeight;
          let position = 0;
          const pageHeight = pdfHeight;

          // First page
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight, undefined, 'FAST');
          heightLeft -= pageHeight;

          // Add additional pages if content is longer than one page
          while (heightLeft > 0) {
            position = heightLeft - scaledHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight, undefined, 'FAST');
            heightLeft -= pageHeight;
          }

          // Generate filename with company name and date
          const companyName = assessmentData.companyName.replace(/[^a-zA-Z0-9]/g, '_');
          const date = new Date().toISOString().split('T')[0];
          const fileName = `AI_Readiness_Report_${companyName}_${date}.pdf`;
          
          // Save the PDF
          pdf.save(fileName);

          // Restore button
          button.innerHTML = originalContent;
          button.disabled = false;
        } catch (pdfError) {
          console.error('PDF generation error:', pdfError);
          button.innerHTML = originalContent;
          button.disabled = false;
          throw pdfError;
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again or check your browser console for details.');
    }
  };

  const getInsightForPillar = (pillar: string, percentage: number) => {
    const insights = {
      'Strategy & Leadership': {
        high: 'Your organization demonstrates strong strategic alignment with clear AI vision linked to corporate objectives. Executive sponsorship is robust and the board is well-informed about AI opportunities and risks.',
        medium: 'Your strategic foundation shows promise with some executive support, but may benefit from clearer AI vision alignment and stronger board-level awareness of AI implications.',
        low: 'Your organization needs significant improvement in strategic planning, executive sponsorship, and leadership literacy before pursuing major AI initiatives.'
      },
      'AI Organization & Culture': {
        high: 'Your organizational culture strongly supports AI adoption with effective change management, cross-functional collaboration, and positive employee attitudes toward AI technologies.',
        medium: 'Your organizational culture shows moderate readiness but may need to strengthen change management capabilities and foster greater collaboration across departments.',
        low: 'Your organization needs to build a more innovation-friendly culture and address resistance to change before successfully adopting AI at scale.'
      },
      'Business Readiness': {
        high: 'Your business strategy is well-aligned for AI adoption with validated use cases, clear ROI frameworks, and strong KPI alignment. You\'re ready to pursue AI initiatives with confidence.',
        medium: 'Your business readiness is developing with some use case clarity, but would benefit from better ROI measurement frameworks and tighter integration with innovation pipelines.',
        low: 'Your business strategy needs significant development in AI use case identification, ROI frameworks, and stakeholder communication before pursuing AI initiatives.'
      },
      'Data Readiness': {
        high: 'Your data infrastructure is well-positioned for AI initiatives with excellent quality, governance, and security. You have the foundation needed for successful AI implementations.',
        medium: 'Your data readiness shows promise but requires improvements in quality management, governance frameworks, or security measures to fully support AI initiatives.',
        low: 'Your data infrastructure needs substantial improvements in quality, governance, and security before it can effectively support AI applications.'
      },
      'Infrastructure Readiness': {
        high: 'Your technical infrastructure is modern and scalable, with strong cloud capabilities and excellent integration with existing systems. You\'re well-equipped to support AI workloads.',
        medium: 'Your infrastructure shows good potential but may need upgrades in scalability, cloud readiness, or integration capabilities to fully support AI applications.',
        low: 'Your infrastructure requires significant modernization, cloud migration, and integration improvements before it can effectively support AI workloads.'
      },
      'People & Skills': {
        high: 'Your organization has strong AI talent with comprehensive training programs and effective knowledge-sharing mechanisms. Your team is well-prepared for AI initiatives.',
        medium: 'Your people and skills readiness is developing with some talent and training in place, but would benefit from more comprehensive upskilling and recruitment programs.',
        low: 'Your organization needs significant investment in AI talent acquisition, employee training, and skills development before pursuing major AI initiatives.'
      },
      'AI Governance & Ethics': {
        high: 'Your organization has robust AI governance frameworks with strong ethical guidelines, regulatory compliance mechanisms, and responsible AI practices.',
        medium: 'Your governance and ethics framework shows moderate maturity but may need to strengthen ethical oversight and compliance monitoring capabilities.',
        low: 'Your organization needs to establish comprehensive AI governance frameworks, ethical guidelines, and compliance mechanisms before deploying AI systems.'
      }
    };

    const level = percentage >= 70 ? 'high' : percentage >= 50 ? 'medium' : 'low';
    return insights[pillar as keyof typeof insights]?.[level] || 'Assessment data available for detailed analysis.';
  };

  // Get assessment type for display
  const assessmentType = assessmentData?.assessmentType === 'paid' ? 'Paid Assessment' : 'Free Assessment';

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
                <span className="text-xl font-semibold text-gray-900">Detailed Assessment Report</span>
                <span className="ml-4 px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">{assessmentType}</span>
              </div>
            </div>
            <Button id="export-pdf-button" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      <div id="pdf-report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Readiness Assessment Report
            </h1>
            <div className="text-lg text-gray-600 space-y-1">
              <div><strong>{assessmentData.companyName}</strong></div>
              <div>{assessmentData.industry} • {assessmentData.companySize}</div>
              <div>Assessment Date: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span>Executive Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Overall Assessment</h3>
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-3xl font-bold text-blue-600">{results.overallPercentage}%</span>
                    <Badge className="text-lg px-3 py-1">
                      {results.overallLevel}
                    </Badge>
                  </div>
                  <p className="text-gray-700">
                    {assessmentData.companyName} demonstrates {results.overallLevel.toLowerCase()} AI readiness, 
                    scoring in the {Math.round(results.industryPercentile)}th percentile compared to other {assessmentData.industry.toLowerCase()} companies.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Findings</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• {results.pillarScores.reduce((max, pillar) => pillar.percentage > max.percentage ? pillar : max).name} is your strongest pillar ({results.pillarScores.reduce((max, pillar) => pillar.percentage > max.percentage ? pillar : max).percentage}%)</li>
                    <li>• {results.pillarScores.reduce((min, pillar) => pillar.percentage < min.percentage ? pillar : min).name} needs the most attention ({results.pillarScores.reduce((min, pillar) => pillar.percentage < min.percentage ? pillar : min).percentage}%)</li>
                    <li>• {results.recommendations.filter(r => r.priority === 'High').length} high-priority recommendations identified</li>
                    <li>• Estimated timeline for readiness improvement: 6-12 months</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Pillar Analysis */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Pillar Analysis - All 7 AI Readiness Pillars</h2>
          <div className="space-y-6">
            {results.pillarScores.map((pillar, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" style={{ color: pillar.color }} />
                      <span>{pillar.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold" style={{ color: pillar.color }}>
                        {pillar.percentage}%
                      </span>
                      <Badge>{pillar.level}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${pillar.percentage}%`,
                          backgroundColor: pillar.color 
                        }}
                      ></div>
                    </div>
                    <p className="text-gray-700">
                      {getInsightForPillar(pillar.name, pillar.percentage)}
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-gray-900">{pillar.score}</div>
                        <div className="text-sm text-gray-600">Raw Score</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-gray-900">{pillar.maxScore}</div>
                        <div className="text-sm text-gray-600">Max Possible</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-gray-900">{pillar.level}</div>
                        <div className="text-sm text-gray-600">Performance Level</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Industry Benchmarking Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span>Industry Benchmarking</span>
            </CardTitle>
            <CardDescription>
              How your organization compares to industry peers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Industry Position</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Your Score:</span>
                    <span className="font-semibold text-blue-600">{results.overallPercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Industry Percentile:</span>
                    <span className="font-semibold">{Math.round(results.industryPercentile)}th</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Performance Level:</span>
                    <Badge>{results.overallLevel}</Badge>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Competitive Analysis</h3>
                <p className="text-sm text-gray-700">
                  Your organization performs {results.industryPercentile > 50 ? 'above' : 'below'} the industry median 
                  in AI readiness. This positions you {results.industryPercentile > 75 ? 'as a leader' : 
                  results.industryPercentile > 50 ? 'competitively' : 'with room for improvement'} in the {assessmentData.industry} sector.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategic Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-purple-600" />
              <span>Strategic Recommendations</span>
            </CardTitle>
            <CardDescription>
              Priority actions to accelerate your AI readiness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {['High', 'Medium', 'Low'].map(priority => {
                const priorityRecs = results.recommendations.filter(r => r.priority === priority);
                if (priorityRecs.length === 0) {
                  return null;
                }
                return (
                  <div key={priority}>
                    <h3 className="text-lg font-semibold mb-3">{priority} Priority Recommendations</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                      {priorityRecs.map((rec, index) => (
                        <li key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <span className="font-medium">{rec.title}</span> - {rec.description}
                          </div>
                          <div className="mt-2 sm:mt-0 sm:ml-4">
                            <Badge className="text-xs">
                              {rec.category}
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}