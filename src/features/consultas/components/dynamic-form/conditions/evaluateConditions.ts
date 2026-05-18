import { Condition } from '../../../types/schema-engine';

export function evaluateConditions(
  conditions: Condition[] | undefined,
  getFieldValue: (fieldId: string) => unknown
): boolean {
  if (!conditions || conditions.length === 0) return true;

  // Usa 'every' (AND lógico) -> Todas as condições devem ser verdadeiras
  // Se futuramente precisarmos de 'some' (OR lógico), basta evoluir o schema
  return conditions.every((cond) => {
    const currentValue = getFieldValue(cond.dependsOn);

    switch (cond.operator) {
      case 'equals':
        return currentValue === cond.value;
      case 'not_equals':
        return currentValue !== cond.value;
      case 'contains':
        return Array.isArray(currentValue) && currentValue.includes(cond.value);
      case 'greater_than':
        return typeof currentValue === 'number' && typeof cond.value === 'number' && currentValue > cond.value;
      default:
        return false;
    }
  });
}
