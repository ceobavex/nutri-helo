import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Phone,
  Mail,
  Activity,
  FileText,
  TrendingUp,
  Utensils,
  ClipboardList,
  FlaskConical,
  Scale,
  Ruler,
  HeartPulse,
  Clock,
  MapPin,
  ChevronRight,
  MoreHorizontal,
  Star,
  Download,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

function calcularIdade(dataNascimento: string) {
  const birthDate = new Date(dataNascimento);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const m = today.getMonth() - birthDate.getMonth();

  if (
    m < 0 ||
    (m === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

const prontuarioTabTriggerClassName =
  "h-16 min-w-[10rem] gap-3 rounded-2xl px-5 text-[15px] font-semibold text-zinc-500 shadow-none transition-all hover:bg-zinc-50 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-200 data-[state=active]:bg-emerald-50/80 data-[state=active]:text-emerald-600 data-[state=active]:shadow-none data-[state=active]:after:opacity-100 data-active:bg-emerald-50/80 data-active:text-emerald-600 data-active:shadow-none data-active:after:opacity-100 dark:data-[state=active]:bg-emerald-950/35 dark:data-[state=active]:text-emerald-400 dark:data-active:bg-emerald-950/35 dark:data-active:text-emerald-400 after:absolute after:left-1/2 after:right-auto after:-bottom-[19px] after:h-1.5 after:w-20 after:-translate-x-1/2 after:rounded-full after:bg-emerald-500 after:opacity-0 after:shadow-[0_4px_12px_rgba(16,185,129,0.32)] group-data-horizontal/tabs:after:left-1/2 group-data-horizontal/tabs:after:right-auto group-data-horizontal/tabs:after:-bottom-[19px] group-data-horizontal/tabs:after:h-1.5 group-data-horizontal/tabs:after:w-20";

export default async function PacientePerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: paciente, error } = await supabase
    .from("pacientes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !paciente) {
    notFound();
  }

  const idade = calcularIdade(paciente.data_nascimento);

  const avatarUrl =
    paciente.sexo === "FEMININO"
      ? "https://api.dicebear.com/7.x/notionists/svg?seed=Jocelyn&backgroundColor=e6f6f1"
      : "https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e6f6f1";

  return (
    <div className="w-full min-h-screen flex flex-col space-y-6 animate-in fade-in duration-500 pb-12">

      {/* TOPO */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] text-zinc-500 font-medium">
          <Link
            href="/pacientes"
            className="hover:text-emerald-600 transition-colors"
          >
            Pacientes
          </Link>

          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />

          <span className="text-zinc-900 dark:text-zinc-100">
            {paciente.nome}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-9 px-4 rounded-xl border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 transition-all"
        >
          <MoreHorizontal className="w-4 h-4 mr-1.5" />
          Opções
        </Button>
      </div>

      {/* HEADER */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm">

        {/* Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-100/40 dark:bg-emerald-900/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">

          {/* AVATAR */}
          <div className="relative shrink-0">

            <div className="h-24 w-24 rounded-full overflow-hidden border-[4px] border-white dark:border-zinc-950 shadow-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">

              <img
                src={avatarUrl}
                alt={paciente.nome}
                className="w-full h-full object-cover scale-110"
                draggable={false}
              />

            </div>

            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white dark:border-zinc-900 bg-emerald-500" />
          </div>

          {/* INFO */}
          <div className="flex-1 min-w-0">

            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">

              <div className="min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 truncate">
                  {paciente.nome}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-zinc-500 dark:text-zinc-400">

                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>{idade} anos</span>
                  </div>

                  <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />

                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>Brasil</span>
                  </div>

                </div>
              </div>

              <Badge className="rounded-xl px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400 shadow-sm">
                <Star className="w-3.5 h-3.5 mr-1.5 fill-emerald-600" />
                {paciente.objetivo_principal}
              </Badge>
            </div>

            {/* CONTATOS */}
            <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-x-6 gap-y-3">

              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Phone className="w-4 h-4 text-zinc-400" />
                {paciente.telefone.replace(
                  /(\d{2})(\d{5})(\d{4})/,
                  "($1) $2-$3"
                )}
              </div>

              {paciente.email && (
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  {paciente.email}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
                <Calendar className="w-4 h-4 text-zinc-400" />
                Cadastrado em{" "}
                {new Date(
                  paciente.data_cadastro
                ).toLocaleDateString("pt-BR", {
                  month: "short",
                  year: "numeric",
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* PESO */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
              Peso Atual
            </p>

            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              --
            </span>

            <span className="text-sm text-zinc-400 mb-1">
              kg
            </span>
          </div>
        </div>

        {/* IMC */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
              IMC
            </p>

            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <HeartPulse className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            --
          </span>
        </div>

        {/* ALTURA */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
              Altura
            </p>

            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30">
              <Ruler className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              --
            </span>

            <span className="text-sm text-zinc-400 mb-1">
              m
            </span>
          </div>
        </div>

        {/* CONSULTA */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
              Últ. Consulta
            </p>

            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {paciente.ultima_consulta
              ? new Date(
                  paciente.ultima_consulta
                ).toLocaleDateString("pt-BR")
              : "Aguardando"}
          </span>
        </div>
      </div>

      {/* TABS */}
      <Tabs defaultValue="visao-geral" className="w-full">

        <div className="overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="relative grid h-auto min-h-[5.75rem] min-w-max w-full grid-flow-col auto-cols-[minmax(10rem,1fr)] items-center gap-4 overflow-visible rounded-[1.35rem] border border-zinc-200/80 bg-white px-4 py-3 shadow-[0_14px_30px_-22px_rgba(24,24,27,0.75),0_3px_12px_rgba(24,24,27,0.06)] group-data-horizontal/tabs:h-auto dark:border-zinc-800/80 dark:bg-zinc-900">

            <TabsTrigger
              value="visao-geral"
              className={prontuarioTabTriggerClassName}
            >
              <Activity className="size-5" />
              Visão Geral
            </TabsTrigger>

            <TabsTrigger
              value="anamnese"
              className={prontuarioTabTriggerClassName}
            >
              <FileText className="size-5" />
              Anamnese
            </TabsTrigger>

            <TabsTrigger
              value="evolucao"
              className={prontuarioTabTriggerClassName}
            >
              <TrendingUp className="size-5" />
              Evolução
            </TabsTrigger>

            <TabsTrigger
              value="dietas"
              className={prontuarioTabTriggerClassName}
            >
              <Utensils className="size-5" />
              Dietas
            </TabsTrigger>

            <TabsTrigger
              value="consultas"
              className={prontuarioTabTriggerClassName}
            >
              <ClipboardList className="size-5" />
              Consultas
            </TabsTrigger>

            <TabsTrigger
              value="exames"
              className={prontuarioTabTriggerClassName}
            >
              <FlaskConical className="size-5" />
              Exames
            </TabsTrigger>

          </TabsList>
        </div>

        {/* VISÃO GERAL */}
        <div className="mt-6">

          <TabsContent
            value="visao-geral"
            className="m-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

              {/* CARD GRANDE */}
              <div className="xl:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm min-h-[340px]">

                <div className="flex items-center justify-between mb-6">

                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      Evolução Corporal
                    </h3>

                    <p className="text-sm text-zinc-500 mt-1">
                      Histórico de Peso e IMC
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Relatório
                  </Button>

                </div>

                <div className="h-[230px] rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-black/20">

                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                    <TrendingUp className="w-5 h-5 text-zinc-400" />
                  </div>

                  <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Nenhum dado registrado
                  </p>

                  <p className="text-sm text-zinc-500 mt-1 text-center max-w-[280px]">
                    Os gráficos de evolução aparecerão aqui após a primeira consulta.
                  </p>

                </div>
              </div>

              {/* STATUS */}
              <div className="space-y-5">

                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm">

                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Status do Paciente
                  </h3>

                  <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 p-4">

                    <p className="text-sm italic leading-relaxed text-zinc-500 dark:text-zinc-400">
                      Paciente cadastrado e aguardando primeira avaliação nutricional e anamnese.
                    </p>

                  </div>

                  <Button className="w-full mt-5 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    Iniciar Nova Consulta
                  </Button>
                </div>

                {paciente.objetivos_secundarios &&
                  paciente.objetivos_secundarios.length > 0 && (

                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm">

                      <h3 className="text-sm font-bold mb-4">
                        Metas Complementares
                      </h3>

                      <div className="flex flex-wrap gap-2">

                        {paciente.objetivos_secundarios.map(
                          (obj: string) => (
                            <Badge
                              key={obj}
                              variant="outline"
                              className="rounded-lg"
                            >
                              {obj}
                            </Badge>
                          )
                        )}

                      </div>
                    </div>
                  )}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="anamnese"
            className="m-0 h-[300px] rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-500"
          >
            Módulo de Anamnese Dinâmica
          </TabsContent>

          <TabsContent
            value="evolucao"
            className="m-0 h-[300px] rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-500"
          >
            Evolução Corporal
          </TabsContent>

          <TabsContent
            value="dietas"
            className="m-0 h-[300px] rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-500"
          >
            Gerenciador de Dietas
          </TabsContent>

          <TabsContent
            value="consultas"
            className="m-0 h-[300px] rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-500"
          >
            Histórico de Consultas
          </TabsContent>

          <TabsContent
            value="exames"
            className="m-0 h-[300px] rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-500"
          >
            Exames Laboratoriais
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
