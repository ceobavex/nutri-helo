'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAutosave } from './hooks/useAutosave';
import { Bug, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClinicalSchema } from '../../types/schema-engine';

interface ClinicalDebugPanelProps {
  consultaId: string;
  schema: ClinicalSchema;
}

export function ClinicalDebugPanel({ consultaId, schema }: ClinicalDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { watch, formState: { errors } } = useFormContext();
  const { status, lastSavedAt } = useAutosave(consultaId, schema, 2000);
  
  // Observa todo o formulário em tempo real
  const formValues = watch();

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-all"
        title="Modo Debug Clínico"
      >
        <Bug className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-96 max-h-[80vh] bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg shadow-2xl overflow-hidden flex flex-col border border-slate-800">
      <div className="flex justify-between items-center p-3 border-b border-slate-800 bg-slate-900">
        <span className="font-bold flex items-center gap-2">
          <Bug className="h-4 w-4" /> Motor Clínico (Debug)
        </span>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="p-3 overflow-y-auto flex-1 space-y-4">
        <div>
          <strong className="text-white">Autosave Engine:</strong>
          <div className="mt-1 flex items-center gap-2">
            Status: <span className={cn(
              status === 'saving' && "text-amber-400 animate-pulse",
              status === 'saved' && "text-emerald-400",
              status === 'error' && "text-red-400"
            )}>{status.toUpperCase()}</span>
          </div>
          {lastSavedAt && <div>Último patch: {lastSavedAt.toISOString()}</div>}
        </div>

        <div>
          <strong className="text-white">JSON Payload (dados_clinicos):</strong>
          <pre className="mt-1 bg-slate-900 p-2 rounded overflow-x-auto">
            {JSON.stringify(formValues, null, 2)}
          </pre>
        </div>

        {Object.keys(errors).length > 0 && (
          <div>
            <strong className="text-red-400">RHF Errors:</strong>
            <pre className="mt-1 text-red-300 bg-slate-900 p-2 rounded">
              {JSON.stringify(errors, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
