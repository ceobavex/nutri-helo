import { ClinicalSchema } from '../types/schema-engine';

export const schemaEstresseV1: ClinicalSchema = {
  id: 'teste_estresse',
  version: '1.0.0',
  name: 'Schema de Validação (Condition Chains)',
  sections: [
    {
      id: 'chain_test',
      title: 'Teste de Dependência em Cascata',
      description: 'Valida se A abre B, e B abre C corretamente.',
      fields: [
        {
          // NÍVEL A
          id: 'sente_dor',
          type: 'boolean',
          label: 'Sente dor com frequência?',
          componentHint: 'switch',
          gridCols: 4
        },
        {
          // NÍVEL B (Depende de A)
          id: 'local_dor',
          type: 'single_choice',
          label: 'Onde é a dor?',
          options: [
            { label: 'Cabeça', value: 'cabeca' },
            { label: 'Articulações', value: 'articulacoes' },
            { label: 'Muscular', value: 'muscular' }
          ],
          conditions: [{ dependsOn: 'sente_dor', operator: 'equals', value: true }],
          gridCols: 4
        },
        {
          // NÍVEL C (Depende de B)
          id: 'dor_articulacao_detalhe',
          type: 'multi_choice',
          label: 'Quais articulações?',
          options: [
            { label: 'Joelhos', value: 'joelhos' },
            { label: 'Ombros', value: 'ombros' },
            { label: 'Mãos', value: 'maos' }
          ],
          conditions: [{ dependsOn: 'local_dor', operator: 'equals', value: 'articulacoes' }],
          gridCols: 4
        }
      ]
    }
  ]
};