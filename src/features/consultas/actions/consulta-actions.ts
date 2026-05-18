'use server';

import { createClient } from '@/lib/supabase/server';
import { ConsultaModel, ClinicalField } from '../schemas/consulta-schema';

type ConsultaUpdateData = Partial<
  Pick<
    ConsultaModel,
    | 'dados_clinicos'
    | 'peso'
    | 'altura'
    | 'imc'
    | 'pressao_sistolica'
    | 'pressao_diastolica'
  >
>;

export type AutosavePayload = {
  consulta_id: string;
  // Recebe o JSON estruturado gerado pelo React Hook Form
  dados_clinicos?: Record<string, Record<string, ClinicalField>>;
  // Se futuramente atualizarmos peso/imc na mesma tela, já está pronto
  metricas_atualizadas?: Partial<Pick<ConsultaModel, 'peso' | 'altura' | 'imc' | 'pressao_sistolica' | 'pressao_diastolica'>>;
};

export async function autosaveConsulta(payload: AutosavePayload) {
  const supabase = await createClient();

  // 1. Monta apenas o que foi enviado para não sobrescrever dados vazios
  const updateData: ConsultaUpdateData = {};
  
  if (payload.dados_clinicos) {
    updateData.dados_clinicos = payload.dados_clinicos;
  }
  
  if (payload.metricas_atualizadas) {
    Object.assign(updateData, payload.metricas_atualizadas);
  }

  // Se não há o que atualizar, retorna sucesso silencioso
  if (Object.keys(updateData).length === 0) return { success: true };

  // 2. Faz o PATCH no banco
  const { error } = await supabase
    .from('consultas')
    .update(updateData)
    .eq('id', payload.consulta_id);

  if (error) {
    console.error('Erro no autosave da consulta:', error);
    throw new Error('Falha ao sincronizar com o servidor.');
  }

  return { success: true, timestamp: new Date().toISOString() };
}
