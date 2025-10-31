// components/AssessmentPreview.jsx
import React, { useState } from 'react';
import { evaluateCondition } from '../../utils/conditional';

export default function AssessmentPreview({ assessment }) {
  const [answers, setAnswers] = useState({});

  if (!assessment) {
    return (
      <div className="p-4 text-center text-gray-500 border rounded-lg">
        No assessment defined
      </div>
    );
  }

  const onChange = (qid, val) => {
    setAnswers(prev => ({ ...prev, [qid]: val }));
  };

  return (
    <div className="border rounded-2xl p-6 bg-gray-50 shadow-inner">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
        {assessment.title || 'Untitled Assessment'}
      </h2>

      {assessment.sections && assessment.sections.length > 0 ? (
        assessment.sections.map(section => (
          <div key={section.id} className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
              {section.title}
            </h3>

            <div className="flex flex-col gap-5">
              {section.questions.map(q => {
                const visible = !q.showIf || evaluateCondition(q.showIf, answers);
                if (!visible) return null;

                return (
                  <div
                    key={q.id}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <label className="block font-medium text-gray-700 mb-2">
                      {q.label} {q.required && <span className="text-red-500">*</span>}
                    </label>

                    {/* --- Short text input --- */}
                    {q.type === 'short' && (
                      <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                        placeholder="Enter answer"
                        value={answers[q.id] || ''}
                        onChange={e => onChange(q.id, e.target.value)}
                      />
                    )}

                    {/* --- Long text input --- */}
                    {q.type === 'long' && (
                      <textarea
                        className="w-full border rounded-lg px-3 py-2 h-28 resize-none focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                        placeholder="Write your answer here..."
                        value={answers[q.id] || ''}
                        onChange={e => onChange(q.id, e.target.value)}
                      />
                    )}

                    {/* --- Numeric input --- */}
                    {q.type === 'numeric' && (
                      <input
                        type="number"
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                        placeholder="Enter a number"
                        value={answers[q.id] || ''}
                        onChange={e => onChange(q.id, e.target.value)}
                      />
                    )}

                    {/* --- Single-choice question --- */}
                    {q.type === 'single' && (
                      <div className="flex flex-col gap-2">
                        {q.options.map(opt => (
                          <label key={opt} className="flex items-center gap-2 text-gray-700">
                            <input
                              type="radio"
                              name={q.id}
                              className="text-indigo-600"
                              checked={answers[q.id] === opt}
                              onChange={() => onChange(q.id, opt)}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {/* --- Multi-choice question --- */}
                    {q.type === 'multi' && (
                      <div className="flex flex-col gap-2">
                        {q.options.map(opt => (
                          <label key={opt} className="flex items-center gap-2 text-gray-700">
                            <input
                              type="checkbox"
                              className="text-indigo-600"
                              checked={
                                Array.isArray(answers[q.id]) && answers[q.id].includes(opt)
                              }
                              onChange={e => {
                                const existing = answers[q.id] || [];
                                if (e.target.checked) {
                                  onChange(q.id, [...existing, opt]);
                                } else {
                                  onChange(q.id, existing.filter(x => x !== opt));
                                }
                              }}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {/* --- File input --- */}
                    {q.type === 'file' && (
                      <div className="text-gray-500 italic mt-1">
                        File upload (stub)
                        <input
                          type="file"
                          disabled
                          className="ml-2 text-gray-400 cursor-not-allowed"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500 italic mt-3">
          No sections added yet
        </div>
      )}

      
    </div>
  );
}
