// components/AssessmentBuilder.jsx
import React, { useState, useEffect } from 'react';
import AssessmentPreview from './AssessmentPreview';
import { v4 as uuidv4 } from 'uuid';
import { useAssessments } from '../../hooks/useAssessment';

const DEFAULT_QUESTION = (type='short') => ({
  id: uuidv4(),
  type,
  label: 'New question',
  required: false,
  options: type === 'single' || type === 'multi' ? ['Option 1','Option 2'] : [],
  validators: {},
  showIf: null
});

export default function AssessmentBuilder({ jobId }) {
  const { assessment, loading, error, saveAssessment, setAssessment } = useAssessments(jobId);
  const [local, setLocal] = useState(null);
  const [savingError, setSavingError] = useState(null);

  useEffect(() => { if (assessment) setLocal(assessment); }, [assessment]);

  const addSection = () => {
    const sec = { id: uuidv4(), title: 'New section', questions: [DEFAULT_QUESTION()] };
    setLocal(prev => ({ ...prev, sections: [...(prev.sections || []), sec] }));
  };

  const removeSection = (secId) => {
    setLocal(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== secId) }));
  };

  const addQuestion = (secId, type='short') => {
    const q = DEFAULT_QUESTION(type);
    setLocal(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === secId ? ({ ...s, questions: [...s.questions, q] }) : s)
    }));
  };

  const updateQuestion = (secId, qId, patch) => {
    setLocal(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === secId ? ({
        ...s,
        questions: s.questions.map(q => q.id === qId ? ({ ...q, ...patch }) : q)
      }) : s)
    }));
  };

  const save = async () => {
    setSavingError(null);
    try {
      // minimal validation
      const payload = { title: local.title || `Assessment for job ${jobId}`, sections: local.sections || [] };
      const saved = await saveAssessment(payload);
      setLocal(saved);
      // reflect to parent hook state
    } catch (err) {
      setSavingError(err.message || 'save failed');
    }
  };

  if (loading || !local) return <div>Loading assessment...</div>;
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ flex: 1 }}>
        <h2>Assessment Builder — Job {jobId}</h2>
        <div>
          <label>Title</label>
          <input value={local.title || ''} onChange={(e)=>setLocal({...local,title:e.target.value})} />
        </div>

        <button onClick={addSection}>+ Add section</button>
        {local.sections && local.sections.map((sec, si) => (
          <div key={sec.id} style={{ border: '1px solid #ddd', padding: 8, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <input value={sec.title} onChange={e => setLocal(prev => ({
                ...prev,
                sections: prev.sections.map(s => s.id===sec.id?{...s,title:e.target.value}:s)
              }))}/>
              <div>
                <button onClick={()=>addQuestion(sec.id,'short')}>+ Short</button>
                <button onClick={()=>addQuestion(sec.id,'long')}>+ Long</button>
                <button onClick={()=>addQuestion(sec.id,'single')}>+ Single</button>
                <button onClick={()=>addQuestion(sec.id,'multi')}>+ Multi</button>
                <button onClick={()=>addQuestion(sec.id,'numeric')}>+ Numeric</button>
                <button onClick={()=>addQuestion(sec.id,'file')}>+ File</button>
                <button onClick={()=>removeSection(sec.id)}>Remove section</button>
              </div>
            </div>

            {sec.questions.map(q => (
              <div key={q.id} style={{ padding: 8, borderTop: '1px dashed #eee' }}>
                <div>
                  <select value={q.type} onChange={(e)=>updateQuestion(sec.id,q.id,{type:e.target.value})}>
                    <option value="short">Short text</option>
                    <option value="long">Long text</option>
                    <option value="single">Single choice</option>
                    <option value="multi">Multi choice</option>
                    <option value="numeric">Numeric</option>
                    <option value="file">File upload (stub)</option>
                  </select>
                  <input value={q.label} onChange={(e)=>updateQuestion(sec.id,q.id,{label:e.target.value})} style={{width:'60%'}}/>
                  <label>
                    <input type="checkbox" checked={q.required||false} onChange={(e)=>updateQuestion(sec.id,q.id,{required:e.target.checked})} />
                    required
                  </label>
                  <button onClick={()=>{ // delete question
                    setLocal(prev=>({
                      ...prev,
                      sections: prev.sections.map(s=>s.id===sec.id?{...s,questions:s.questions.filter(qq=>qq.id!==q.id)}:s)
                    }))
                  }}>Delete</button>
                </div>

                {(q.type === 'single' || q.type === 'multi') && (
                  <div>
                    <label>Options (comma separated)</label>
                    <input value={(q.options||[]).join(',')} onChange={(e)=>updateQuestion(sec.id,q.id,{options: e.target.value.split(',').map(s=>s.trim())})}/>
                  </div>
                )}

                <div>
                  <label>Validators JSON (examples: {"{numeric:true,min:0,max:10}"})</label>
                  <input value={JSON.stringify(q.validators||{})} onChange={(e)=>{
                    try{
                      updateQuestion(sec.id,q.id,{validators:JSON.parse(e.target.value)});
                    }catch(err){}
                  }}/>
                </div>

                <div>
                  <label>Show If (conditional) — as JSON: {"{questionId:'q-..',operator:'===',value:'Yes'}"}</label>
                  <input value={q.showIf ? JSON.stringify(q.showIf) : ''} onChange={(e)=>{
                    try{
                      updateQuestion(sec.id,q.id,{showIf: e.target.value ? JSON.parse(e.target.value) : null});
                    }catch(err){}
                  }}/>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div style={{ marginTop: 12 }}>
          <button onClick={save}>Save assessment</button>
          {savingError && <div style={{ color: 'red' }}>{savingError}</div>}
        </div>
      </div>

      <div style={{ width: 420 }}>
        <h3>Live Preview</h3>
        <AssessmentPreview assessment={local} />
      </div>
    </div>
  );
}
