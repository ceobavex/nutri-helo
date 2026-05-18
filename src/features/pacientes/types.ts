import { z } from "zod";

// Schema para o Modal de Cadastro de Paciente
export const pacienteSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 letras"),
  dataNascimento: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data de nascimento inválida",
  }),
  sexo: z.enum(["MASCULINO", "FEMININO"], {
    message: "Selecione o sexo do paciente",
  }),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  
  // Ajuste sutil aqui (or(z.literal("")).optional() no final)
  email: z.string().email("E-mail inválido").or(z.literal("")).optional(),
  
  telefone: z.string().min(10, "Telefone inválido"),
  objetivoPrincipal: z.string().min(2, "Selecione o objetivo principal"),
  
  // Removido o .default([]) para evitar conflito de Input/Output do Hook Form
  objetivosSecundarios: z.array(z.string()), 
});

export type PacienteFormValues = z.infer<typeof pacienteSchema>;

// Tipagem de retorno do Banco de Dados
export type Paciente = {
  id: string;
  nutricionista_id: string;
  nome: string;
  data_nascimento: string;
  sexo: string;
  cpf: string;
  email: string | null;
  telefone: string | null;
  objetivo_principal: string;
  objetivos_secundarios: string[];
  data_cadastro: string;
  ultima_consulta: string | null;
};