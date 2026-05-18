'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { ClinicalSchema } from '../../types/schema-engine';
import { SidebarClinicaNav } from './SidebarClinicaNav';
import { PainelContextoLateral } from './PainelContextoLateral';
import { FieldRenderer } from '../dynamic-form/FieldRenderer';
import { useAutosave } from '../dynamic-form/hooks/useAutosave';
import { CheckCircle2, Clock3, Loader2, ShieldCheck } from 'lucide-react';

interface ConsultaWorkspaceProps {
  consultaId: string;
  pacienteId: string;
  pacienteNome: string;
  schema: ClinicalSchema;
  initialValues?: Record<string, unknown>;
}

const fieldColumnClassName = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
} as const;

function AutosaveIndicator({
  consultaId,
  schema,
}: {
  consultaId: string;
  schema: ClinicalSchema;
}) {
  const { status, lastSavedAt } = useAutosave(consultaId, schema, 2000);

  return (
    <div className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
      {status === 'idle' && (
        <>
          <Clock3 className="size-3.5" />
          Pronto para salvar
        </>
      )}
      {status === 'saving' && (
        <>
          <Loader2 className="size-3.5 animate-spin text-emerald-600" />
          Sincronizando
        </>
      )}
      {status === 'saved' && (
        <>
          <CheckCircle2 className="size-3.5 text-emerald-600" />
          Salvo às {lastSavedAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </>
      )}
      {status === 'error' && <span className="text-red-500">Erro de rede</span>}
    </div>
  );
}

export function ConsultaWorkspace({
  consultaId,
  pacienteId,
  pacienteNome,
  schema,
  initialValues = {},
}: ConsultaWorkspaceProps) {
  const methods = useForm<Record<string, unknown>>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <div className="fixed inset-x-0 bottom-0 top-20 z-20 flex flex-col overflow-hidden bg-zinc-50/70 dark:bg-black md:left-64">
        
        <header className="shrink-0 border-b border-zinc-200/80 bg-white/90 px-8 py-5 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/85">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                <ShieldCheck className="size-4" />
                Atendimento ativo
              </div>

              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {schema.name}
                </h1>
                <span className="text-sm font-medium text-zinc-500">
                  {pacienteNome}
                </span>
                <span className="text-xs font-medium text-zinc-400">
                  #{pacienteId.slice(0, 8)}
                </span>
              </div>
            </div>
            
            <div className="flex shrink-0 items-center gap-3">
              <AutosaveIndicator consultaId={consultaId} schema={schema} />
              <button className="h-10 rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
                Finalizar consulta
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto grid min-h-0 w-full max-w-[1500px] flex-1 grid-cols-1 gap-6 px-8 py-8 xl:grid-cols-[240px_minmax(0,1fr)_340px]">
          <SidebarClinicaNav schema={schema} />

          <main className="min-h-0 min-w-0 overflow-y-auto pr-1">
            <form className="space-y-5 pb-10">
              {schema.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900"
                >
                  <div className="border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
                    <h2 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                      {section.title}
                    </h2>
                    {section.description && (
                      <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                        {section.description}
                      </p>
                    )}
                  </div>

                  <div className="px-6 py-6">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                      {section.fields.map((field) => (
                        <div
                          key={field.id}
                          className={`animate-in fade-in slide-in-from-top-1 duration-200 ${fieldColumnClassName[field.gridCols || 4]}`}
                        >
                          <FieldRenderer field={field} sectionId={section.id} />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </form>
          </main>

          <PainelContextoLateral />
        </div>
      </div>
    </FormProvider>
  );
}
