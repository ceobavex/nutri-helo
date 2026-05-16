// src/features/auth/actions/auth-actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function loginAction(data: { crn: string; regiao: string; senha: string }) {
  const supabase = await createClient();

  // 1. Usa a função segura (RPC) para descobrir o E-mail através do CRN
  const { data: email, error: rpcError } = await supabase.rpc("get_email_por_crn", {
    p_crn: data.crn,
    p_regiao: data.regiao,
  });

  if (rpcError || !email) {
    return { error: "Nenhum cadastro encontrado com este CRN e Região." };
  }

  // 2. Faz o login com o E-mail encontrado
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: email,
    password: data.senha,
  });

  if (authError) {
    return { error: "Senha incorreta." };
  }

  // Atualiza o cache da página e retorna sucesso
  revalidatePath("/", "layout");
  return { success: true };
}

export async function cadastroAction(data: any) {
  const supabase = await createClient();

  // 1. Cria o usuário no sistema de Autenticação do Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.senha,
  });

  if (authError) {
    if (authError.message.includes("already registered")) return { error: "Este e-mail já está cadastrado." };
    return { error: "Erro ao criar conta: " + authError.message };
  }

  if (!authData.user) {
    return { error: "Erro desconhecido ao gerar usuário." };
  }

  // 2. Salva os dados na tabela pública de nutricionistas
  const { error: dbError } = await supabase.from("nutricionistas").insert({
    id: authData.user.id,
    nome: data.nome,
    cpf: data.cpf,
    email: data.email,
    telefone: data.telefone,
    crn: data.crn,
    regiao: data.regiao,
    tipo_inscricao: "Pendente", // Valor padrão pois removemos do form
  });

  if (dbError) {
    // Se der erro de CRN/CPF duplicado, o banco avisa
    if (dbError.code === "23505") return { error: "Este CPF ou CRN já estão cadastrados." };
    return { error: "Erro ao salvar perfil: " + dbError.message };
  }

  return { success: true };
}