import { useFormContext, useWatch } from 'react-hook-form';
import { SchemaField } from '../../../types/schema-engine';
import { evaluateConditions } from '../conditions/evaluateConditions';

export function useConditionalField(field: SchemaField, sectionId: string) {
  const { control, getValues } = useFormContext();

  // Extrai apenas os IDs dos campos que este campo observa
  const dependencies = field.conditions?.map((c) => c.dependsOn) || [];

  // Mapeia os caminhos exatos no React Hook Form (ex: 'sono.dorme_bem.answer')
  // Assumimos que campos dependentes geralmente estão na mesma seção (simplificação MVP)
  const watchPaths = dependencies.map((depId) => `${sectionId}.${depId}.answer`);

  // Dispara a re-renderização APENAS se esses caminhos específicos mudarem
  useWatch({
    control,
    name: watchPaths,
  });

  // Função helper para buscar o valor real na hora de avaliar
  const getFieldValue = (targetFieldId: string) => {
    return getValues(`${sectionId}.${targetFieldId}.answer`);
  };

  const shouldRender = evaluateConditions(field.conditions, getFieldValue);

  return { shouldRender };
}