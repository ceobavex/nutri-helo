'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Beaker, ChevronLeft, ChevronRight, FileText, History, LineChart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PainelContextoLateral() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={cn("relative hidden h-full min-h-0 transition-all duration-300 xl:flex", isOpen ? "w-full" : "w-12")}>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-4 top-6 z-20 size-8 rounded-full border border-zinc-200 bg-white shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </Button>

      {!isOpen && (
        <div className="flex w-12 flex-col items-center gap-4 rounded-2xl border border-zinc-200/80 bg-white pt-16 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <History className="size-5 text-zinc-400" />
          <LineChart className="size-5 text-zinc-400" />
          <FileText className="size-5 text-zinc-400" />
        </div>
      )}

      {isOpen && (
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm animate-in fade-in duration-200 dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <Sparkles className="size-4" />
              Apoio clínico
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Histórico e sinais para consulta atual
            </p>
          </div>
          
          <Tabs defaultValue="ultima" className="flex min-h-0 flex-1 flex-col p-4">
            <TabsList className="grid h-10 w-full grid-cols-3 rounded-xl bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-950">
              <TabsTrigger value="ultima" className="rounded-lg text-xs data-active:bg-white data-active:text-zinc-950 dark:data-active:bg-zinc-800 dark:data-active:text-zinc-50">Histórico</TabsTrigger>
              <TabsTrigger value="evolucao" className="rounded-lg text-xs data-active:bg-white data-active:text-zinc-950 dark:data-active:bg-zinc-800 dark:data-active:text-zinc-50">Evolução</TabsTrigger>
              <TabsTrigger value="exames" className="rounded-lg text-xs data-active:bg-white data-active:text-zinc-950 dark:data-active:bg-zinc-800 dark:data-active:text-zinc-50">Exames</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
              <TabsContent value="ultima" className="m-0 outline-none">
                <div className="space-y-3">
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Consulta anterior</p>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-500 shadow-sm dark:bg-zinc-900">
                        12/04/2026
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      Paciente relatou fadiga extrema no final da tarde. Intestino preso, cerca de 3 vezes por semana.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/25">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      Conduta registrada
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                      Aumento de ingestão hídrica para 3L e adição de fibra de psyllium.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="evolucao" className="m-0 outline-none">
                <div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-center dark:border-zinc-800">
                  <LineChart className="mx-auto size-8 text-zinc-300" />
                  <p className="mt-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Evolução em construção
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Peso, IMC e métricas estruturais aparecerão aqui conforme as consultas forem salvas.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="exames" className="m-0 outline-none">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/60 dark:bg-amber-950/25">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-300">
                    <Beaker className="size-4" />
                    Exames recentes
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <p>Ferritina: 15 ng/mL</p>
                    <p>Vitamina D: 22 ng/mL</p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </aside>
  );
}
