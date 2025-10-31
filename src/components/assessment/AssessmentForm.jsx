// components/AssessmentForm.jsx
import React, { useState, useMemo } from 'react';
import { evaluateCondition } from '../../utils/conditional';
import { validateQuestion } from '../../utils/validator';
import { useAssessments } from '../../hooks/useAssessment';

export default function AssessmentForm({ jobId, candidateId }) {
  const { assessment, loading, error, submitResponse } = useAssessments(jobId);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const visibleQuestions = useMemo(() => {
    const vis = [];
    if (!assessment) return vis;
    assessment.sections.forEach(section => {
      section.questions.forEach(q => {
        vis.push({ section, question: q });
      });
    });
    return vis;
  }, [assessment]);

  if (loading) return <div>Loading form...</div>;
  if (!assessment) return <div>No assessment available</div>;

  const handleChange = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const validateAll = () => {
    const newErrors = {};
    // iterate through questions, check only visible ones
    assessment.sections.forEach(section => {
      section.questions.forEach(q => {
        const visible = !q.showIf || evaluateCondition(q.showIf, answers);
        if (!visible) return;
        const errs = validateQuestion(q, answers[q.id]);
        if (errs.length) newErrors[q.id] = errs;
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      return;
    }
    setSubmitting(true);
    try {
      const saved = await submitResponse(candidateId, answers);
      setResult({ success: true, saved });
    } catch (err) {
      setResult({ success: false, message: err.message || 'Submit failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>{assessment.title}</h3>

      {assessment.sections.map(section => (
        <div key={section.id} style={{ marginBottom: 12 }}>
          <h4>{section.title}</h4>
          {section.questions.map(q => {
            const visible = !q.showIf || evaluateCondition(q.showIf, answers);
            if (!visible) return null;
            return (
              <div key={q.id} style={{ marginBottom: 8 }}>
                <label>{q.label}{q.required ? '*' : ''}</label>
                <div>
                  {q.type === 'short' && <input value={answers[q.id] || ''} onChange={(e)=>handleChange(q.id, e.target.value)} />}
                  {q.type === 'long' && <textarea value={answers[q.id] || ''} onChange={(e)=>handleChange(q.id, e.target.value)} />}
                  {q.type === 'single' && q.options.map(opt=>(
                    <label key={opt} style={{ marginRight: 8 }}>
                      <input type="radio" name={q.id} checked={answers[q.id]===opt} onChange={()=>handleChange(q.id,opt)} /> {opt}
                    </label>
                  ))}
                  {q.type === 'multi' && q.options.map(opt=>(
                    <label key={opt} style={{ marginRight: 8 }}>
                      <input type="checkbox" checked={Array.isArray(answers[q.id]) && answers[q.id].includes(opt)} onChange={(e)=>{
                        const existing = answers[q.id] || [];
                        if (e.target.checked) handleChange(q.id,[...existing,opt]); else handleChange(q.id, existing.filter(x=>x!==opt));
                      }} /> {opt}
                    </label>
                  ))}
                  {q.type === 'numeric' && <input type="number" value={answers[q.id]||''} onChange={(e)=>handleChange(q.id,e.target.value)} />}
                  {q.type === 'file' && <div><em>file upload (stub — not storing file)</em><input type="file" onChange={(e)=>handleChange(q.id, (e.target.files && e.target.files[0]) ? {name: e.target.files[0].name} : null)} /></div>}
                </div>
                {errors[q.id] && <div style={{ color: 'red' }}>{errors[q.id].join(', ')}</div>}
              </div>
            );
          })}
        </div>
      ))}

      <button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit'}</button>
      {result && (
        <div style={{ marginTop: 12 }}>
          {result.success ? <div style={{ color: 'green' }}>Submitted</div> : <div style={{ color: 'red' }}>{result.message}</div>}
        </div>
      )}
    </form>
  );
}
