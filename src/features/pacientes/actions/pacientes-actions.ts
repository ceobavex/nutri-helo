"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { PacienteFormValues, pacienteSchema } from "../types";

export async function cadastrarPaciente(data: PacienteFormValues) {
  try {
    const supabase = await createClient();

    // 1. Validar quem está logado
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { error: "Usuário não autenticado." };
    }

    // 2. Validar os dados do formulário com Zod
    const validData = pacienteSchema.parse(data);

    // 3. Limpar formatações (remover traços e pontos)
    const cpfLimpo = validData.cpf.replace(/\D/g, "");
    const telefoneLimpo = validData.telefone.replace(/\D/g, "");

    // 4. Salvar no Supabase
    const { data: paciente, error } = await supabase
      .from("pacientes")
      .insert({
        nutricionista_id: userData.user.id,
        nome: validData.nome,
        data_nascimento: validData.dataNascimento,
        sexo: validData.sexo,
        cpf: cpfLimpo,
        email: validData.email || null,
        telefone: telefoneLimpo,
        objetivo_principal: validData.objetivoPrincipal,
        objetivos_secundarios: validData.objetivosSecundarios,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Erro de violação "Unique"
        return { error: "Já existe um paciente cadastrado com este CPF." };
      }
      return { error: "Erro ao cadastrar paciente. Tente novamente." };
    }

    // Atualiza a interface (Lista de pacientes e dashboard)
    revalidatePath("/pacientes");
    revalidatePath("/");
    
    return { success: true, paciente };
  } catch (err: unknown) {
    console.error("Erro interno:", err);
    return { error: "Ocorreu um erro inesperado ao processar o cadastro." };
  }
}

export async function buscarPacientes() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("pacientes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar pacientes:", error);
    return [];
  }

  return data;
}
