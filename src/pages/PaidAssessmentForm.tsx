import AssessmentForm from './AssessmentForm';
import { useLocation } from 'react-router-dom';

export default function PaidAssessmentForm() {
  const location = useLocation();

  return <AssessmentForm location={location} />;
}
