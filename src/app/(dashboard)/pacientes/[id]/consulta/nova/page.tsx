import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ConsultaWorkspace } from '@/features/consultas/components/layout/ConsultaWorkspace';
import { schemaPadraoV1 } from '@/features/consultas/schemas/schema-padrao-v1';
import { PacienteSnapshot } from '@/features/consultas/schemas/consulta-schema';

// Helper simples para o snapshot
function calcularIdade(dataNascimento: string) {
  if (!dataNascimento) return 0;
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
    idade--;
  }
  return idade;
}

function formatSupabaseError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return error;
  }

  const propertyNames = Object.getOwnPropertyNames(error);
  const entries = propertyNames.map((key) => {
    const value = (error as Record<string, unknown>)[key];
    return [key, value instanceof Error ? value.message : value];
  });

  return {
    name: error.constructor.name,
    text: String(error),
    ...Object.fromEntries(entries),
  };
}

function getSupabaseErrorCode(error: unknown) {
  if (!error || typeof error !== 'object') {
    return null;
  }

  return (error as { code?: string }).code ?? null;
}

function ConfiguracaoBancoPendente({ pacienteId }: { pacienteId: string }) {
  return (
    <div className="flex min-h-[520px] items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-amber-200 bg-white p-8 shadow-sm dark:border-amber-900/60 dark:bg-zinc-900">
        <div className="mb-4 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          Configuração do banco pendente
        </div>

        <h1 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">
          A tabela de consultas ainda está bloqueando novos rascunhos.
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          O Supabase retornou erro de RLS ao criar a consulta. Execute a migration
          abaixo no SQL Editor do Supabase e tente iniciar a consulta novamente.
        </p>

        <code className="mt-5 block rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          supabase/migrations/20260518001000_consultas_rls.sql
        </code>

        <Link
          href={`/pacientes/${pacienteId}`}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Voltar ao prontuário
        </Link>
      </div>
    </div>
  );
}

export default async function NovaConsultaPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Desestruturação assíncrona exigida pelo Next.js 15+
  const { id: pacienteId } = await params;
  
  const supabase = await createClient();

  // 1. Validar Autenticação (Server-Side OBRIGATÓRIO)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 2. Buscar Dados Base do Paciente (Para o Snapshot e validação)
  const { data: paciente, error: pacienteError } = await supabase
    .from('pacientes')
    .select('nome, data_nascimento, objetivo_principal, nutricionista_id')
    .eq('id', pacienteId)
    .single();

  if (pacienteError || !paciente) {
    redirect('/pacientes'); // Proteção: Paciente não existe
  }

  // Proteção: Nutricionista só atende os seus próprios pacientes (RLS faz isto no banco, mas garantimos na UI)
  if (paciente.nutricionista_id !== user.id) {
    redirect('/pacientes');
  }

  // 3. Lógica do Rascunho Inteligente: Já existe uma consulta em aberto hoje?
  const { data: rascunho } = await supabase
    .from('consultas')
    .select('id, dados_clinicos, schema_id')
    .eq('paciente_id', pacienteId)
    .eq('nutricionista_id', user.id)
    .eq('status', 'rascunho')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let consultaId = '';
  let initialValues = {};

  if (rascunho) {
    // 4A. REAPROVEITA O RASCUNHO (Retoma o atendimento)
    consultaId = rascunho.id;
    initialValues = rascunho.dados_clinicos || {};
  } else {
    // 4B. CRIA UMA NOVA CONSULTA (Snapshot e Persistência Inicial)
    consultaId = randomUUID();

    const snapshot: PacienteSnapshot = {
      nome: paciente.nome,
      idade: calcularIdade(paciente.data_nascimento),
      objetivo_principal: paciente.objetivo_principal || 'Não informado',
    };

    const { error: insertError } = await supabase
      .from('consultas')
      .insert({
        id: consultaId,
        paciente_id: pacienteId,
        nutricionista_id: user.id,
        status: 'rascunho', // ENUM real
        data_inicio: new Date().toISOString(),
        schema_id: schemaPadraoV1.id,
        schema_version: schemaPadraoV1.version,
        paciente_snapshot: snapshot,
        dados_clinicos: {}, // JSONB vazio inicial
      });

    if (insertError) {
      if (getSupabaseErrorCode(insertError) === '42501') {
        return <ConfiguracaoBancoPendente pacienteId={pacienteId} />;
      }

      console.error('Erro ao iniciar consulta:', formatSupabaseError(insertError));
      throw new Error('Falha ao iniciar o ambiente clínico.');
    }
  }

  // 5. Orquestração final: Passa o testemunho para o Client Component (O Cockpit)
  return (
    <ConsultaWorkspace
      consultaId={consultaId}
      pacienteId={pacienteId}
      pacienteNome={paciente.nome}
      schema={schemaPadraoV1}
      initialValues={initialValues}
    />
  );
}
