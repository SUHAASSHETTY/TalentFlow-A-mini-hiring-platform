// hooks/useAssessments.js
import { useState, useEffect, useCallback } from 'react';

export function useAssessments(jobId) {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssessment = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/assessments/${jobId}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAssessment(data);
    } catch (err) {
      setError(err.message || 'error');
      setAssessment(null);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  const saveAssessment = useCallback(async (payload) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(()=>({}));
        throw new Error(body.error || 'Save failed');
      }
      const updated = await res.json();
      setAssessment(updated);
      return updated;
    } catch (err) {
      setError(err.message || 'save error');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [jobId]);

  const submitResponse = useCallback(async (candidateId, responses) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/assessments/${jobId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, responses })
      });
      if (!res.ok) {
        const body = await res.json().catch(()=>({}));
        throw new Error(body.error || 'Submit failed');
      }
      const saved = await res.json();
      return saved;
    } catch (err) {
      setError(err.message || 'submit error');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [jobId]);

  useEffect(() => { if (jobId) fetchAssessment(); }, [jobId, fetchAssessment]);

  return { assessment, loading, saving, error, fetchAssessment, saveAssessment, submitResponse, setAssessment };
}
