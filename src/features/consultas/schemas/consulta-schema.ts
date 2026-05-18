import { z } from 'zod';

// 1. Tipos de campos suportados pelo Renderer Semi-Controlado
export const FieldTypeSchema = z.enum([
  'text', 
  'textarea', 
  'number', 
  'boolean', 
  'single_choice', 
  'multi_choice'
]);

// 2. O Contrato do JSONB: Guardamos Pergunta + Resposta (Blindado)
export const ClinicalFieldSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.unknown(), // Será inferido no frontend, mas no banco aceita a resposta real
  type: FieldTypeSchema,
  labels: z.array(z.string()).optional(), // Ex: ["Ansiedade Alta", "Acorda de Madrugada"]
});

// 3. O Snapshot Imutável do Paciente (O estado dele no dia da consulta)
export const PacienteSnapshotSchema = z.object({
  nome: z.string(),
  idade: z.number(),
  peso_base: z.number().optional(),
  objetivo_principal: z.string().optional(),
});

// 4. O Schema Híbrido da Tabela Consultas
export const ConsultaDatabaseSchema = z.object({
  id: z.string().uuid(),
  paciente_id: z.string().uuid(),
  nutricionista_id: z.string().uuid(),
  
  status: z.enum(['rascunho', 'concluida', 'cancelada']),
  data_inicio: z.string().datetime(),
  data_fim: z.string().datetime().nullable().optional(),
  
  // Versionamento e Snapshot
  schema_id: z.string(),
  schema_version: z.string(),
  paciente_snapshot: PacienteSnapshotSchema,

  // Métricas Estruturais (Filtros, Analytics, IA)
  peso: z.number().nullable().optional(),
  altura: z.number().nullable().optional(),
  imc: z.number().nullable().optional(),
  gordura_corporal_pct: z.number().nullable().optional(),
  massa_magra_kg: z.number().nullable().optional(),
  circunferencia_abdominal: z.number().nullable().optional(),
  pressao_sistolica: z.number().int().nullable().optional(),
  pressao_diastolica: z.number().int().nullable().optional(),

  // Dados Clínicos Dinâmicos (Separados por seções)
  // Record<ID_DA_SECAO, Record<ID_DA_PERGUNTA, ESTRUTURA_DA_PERGUNTA>>
  dados_clinicos: z.record(
    z.string(), 
    z.record(z.string(), ClinicalFieldSchema)
  ),

  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ==========================================
// EXPORT DOS TYPES INFERIDOS PARA O SISTEMA
// ==========================================
export type FieldType = z.infer<typeof FieldTypeSchema>;
export type ClinicalField = z.infer<typeof ClinicalFieldSchema>;
export type PacienteSnapshot = z.infer<typeof PacienteSnapshotSchema>;
export type ConsultaModel = z.infer<typeof ConsultaDatabaseSchema>;