import { Search, MoreHorizontal, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PacienteModal } from "@/features/pacientes/components/paciente-modal";
import { buscarPacientes } from "@/features/pacientes/actions/pacientes-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PacientesPage() {
  const pacientes = await buscarPacientes();

  return (
    <div className="w-full h-full flex flex-col space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Cabeçalho Sofisticado e Premium */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          {/* Título com Marcador de Design Minimalista e Degradê Elegante */}
          <div className="flex items-center gap-3">
            <div className="h-7 w-1 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-950 via-zinc-800 to-emerald-600 bg-clip-text text-transparent dark:from-zinc-50 dark:via-zinc-200 dark:to-emerald-400">
              Meus Pacientes
            </h1>
          </div>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl pl-4">
            Gerencie seus pacientes e acompanhe toda evolução clínica.
          </p>
        </div>
        <div className="flex-shrink-0">
          <PacienteModal />
        </div>
      </div>

      {/* 2. Barra de Busca e Filtros (Aparência de Toolbar SaaS) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
        <div className="relative w-full sm:max-w-md flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            placeholder="Buscar por nome, CPF ou e-mail..."
            className="w-full h-11 rounded-xl bg-transparent pl-11 border-none focus-visible:ring-0 text-sm placeholder:text-zinc-400 shadow-none"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto px-2">
          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-50 border border-emerald-100 dark:border-emerald-900/50 rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm">
            {pacientes.length} {pacientes.length === 1 ? 'paciente' : 'pacientes'}
          </Badge>
          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block mx-1" />
          <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
            Filtros
          </button>
        </div>
      </div>

      {/* 3. Tabela de Listagem Premium */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] overflow-hidden flex-1">
        {pacientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center px-4">
            <div className="h-16 w-16 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 rounded-2xl flex items-center justify-center mb-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <Filter className="h-7 w-7 text-zinc-300 dark:text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Nenhum paciente encontrado</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-2 leading-relaxed">
              Sua lista de pacientes está vazia no momento. Comece cadastrando o seu primeiro paciente para iniciar os acompanhamentos.
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Paciente
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Contato
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Objetivo Principal
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Última Consulta
                    </th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {pacientes.map((paciente) => (
                    <tr 
                      key={paciente.id} 
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors group"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <Link href={`/pacientes/${paciente.id}`} className="flex items-center gap-4 focus:outline-none">
                          <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200/60 dark:border-zinc-700/60 font-bold text-xs text-zinc-600 dark:text-zinc-300 group-hover:border-emerald-200 group-hover:bg-emerald-50/50 group-hover:text-emerald-700 dark:group-hover:bg-emerald-950/40 dark:group-hover:text-emerald-400 transition-all shadow-sm">
                            {paciente.nome.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-[15px]">
                              {paciente.nome}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1">
                              CPF: {paciente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-zinc-700 dark:text-zinc-300 text-sm font-medium">
                          {paciente.telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                          {paciente.email || <span className="text-zinc-300 dark:text-zinc-700">—</span>}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 font-medium px-3 py-1 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50">
                          {paciente.objetivo_principal}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm">
                        {paciente.ultima_consulta ? (
                          <div className="flex flex-col">
                            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                              {new Date(paciente.ultima_consulta).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Retorno agendado</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-xs font-medium px-2 py-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-md border border-zinc-100 dark:border-zinc-800">
                            <Calendar className="w-3 h-3" /> Aguardando 1ª consulta
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <button className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4. Paginação Moderna */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 mt-auto">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Mostrando <span className="font-medium text-zinc-900 dark:text-zinc-100">1</span> a <span className="font-medium text-zinc-900 dark:text-zinc-100">{pacientes.length}</span> de <span className="font-medium text-zinc-900 dark:text-zinc-100">{pacientes.length}</span> pacientes
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled className="h-9 px-3 rounded-lg border-zinc-200 dark:border-zinc-700 text-zinc-500">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled={pacientes.length < 10} className="h-9 px-3 rounded-lg border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}