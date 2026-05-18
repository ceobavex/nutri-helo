// src/features/auth/actions/auth-actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const cadastroSchema = z.object({
  nome: z.string().min(3),
  cpf: z.string().min(11).max(14),
  email: z.string().email(),
  telefone: z.string().min(10),
  crn: z.string().min(3),
  regiao: z.string().min(1),
  senha: z.string().min(6),
});

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

export async function cadastroAction(data: z.infer<typeof cadastroSchema>) {
  const supabase = await createClient();
  const parsed = cadastroSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Revise os dados do cadastro antes de continuar." };
  }

  const cadastro = parsed.data;

  // 1. Cria o usuário no sistema de Autenticação do Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: cadastro.email,
    password: cadastro.senha,
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
    nome: cadastro.nome,
    cpf: cadastro.cpf,
    email: cadastro.email,
    telefone: cadastro.telefone,
    crn: cadastro.crn,
    regiao: cadastro.regiao,
    tipo_inscricao: "Pendente", // Valor padrão pois removemos do form
  });

  if (dbError) {
    // Se der erro de CRN/CPF duplicado, o banco avisa
    if (dbError.code === "23505") return { error: "Este CPF ou CRN já estão cadastrados." };
    return { error: "Erro ao salvar perfil: " + dbError.message };
  }

  return { success: true };
}
