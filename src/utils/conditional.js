// utils/conditional.js
export function evaluateCondition(rule, answers = {}) {
  // rule: { questionId, operator, value }
  if (!rule) return true;
  const left = answers[rule.questionId];
  const { operator, value } = rule;

  switch (operator) {
    case '===': return left === value;
    case '!==': return left !== value;
    case '>': return Number(left) > Number(value);
    case '<': return Number(left) < Number(value);
    case '>=': return Number(left) >= Number(value);
    case '<=': return Number(left) <= Number(value);
    case 'includes': return Array.isArray(left) && left.includes(value);
    default: return !!left;
  }
}
