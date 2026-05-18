// Define os tipos de inputs suportados pelo nosso design system (shadcn)
export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'boolean' // Vai renderizar um Switch ou Checkbox
  | 'number' 
  | 'single_choice' // Select ou Radio Group
  | 'multi_choice' // Checkbox Group ou Multi-Select
  | 'date';

// Operadores para a nossa engine condicional
export type ConditionOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'greater_than' 
  | 'less_than' 
  | 'contains';

// A regra de dependência (ex: "se 'dorme_bem' equals false")
export interface Condition {
  dependsOn: string; // O ID do campo que vamos observar (useWatch)
  operator: ConditionOperator;
  value: string | number | boolean | Array<string | number | boolean>;
}

export interface Option {
  label: string;
  value: string | number | boolean;
}

// A estrutura de UMA pergunta
export interface Field {
  id: string; // Ex: 'acorda_cansado' (Usado como chave no JSONB)
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Option[]; // Usado apenas se for choice
  conditions?: Condition[]; // A mágica condicional acontece aqui
  gridCols?: 1 | 2 | 3 | 4; // Dica de UI para montar o grid responsivo
}

// O Macro Fixo (As abas/seções da consulta)
export interface Section {
  id: string; // Ex: 'sono', 'intestino'
  title: string;
  description?: string;
  fields: Field[]; // As perguntas dinâmicas desta seção
}

// O Schema completo que o sistema vai ler
export interface AnamneseSchema {
  version: string;
  sections: Section[];
}
