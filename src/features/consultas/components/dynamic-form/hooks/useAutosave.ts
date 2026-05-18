import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { autosaveConsulta } from '../../../actions/consulta-actions';
import { ClinicalSchema } from '../../../types/schema-engine';
import { buildClinicalPayload } from '../utils/buildClinicalPayload';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type RawFormValues = Record<string, Record<string, { answer?: unknown } | undefined> | undefined>;

export function useAutosave(consultaId: string, schema: ClinicalSchema, debounceMs = 2000) {
  const { watch, getValues } = useFormContext<RawFormValues>();
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Monitoriza TODO o estado do formulário. 
  // (Como usamos React Hook Form, isso devolve exatamente o objeto aninhado das seções)
  const formValues = watch(); 
  
  // Referência para limpar o timeout (O segredo do Debounce)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Evita salvar no primeiro render se o formulário estiver vazio
    if (!formValues || Object.keys(formValues).length === 0) return;

    // Se a nutri continuar a digitar, cancelamos o "save" anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Criamos um novo agendamento de salvamento para daqui a 'debounceMs'
    timeoutRef.current = setTimeout(async () => {
      try {
        setStatus('saving');

        await autosaveConsulta({
          consulta_id: consultaId,
          dados_clinicos: buildClinicalPayload(schema, getValues()),
        });
        
        setStatus('saved');
        setLastSavedAt(new Date());
      } catch (error) {
        console.error('Falha no Autosave', error);
        setStatus('error');
      }
    }, debounceMs);

    // Cleanup: Se o componente for desmontado (ex: trocou de página), limpa o timeout
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [formValues, consultaId, debounceMs, getValues, schema]);

  return { status, lastSavedAt };
}
