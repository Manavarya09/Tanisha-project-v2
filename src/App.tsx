import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AssessmentForm from './pages/AssessmentForm';
import PaidAssessmentForm from './pages/PaidAssessmentForm';
import ResultsDashboard from './pages/ResultsDashboard';
import DetailedReport from './pages/DetailedReport';
import BenchmarkingView from './pages/BenchmarkingView';
import RecommendationsPage from './pages/RecommendationsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/assessment" element={<AssessmentForm />} />
          <Route path="/paid-assessment" element={<PaidAssessmentForm />} />
          <Route path="/results" element={<ResultsDashboard />} />
          <Route path="/report" element={<DetailedReport />} />
          <Route path="/benchmarking" element={<BenchmarkingView />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
