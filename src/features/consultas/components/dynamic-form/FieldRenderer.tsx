import { SchemaField } from '../../types/schema-engine';
import { useConditionalField } from './hooks/useConditionalField';
import { BooleanField } from './fields/BooleanField';
import { TextField } from './fields/TextField';
import { MultiChoiceField } from './fields/MultiChoiceField';
import { SingleChoiceField } from './fields/SingleChoiceField';

interface FieldRendererProps {
  field: SchemaField;
  sectionId: string;
}

export function FieldRenderer({ field, sectionId }: FieldRendererProps) {
  const { shouldRender } = useConditionalField(field, sectionId);

  if (!shouldRender) return null;

  // O caminho exato onde o RHF vai injetar o valor:
  // Seguindo nosso Zod Schema: dados_clinicos.secaoId.campoId.answer
  const rhfName = `${sectionId}.${field.id}.answer`;

  // Dispatcher Semi-Controlado
  switch (field.type) {
    case 'boolean':
      return <BooleanField field={field} name={rhfName} />;
    case 'text':
    case 'textarea':
    case 'number':
      return <TextField field={field} name={rhfName} />;
    case 'single_choice':
      return <SingleChoiceField field={field} name={rhfName} />;
    case 'multi_choice':
      return <MultiChoiceField field={field} name={rhfName} />;
    default:
      return null;
  }
}
