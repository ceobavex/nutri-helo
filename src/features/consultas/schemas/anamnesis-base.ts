import { AnamneseSchema } from '../types/anamnesis';

export const anamneseBaseSchema: AnamneseSchema = {
  version: '1.0.0',
  sections: [
    {
      id: 'queixa_principal',
      title: 'Queixa Principal e Objetivos',
      fields: [
        {
          id: 'motivo_consulta',
          type: 'textarea',
          label: 'Qual o principal motivo da consulta hoje?',
          required: true,
          gridCols: 4,
        },
      ],
    },
    {
      id: 'sono',
      title: 'Qualidade do Sono',
      description: 'Avaliação do ciclo circadiano e recuperação.',
      fields: [
        {
          id: 'dorme_bem',
          type: 'boolean',
          label: 'Considera que dorme bem?',
          required: true,
          gridCols: 4,
        },
        // PERGUNTA DINÂMICA: Só aparece se 'dorme_bem' for FALSE
        {
          id: 'problemas_sono',
          type: 'multi_choice',
          label: 'Quais as principais dificuldades?',
          options: [
            { label: 'Demora a pegar no sono', value: 'insonia_inicial' },
            { label: 'Acorda de madrugada', value: 'despertar_noturno' },
            { label: 'Acorda cansado (sono não reparador)', value: 'cansaco_matinal' },
          ],
          conditions: [
            {
              dependsOn: 'dorme_bem',
              operator: 'equals',
              value: false, // Dispara aqui
            },
          ],
          gridCols: 4,
        },
        {
          id: 'horas_sono',
          type: 'number',
          label: 'Média de horas de sono',
          placeholder: 'Ex: 7',
          gridCols: 2,
        },
      ],
    },
    {
      id: 'intestino',
      title: 'Saúde Intestinal',
      fields: [
        {
          id: 'frequencia_evacuacao',
          type: 'single_choice',
          label: 'Frequência de evacuação',
          options: [
            { label: '1 a 2 vezes ao dia', value: 'normal' },
            { label: 'A cada 2-3 dias', value: 'lento' },
            { label: 'Mais de 3 dias', value: 'constipado' },
            { label: 'Mais de 3 vezes ao dia / Diarreia', value: 'acelerado' },
          ],
          gridCols: 4,
        },
      ],
    },
  ],
};