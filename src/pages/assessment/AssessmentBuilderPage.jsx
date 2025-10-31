import { useParams } from 'react-router-dom';
import AssessmentBuilder from '../../components/assessment/AssessmentBuilder';

export function AssessmentBuilderPage() {
  const { jobId } = useParams();
  return <AssessmentBuilder jobId={Number(jobId)} />;
}
