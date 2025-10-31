import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AssessmentPreview from './AssessmentPreview'; // same component we made earlier

const DEFAULT_QUESTION = (type = 'short') => ({
  id: uuidv4(),
  type,
  label: 'New question',
  required: false,
  options: type === 'single' || type === 'multi' ? ['Option 1', 'Option 2'] : [],
  validators: {},
  showIf: null,
});

export default function AssessmentBuilderDemo() {
  const [assessment, setAssessment] = useState({
    title: 'Demo Assessment',
    sections: [],
  });

  const addSection = () => {
    const newSection = {
      id: uuidv4(),
      title: `Section ${assessment.sections.length + 1}`,
      questions: [DEFAULT_QUESTION()],
    };
    setAssessment(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const addQuestion = (sectionId, type = 'short') => {
    const q = DEFAULT_QUESTION(type);
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, questions: [...s.questions, q] } : s
      ),
    }));
  };

  const updateQuestion = (sectionId, qId, patch) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? {
              ...s,
              questions: s.questions.map(q =>
                q.id === qId ? { ...q, ...patch } : q
              ),
            }
          : s
      ),
    }));
  };

  const removeSection = id => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id),
    }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen">
      {/* Left side — Builder */}
      <div className="flex-1 bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-indigo-600">
          Assessment Builder 
        </h2>

        <div>
          <label className="font-semibold text-gray-700">Title:</label>
          <input
            className="border rounded-lg px-3 py-1 ml-2 focus:ring focus:ring-indigo-300"
            value={assessment.title}
            onChange={e =>
              setAssessment({ ...assessment, title: e.target.value })
            }
          />
        </div>

        <button
          onClick={addSection}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          + Add Section
        </button>

        {assessment.sections.map(section => (
          <div
            key={section.id}
            className="border rounded-lg p-4 bg-gray-50 mt-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <input
                className="font-semibold text-lg border-b focus:outline-none focus:border-indigo-400"
                value={section.title}
                onChange={e =>
                  setAssessment(prev => ({
                    ...prev,
                    sections: prev.sections.map(s =>
                      s.id === section.id ? { ...s, title: e.target.value } : s
                    ),
                  }))
                }
              />
              <button
                onClick={() => removeSection(section.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete Section
              </button>
            </div>

            <div className="space-y-3">
              {section.questions.map(q => (
                <div
                  key={q.id}
                  className="border rounded-lg p-3 bg-white shadow-sm"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <select
                        className="border rounded px-2 py-1"
                        value={q.type}
                        onChange={e =>
                          updateQuestion(section.id, q.id, {
                            type: e.target.value,
                          })
                        }
                      >
                        <option value="short">Short</option>
                        <option value="long">Long</option>
                        <option value="single">Single Choice</option>
                        <option value="multi">Multi Choice</option>
                        <option value="numeric">Numeric</option>
                        <option value="file">File Upload</option>
                      </select>

                      <input
                        className="border rounded-lg px-3 py-1 flex-1"
                        value={q.label}
                        onChange={e =>
                          updateQuestion(section.id, q.id, {
                            label: e.target.value,
                          })
                        }
                      />
                      <label className="flex items-center gap-1 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={q.required}
                          onChange={e =>
                            updateQuestion(section.id, q.id, {
                              required: e.target.checked,
                            })
                          }
                        />
                        Required
                      </label>
                    </div>

                    {(q.type === 'single' || q.type === 'multi') && (
                      <input
                        className="border rounded px-3 py-1 text-sm text-gray-700"
                        placeholder="Options (comma separated)"
                        value={q.options.join(', ')}
                        onChange={e =>
                          updateQuestion(section.id, q.id, {
                            options: e.target.value
                              .split(',')
                              .map(o => o.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <button
                  className="text-sm text-indigo-600 border border-indigo-600 rounded-lg px-3 py-1 hover:bg-indigo-600 hover:text-white transition"
                  onClick={() => addQuestion(section.id, 'short')}
                >
                  + Short
                </button>
                <button
                  className="text-sm text-indigo-600 border border-indigo-600 rounded-lg px-3 py-1 hover:bg-indigo-600 hover:text-white transition"
                  onClick={() => addQuestion(section.id, 'single')}
                >
                  + Single Choice
                </button>
                <button
                  className="text-sm text-indigo-600 border border-indigo-600 rounded-lg px-3 py-1 hover:bg-indigo-600 hover:text-white transition"
                  onClick={() => addQuestion(section.id, 'multi')}
                >
                  + Multi Choice
                </button>
                <button
                  className="text-sm text-indigo-600 border border-indigo-600 rounded-lg px-3 py-1 hover:bg-indigo-600 hover:text-white transition"
                  onClick={() => addQuestion(section.id, 'long')}
                >
                  + Long
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right side — Preview */}
      <div className="flex-1 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-3">
          Live Preview
        </h2>
        <AssessmentPreview assessment={assessment} />
      </div>
    </div>
  );
}
