// utils/validators.js
export function validateQuestion(question, value) {
  const errors = [];
  if (question.required) {
    if (question.type === 'multi') {
      if (!value || (Array.isArray(value) && value.length === 0)) errors.push('Required');
    } else {
      if (value === undefined || value === null || value === '') errors.push('Required');
    }
  }
  if (question.validators) {
    const v = question.validators;
    if (v.numeric && value !== '' && value !== undefined && value !== null) {
      if (isNaN(Number(value))) errors.push('Must be a number');
      else {
        if (v.min !== undefined && Number(value) < v.min) errors.push(`Minimum ${v.min}`);
        if (v.max !== undefined && Number(value) > v.max) errors.push(`Maximum ${v.max}`);
      }
    }
    if (v.maxLength && typeof value === 'string' && value.length > v.maxLength) {
      errors.push(`Max length ${v.maxLength}`);
    }
  }
  return errors;
}
