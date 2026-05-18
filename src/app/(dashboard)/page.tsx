import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Olá, Nutricionista 👋
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Aqui está o resumo do seu consultório hoje.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Total de Pacientes
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">142</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +4 esse mês
            </p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Atendimentos Hoje
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/30">
              <CalendarCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">6</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Próximo às 14:00
            </p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Taxa de Retorno
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950/30">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">84%</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Excelente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Espaço reservado para módulos futuros */}
      <div className="h-64 w-full rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
         <p className="text-zinc-500 font-medium">Área reservada para a Agenda e Gráficos (Próximas Etapas)</p>
      </div>
    </div>
  );
}