'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ClinicalSchema } from '../../types/schema-engine';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';

interface SidebarClinicaNavProps {
  schema: ClinicalSchema;
}

export function SidebarClinicaNav({ schema }: SidebarClinicaNavProps) {
  const { watch } = useFormContext();
  const [activeSection, setActiveSection] = useState(schema.sections[0]?.id);
  const formValues = watch();

  // Calcula o status de progresso de cada seção dinamicamente
  const getSectionStatus = (sectionId: string) => {
    const sectionValues = formValues[sectionId];
    if (!sectionValues) return 'empty';

    // Pega todas as perguntas respondidas na seção
    const totalFields = Object.keys(sectionValues);
    const answeredFields = totalFields.filter(
      (key) => sectionValues[key]?.answer !== undefined && sectionValues[key]?.answer !== ''
    );

    if (answeredFields.length === 0) return 'empty';
    if (answeredFields.length === totalFields.length) return 'completed';
    return 'in_progress';
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <aside className="hidden h-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 xl:flex xl:flex-col">
      <div>
        <div className="px-2 py-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Progresso
          </p>
          <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Fluxo da consulta
          </h3>
        </div>

        <nav className="mt-3 space-y-1">
            {schema.sections.map((section) => {
              const status = getSectionStatus(section.id);
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "group w-full rounded-xl px-3 py-3 text-left transition-colors",
                    isActive 
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-300" 
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs",
                        isActive
                          ? "border-emerald-200 bg-white text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950"
                          : "border-zinc-200 bg-white text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
                      )}
                    >
                      {status === 'completed' && <CheckCircle2 className="size-4 text-emerald-600" />}
                      {status === 'in_progress' && <AlertCircle className="size-4 text-amber-500" />}
                      {status === 'empty' && <Circle className="size-3.5" />}
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{section.title}</span>
                      <span className="mt-0.5 block text-xs text-zinc-400">
                        {status === 'completed' && 'Completo'}
                        {status === 'in_progress' && 'Em andamento'}
                        {status === 'empty' && 'Pendente'}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
        </nav>
      </div>

      <div className="mt-auto rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        <p className="font-semibold text-zinc-700 dark:text-zinc-200">Motor clínico</p>
        <p className="mt-1">Schema v{schema.version}</p>
      </div>
    </aside>
  );
}
