import { ClinicalSchema } from '../types/schema-engine';

export const schemaPadraoV1: ClinicalSchema = {
  id: 'padrao_adulto',
  version: '1.0.0',
  name: 'Anamnese Clínica Padrão - Adultos',
  sections: [
    {
      id: 'objetivos',
      title: 'Queixa e Objetivos',
      fields: [
        {
          id: 'motivo_consulta',
          type: 'textarea',
          label: 'Qual o principal motivo da consulta hoje?',
          required: true,
          gridCols: 4,
          tags: ['contexto_principal']
        }
      ]
    },
    {
      id: 'historico_patologico',
      title: 'Histórico Patológico',
      description: 'Investigação de doenças pré-existentes e risco clínico.',
      fields: [
        {
          id: 'possui_doenca_cronica',
          type: 'boolean',
          label: 'Possui alguma doença crônica diagnosticada?',
          required: true,
          gridCols: 4,
          componentHint: 'switch',
          tags: ['rastreio_doenca']
        },
        // --- PERGUNTA CONDICIONAL ---
        {
          id: 'doencas_cronicas_selecionadas',
          type: 'multi_choice',
          label: 'Quais doenças?',
          options: [
            { label: 'Diabetes (Tipo 1 ou 2)', value: 'diabetes' },
            { label: 'Hipertensão', value: 'hipertensao' },
            { label: 'Hipotireoidismo', value: 'hipotireoidismo' },
            { label: 'Esteatose Hepática', value: 'esteatose' }
          ],
          conditions: [
            {
              dependsOn: 'possui_doenca_cronica',
              operator: 'equals',
              value: true
            }
          ],
          gridCols: 4,
          priority: 'high',
          tags: ['risco_clinico', 'metabolico']
        },
        {
          id: 'uso_medicamentos',
          type: 'boolean',
          label: 'Faz uso de medicamentos contínuos?',
          required: true,
          gridCols: 4,
          componentHint: 'switch'
        },
        // --- PERGUNTA CONDICIONAL ---
        {
          id: 'lista_medicamentos',
          type: 'textarea',
          label: 'Liste os medicamentos e dosagens',
          placeholder: 'Ex: Losartana 50mg, Metformina 500mg...',
          conditions: [
            {
              dependsOn: 'uso_medicamentos',
              operator: 'equals',
              value: true
            }
          ],
          gridCols: 4,
          priority: 'medium',
          tags: ['interacao_droga_nutriente']
        }
      ]
    },
    {
      id: 'trato_gastrointestinal',
      title: 'Trato Gastrointestinal',
      fields: [
        {
          id: 'frequencia_evacuacao',
          type: 'single_choice',
          label: 'Frequência de evacuação',
          options: [
            { label: '1 a 2 vezes ao dia', value: 'ideal' },
            { label: 'A cada 2-3 dias', value: 'lento' },
            { label: 'Mais de 3 dias (Constipação)', value: 'constipacao' }
          ],
          gridCols: 2,
          componentHint: 'select',
          tags: ['microbiota', 'digestao']
        },
        {
          id: 'sintomas_gastro',
          type: 'multi_choice',
          label: 'Apresenta algum destes sintomas após as refeições?',
          options: [
            { label: 'Estufamento (Distensão abdominal)', value: 'estufamento' },
            { label: 'Azia ou Refluxo', value: 'azia' },
            { label: 'Gases excessivos', value: 'gases' }
          ],
          gridCols: 4,
          tags: ['disbiose']
        }
      ]
    }
  ]
};