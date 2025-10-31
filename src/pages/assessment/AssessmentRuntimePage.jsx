import React from 'react';
import { useParams } from 'react-router-dom';
import AssessmentForm from '../../components/assessment/AssessmentForm';

export function AssessmentRuntimePage() {
  const { jobId, candidateId } = useParams();
  return <AssessmentForm jobId={Number(jobId)} candidateId={Number(candidateId)} />;
}
