import { useForm, FormProvider } from 'react-hook-form';
import { ClinicalSchema } from '../../types/schema-engine';
import { FieldRenderer } from './FieldRenderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAutosave } from './hooks/useAutosave'; // <-- IMPORTAÇÃO

interface DynamicFormRendererProps {
  consultaId: string; // <-- AGORA PRECISAMOS DO ID DA CONSULTA
  schema: ClinicalSchema;
  initialValues?: Record<string, unknown>;
}

const fieldColumnClassName = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
} as const;

// Componente interno apenas para podermos usar o useFormContext no hook de autosave
function AutosaveIndicator({
  consultaId,
  schema,
}: {
  consultaId: string;
  schema: ClinicalSchema;
}) {
  const { status, lastSavedAt } = useAutosave(consultaId, schema, 2000);

  if (status === 'idle') return null;

  return (
    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
      {status === 'saving' && <span className="animate-pulse">A gravar rascunho...</span>}
      {status === 'saved' && (
        <span className="text-green-600 dark:text-green-400">
          Guardado às {lastSavedAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
      {status === 'error' && <span className="text-red-500">Erro ao guardar</span>}
    </div>
  );
}

export function DynamicFormRenderer({ consultaId, schema, initialValues = {} }: DynamicFormRendererProps) {
  const methods = useForm<Record<string, unknown>>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <form className="space-y-8 pb-32 relative">
        
        {/* HEADER FLUTUANTE DA SEÇÃO COM INDICADOR DE AUTOSAVE */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold tracking-tight">{schema.name}</h2>
          <AutosaveIndicator consultaId={consultaId} schema={schema} />
        </div>

        {schema.sections.map((section) => (
          <Card key={section.id} id={section.id} className="scroll-mt-24">
            {/* O Resto do componente mantém-se inalterado */}
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
              {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {section.fields.map((field) => (
                  <div key={field.id} className={`col-span-1 ${fieldColumnClassName[field.gridCols || 4]}`}>
                    <FieldRenderer field={field} sectionId={section.id} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </form>
    </FormProvider>
  );
}
