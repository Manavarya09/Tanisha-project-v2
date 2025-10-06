import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { ChevronLeft, ChevronRight, Building, Users, BarChart3, Server } from 'lucide-react';
import { assessmentQuestions, AssessmentData, parseAssessmentCSV, PillarQuestions, parseAirtableCSVByRegion, PillarQuestionsUnique } from '../utils/assessmentLogic';
import csvText from '../../AI_Readiness_Assessment_Core35.csv?raw';
import airtableCsv from '../../Airtable AI Readiness File To Import (1).csv?raw';
import { parseAssessmentCSVUnique } from '../utils/assessmentLogic';
import AnimatedContent from '../components/AnimatedContent';
import { createAssessmentRecord } from '../lib/airtable';

// Build questions from Airtable CSV filtered by region (includes Global and region-specific)
// Fallback to Core35 if needed

interface AssessmentFormProps {
  location?: any; // Optional prop to allow passing location from parent
}

export default function AssessmentForm({ location: parentLocation }: AssessmentFormProps = {}) {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const location = parentLocation || routerLocation;
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    companyName: '',
    industry: '',
    companySize: '',
    region: 'Global',
    responses: {}
  });

  // Get assessment type from query param or default to 'free'
  const searchParams = new URLSearchParams(location.search);
  const assessmentType = searchParams.get('type') || 'free';

  const steps = [
    {
      title: 'Company Information',
      icon: Building,
      description: 'Tell us about your organization'
    },
    {
      title: 'Strategy & Leadership',
      icon: Users,
      description: 'Vision, sponsorship, literacy, board, national alignment'
    },
    {
      title: 'Business Readiness',
      icon: BarChart3,
      description: 'Use cases, ROI, KPIs, innovation, communication'
    },
    {
      title: 'Infrastructure Readiness',
      icon: Server,
      description: 'Cloud/on-prem, security, legacy, scalability, recovery'
    },
    {
      title: 'People & Skills',
      icon: Users,
      description: 'Literacy, upskilling, leadership, change, inclusivity'
    },
    {
      title: 'AI Governance & Ethics',
      icon: BarChart3,
      description: 'Principles, privacy, risk, explainability, accountability'
    },
    {
      title: 'AI Organization & Culture',
      icon: Users,
      description: 'Mindset, collaboration, champions, agility, recognition'
    },
    {
      title: 'Data Readiness',
      icon: BarChart3,
      description: 'Governance, quality, lineage, observability, accessibility'
    }
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const pillarMap = {
    1: 'Strategy & Leadership',
    2: 'Business Readiness',
    3: 'Infrastructure Readiness',
    4: 'People & Skills',
    5: 'AI Governance & Ethics',
    6: 'AI Organization & Culture',
    7: 'Data Readiness'
  } as const;

  const region = assessmentData.region || 'Global';
  const pillarQuestions = useMemo<PillarQuestionsUnique>(() => {
    const pq = parseAirtableCSVByRegion(airtableCsv, region);
    const fallback = parseAssessmentCSVUnique(csvText);
    return { ...fallback, ...pq };
  }, [region]);

  const getQuestionsForStep = (step: number) => {
    const pillar = pillarMap[step as keyof typeof pillarMap];
    if (!pillar || !pillarQuestions[pillar]) return [];
    return Object.entries(pillarQuestions[pillar]).flatMap(([subcategory, questions]) =>
      questions.map(q => ({ ...q, subcategory }))
    );
  };

  const handleNext = async () => {
    if (!validateStep()) {
      return; // Don't proceed if validation fails
    }
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setValidationErrors([]); // Clear errors when moving to next step
    } else {
      // Save assessment data and type to localStorage and navigate to results
      localStorage.setItem('assessmentData', JSON.stringify({ ...assessmentData, assessmentType }));
      
      // Save to Airtable with comprehensive data
      try {
        await createAssessmentRecord({ ...assessmentData, assessmentType });
        console.log('Assessment data saved to Airtable successfully');
      } catch (err) {
        console.error('Failed to save to Airtable:', err);
        // Still navigate to results even if Airtable save fails
      }
      navigate('/results');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateCompanyInfo = (field: string, value: string) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation errors when user fills in company info
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const updateResponse = (questionId: string, value: number) => {
    setAssessmentData(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: value
      }
    }));
    // Clear validation errors when user answers a question
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const isStepComplete = () => {
    if (currentStep === 0) {
      return assessmentData.companyName && assessmentData.industry && assessmentData.companySize;
    }
    const stepQuestions = getQuestionsForStep(currentStep);
    return stepQuestions.every(q => assessmentData.responses[q.question]);
  };

  const getUnansweredQuestions = () => {
    if (currentStep === 0) {
      const missing = [];
      if (!assessmentData.companyName) missing.push('Company Name');
      if (!assessmentData.industry) missing.push('Industry');
      if (!assessmentData.companySize) missing.push('Company Size');
      return missing;
    }
    const stepQuestions = getQuestionsForStep(currentStep);
    return stepQuestions
      .filter(q => !assessmentData.responses[q.question])
      .map(q => q.question);
  };

  const validateStep = () => {
    const unanswered = getUnansweredQuestions();
    setValidationErrors(unanswered);
    return unanswered.length === 0;
  };

  const renderCompanyInfoStep = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={assessmentData.companyName}
          onChange={(e) => updateCompanyInfo('companyName', e.target.value)}
          placeholder="Enter your company name"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="industry">Industry</Label>
        <Select value={assessmentData.industry} onValueChange={(value) => updateCompanyInfo('industry', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
  <SelectItem value="Agriculture">Agriculture</SelectItem>
  <SelectItem value="Consulting">Consulting</SelectItem>
  <SelectItem value="Education">Education</SelectItem>
  <SelectItem value="Energy">Energy</SelectItem>
  <SelectItem value="Financial Services">Financial Services</SelectItem>
  <SelectItem value="Healthcare">Healthcare</SelectItem>
  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
  <SelectItem value="Media">Media</SelectItem>
  <SelectItem value="Public Sector">Public Sector</SelectItem>
  <SelectItem value="Real Estate">Real Estate</SelectItem>
  <SelectItem value="Retail">Retail</SelectItem>
  <SelectItem value="Technology">Technology</SelectItem>
  <SelectItem value="Tourism">Tourism</SelectItem>
  <SelectItem value="Transportation">Transportation</SelectItem>
  <SelectItem value="Other">Other</SelectItem>
</SelectContent>


        </Select>
      </div>
      
      <div>
        <Label htmlFor="companySize">Company Size</Label>
        <Select value={assessmentData.companySize} onValueChange={(value) => updateCompanyInfo('companySize', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-50">1-50 employees</SelectItem>
            <SelectItem value="51-200">51-200 employees</SelectItem>
            <SelectItem value="201-1000">201-1,000 employees</SelectItem>
            <SelectItem value="1001-5000">1,001-5,000 employees</SelectItem>
            <SelectItem value="5000+">5,000+ employees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="region">Region</Label>
        <Select value={assessmentData.region} onValueChange={(value) => updateCompanyInfo('region', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select your region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Global">Global</SelectItem>
            <SelectItem value="Middle East">Middle East</SelectItem>
            <SelectItem value="Europe">Europe</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderQuestionStep = () => {
    const questions = getQuestionsForStep(currentStep);
    // Group by subcategory for display
    const grouped = questions.reduce((acc, q) => {
      if (!acc[q.subcategory]) acc[q.subcategory] = [];
      acc[q.subcategory].push(q);
      return acc;
    }, {} as Record<string, typeof questions>);

    return (
      <div className="space-y-8">
        {Object.entries(grouped).map(([subcategory, qs]) => (
          <div key={subcategory} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{subcategory}</h2>
            {qs.map((question, index) => (
              <div key={question.question} className="space-y-4">
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  {index + 1}. {question.question}
                </h3>
                <div className="space-y-2">
                  {[
                    { value: 1, label: 'No' },
                    { value: 3, label: 'Partial' },
                    { value: 5, label: 'Yes' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${assessmentData.responses[question.question] === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name={question.question}
                        value={option.value}
                        checked={assessmentData.responses[question.question] === option.value}
                        onChange={() => updateResponse(question.question, option.value)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${assessmentData.responses[question.question] === option.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                        {assessmentData.responses[question.question] === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">AI Readiness Assessment</span>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              Exit Assessment
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="text-xs text-center font-medium hidden sm:block">
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <h3 className="text-red-800 font-semibold">Please complete the following:</h3>
            </div>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">
                  {error.length > 100 ? `${error.substring(0, 100)}...` : error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {(() => {
                const IconComponent = steps[currentStep].icon;
                return <IconComponent className="h-6 w-6 text-blue-600" />;
              })()}
              <span>{steps[currentStep].title}</span>
            </CardTitle>
            <CardDescription>
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 0 ? renderCompanyInfoStep() : renderQuestionStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={false}
            className={`flex items-center space-x-2 ${
              validationErrors.length > 0 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <span>
              {validationErrors.length > 0 
                ? `Complete ${validationErrors.length} missing item${validationErrors.length > 1 ? 's' : ''}` 
                : currentStep === totalSteps - 1 ? 'Complete Assessment' : 'Next'
              }
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
