"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  UserPlus, ChevronRight, ChevronLeft, 
  CheckCircle2, Star, Sparkles, AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { pacienteSchema, PacienteFormValues } from "../types";
import { cadastrarPaciente } from "../actions/pacientes-actions";

const OBJETIVOS_LISTA = [
  "Emagrecimento", "Reeducação alimentar", "Ganho de massa muscular (hipertrofia)",
  "Melhorar a saúde", "Definição muscular", "Perda de gordura",
  "Melhorar disposição/energia", "Melhorar hábitos alimentares",
  "Controle de ansiedade alimentar", "Ganho de peso", "Melhorar desempenho esportivo",
  "Controle de doenças", "Melhorar exames laboratoriais",
  "Alimentação mais saudável no dia a dia", "Organização alimentar / rotina",
  "Qualidade de vida", "Saúde intestinal", "Melhorar relação com a comida",
  "Acompanhamento gestacional", "Alimentação vegetariana/vegana equilibrada"
];

export function PacienteModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PacienteFormValues>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      nome: "", dataNascimento: "", sexo: undefined, cpf: "",
      email: "", telefone: "", objetivoPrincipal: "", objetivosSecundarios: [],
    },
  });

  const { setValue, formState: { errors } } = form;
  const nomeVal = useWatch({ control: form.control, name: "nome" });
  const dataNasc = useWatch({ control: form.control, name: "dataNascimento" });
  const sexoVal = useWatch({ control: form.control, name: "sexo" });
  const objPrincipal = useWatch({ control: form.control, name: "objetivoPrincipal" });
  const objsSecundarios = useWatch({ control: form.control, name: "objetivosSecundarios" }) ?? [];

  const idade = useMemo(() => {
    if (dataNasc && dataNasc.length === 10) {
      const birthDate = new Date(dataNasc);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return `${age} anos`;
      }
    }
    
    return "";
  }, [dataNasc]);

  const toggleObjetivo = (objetivo: string) => {
    if (objPrincipal === objetivo) {
      const novosSecundarios = [...objsSecundarios];
      const novoPrincipal = novosSecundarios.length > 0 ? novosSecundarios.shift()! : "";
      setValue("objetivoPrincipal", novoPrincipal);
      setValue("objetivosSecundarios", novosSecundarios);
    } else if (objsSecundarios.includes(objetivo)) {
      setValue("objetivosSecundarios", objsSecundarios.filter((o) => o !== objetivo));
    } else {
      if (!objPrincipal) {
        setValue("objetivoPrincipal", objetivo);
      } else {
        setValue("objetivosSecundarios", [...objsSecundarios, objetivo]);
      }
    }
  };

  const tornarPrincipal = (objetivo: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (objPrincipal === objetivo) return;
    const novosSecundarios = [...objsSecundarios.filter(o => o !== objetivo)];
    if (objPrincipal) novosSecundarios.push(objPrincipal);
    setValue("objetivoPrincipal", objetivo);
    setValue("objetivosSecundarios", novosSecundarios);
  };

  const onSubmit = async (data: PacienteFormValues) => {
    setIsLoading(true);
    const result = await cadastrarPaciente(data);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Paciente cadastrado com sucesso!");
      setOpen(false);
      form.reset();
      setStep(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 text-white gap-2 px-6 shadow-[0_8px_16px_-6px_rgba(5,150,105,0.4)] transition-all duration-300 cursor-pointer text-sm font-medium">
          <UserPlus className="h-4 w-4" />
          Cadastrar Paciente
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[640px] rounded-[2rem] p-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200/80 dark:border-zinc-800 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]">
        
        <DialogHeader className="px-8 pt-8 pb-6 bg-zinc-50/50 dark:bg-zinc-900/50 relative">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                Novo Paciente
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                {step === 1 ? "Preencha os dados básicos para iniciar o prontuário." : "Defina a meta principal e as complementares."}
              </DialogDescription>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 shadow-sm">
              <span className={step === 1 ? "text-emerald-600 dark:text-emerald-400" : ""}>1. Dados</span>
              <span className="text-zinc-300 dark:text-zinc-600">/</span>
              <span className={step === 2 ? "text-emerald-600 dark:text-emerald-400" : ""}>2. Objetivos</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-100 dark:bg-zinc-800">
            <div 
              className="h-full bg-emerald-500 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
              style={{ width: step === 1 ? '50%' : '100%' }} 
            />
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
              
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider dark:text-zinc-400">Nome Completo *</Label>
                <Input 
                  {...form.register("nome")} 
                  className="h-12 rounded-xl border-zinc-200/80 bg-zinc-50/30 focus-visible:bg-white focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 shadow-sm transition-all" 
                  placeholder="Ex: Maria Silva Pereira" 
                />
                {errors.nome && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.nome.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider dark:text-zinc-400">Nascimento *</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="date" 
                      {...form.register("dataNascimento")} 
                      className="h-12 flex-1 rounded-xl border-zinc-200/80 bg-zinc-50/30 focus-visible:bg-white focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 shadow-sm transition-all text-zinc-600" 
                    />
                    {idade && (
                      <div className="flex h-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 px-4 border border-emerald-200 dark:border-emerald-900 text-sm font-bold text-emerald-700 dark:text-emerald-400 animate-in zoom-in duration-300 shadow-sm shrink-0">
                        {idade}
                      </div>
                    )}
                  </div>
                  {errors.dataNascimento && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.dataNascimento.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider dark:text-zinc-400">Sexo Biológico *</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setValue("sexo", "FEMININO")}
                      className={`flex-1 flex items-center justify-center h-12 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        sexoVal === 'FEMININO' 
                          ? 'border-[1.5px] border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.18)]' 
                          : 'border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 bg-white'
                      }`}
                    >
                      Feminino
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("sexo", "MASCULINO")}
                      className={`flex-1 flex items-center justify-center h-12 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        sexoVal === 'MASCULINO' 
                          ? 'border-[1.5px] border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.18)]' 
                          : 'border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 bg-white'
                      }`}
                    >
                      Masculino
                    </button>
                  </div>
                  {errors.sexo && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.sexo.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider dark:text-zinc-400">CPF *</Label>
                  <Input 
                    {...form.register("cpf")} 
                    className="h-12 rounded-xl border-zinc-200/80 bg-zinc-50/30 focus-visible:bg-white focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 shadow-sm transition-all" 
                    placeholder="000.000.000-00" 
                  />
                  {errors.cpf && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.cpf.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider dark:text-zinc-400">Telefone / WhatsApp *</Label>
                  <Input 
                    {...form.register("telefone")} 
                    className="h-12 rounded-xl border-zinc-200/80 bg-zinc-50/30 focus-visible:bg-white focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 shadow-sm transition-all" 
                    placeholder="(11) 99999-9999" 
                  />
                  {errors.telefone && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.telefone.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider dark:text-zinc-400">E-mail (Opcional)</Label>
                <Input 
                  type="email" 
                  {...form.register("email")} 
                  className="h-12 rounded-xl border-zinc-200/80 bg-zinc-50/30 focus-visible:bg-white focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 shadow-sm transition-all" 
                  placeholder="paciente@email.com" 
                />
              </div>

              {/* Botão atualizado para Verde Esmeralda */}
              <Button 
                type="button" 
                onClick={() => setStep(2)} 
                className="w-full mt-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer h-12 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all font-semibold text-base" 
                disabled={!nomeVal || !dataNasc || !sexoVal}
              >
                Avançar para Objetivos <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-100/50 dark:border-emerald-900/30 flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg shrink-0">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Inteligência Clínica</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Selecione todos os objetivos relatados pelo paciente. 
                    <br className="hidden sm:block" />
                    Clique na <strong>estrela</strong> para definir o <span className="font-semibold text-emerald-600 dark:text-emerald-400">Objetivo Principal</span>.
                  </p>
                </div>
              </div>
              
              <ScrollArea className="h-[320px] w-full rounded-2xl border border-zinc-200/80 p-5 bg-zinc-50/30 dark:bg-zinc-900/30 dark:border-zinc-800 shadow-inner">
                <div className="flex flex-wrap gap-3">
                  {OBJETIVOS_LISTA.map((obj) => {
                    const isPrincipal = objPrincipal === obj;
                    const isSecundario = objsSecundarios.includes(obj);
                    const isSelected = isPrincipal || isSecundario;

                    return (
                      <div
                        key={obj}
                        onClick={() => toggleObjetivo(obj)}
                        className={`
                          relative group flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium cursor-pointer transition-all duration-300
                          ${isPrincipal 
                            ? 'bg-emerald-50 border-[1.5px] border-emerald-500 text-emerald-800 shadow-[0_4px_12px_-4px_rgba(16,185,129,0.25)]' 
                            : isSecundario 
                              ? 'bg-emerald-50/40 border-[1.5px] border-emerald-400 text-emerald-700 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.18)]' 
                              : 'bg-white border border-zinc-200 text-zinc-500 hover:border-emerald-200 hover:bg-emerald-50/30 hover:text-zinc-700'
                          }
                        `}
                      >
                        {isSelected && (
                          <div 
                            onClick={(e) => tornarPrincipal(obj, e)} 
                            className="cursor-pointer z-10 shrink-0" 
                            title="Definir como principal"
                          >
                            <Star 
                              className={`w-4 h-4 transition-all ${
                                isPrincipal 
                                  ? 'fill-emerald-500 text-emerald-500 scale-110 drop-shadow-sm' 
                                  : 'text-zinc-300 hover:text-emerald-400 hover:scale-110'
                              }`} 
                            />
                          </div>
                        )}
                        
                        <span>{obj}</span>
                        
                        {isPrincipal && (
                          <Badge className="ml-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-300 border-none px-2 py-0.5 text-[10px] uppercase tracking-wider animate-in zoom-in shrink-0">
                            Principal
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              {errors.objetivoPrincipal && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.objetivoPrincipal.message}</p>}

              <div className="flex gap-4 mt-8 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(1)} 
                  className="rounded-xl flex-1 cursor-pointer h-12 border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="rounded-xl flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer h-12 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all font-semibold text-base"
                >
                  {isLoading ? "Salvando Prontuário..." : "Finalizar Cadastro"} 
                  <CheckCircle2 className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
