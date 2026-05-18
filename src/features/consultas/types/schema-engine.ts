// src/features/consultas/types/schema-engine.ts

export type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'single_choice' | 'multi_choice';
export type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'greater_than';

export interface Condition {
  dependsOn: string;     // ID do campo "pai"
  operator: ConditionOperator;
  value: string | number | boolean | Array<string | number | boolean>;
}

export interface SchemaOption {
  label: string;
  value: string | number | boolean;
}

export interface SchemaField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: SchemaOption[];
  
  // A Mágica Condicional
  conditions?: Condition[]; 
  
  // Inteligência Clínica (IA e Alertas)
  tags?: string[]; 
  priority?: 'low' | 'medium' | 'high' | 'critical'; 
  
  // Dicas para o Renderer (Semi-controlado)
  gridCols?: 1 | 2 | 3 | 4; 
  componentHint?: 'switch' | 'checkbox' | 'radio' | 'select'; 
}

export interface SchemaSection {
  id: string;
  title: string;
  description?: string;
  fields: SchemaField[];
}

export interface ClinicalSchema {
  id: string;         // Ex: 'padrao_adulto'
  version: string;    // Ex: 'v1.0.0'
  name: string;
  sections: SchemaSection[];
}
