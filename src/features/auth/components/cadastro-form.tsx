"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IMaskInput } from "react-imask";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, ArrowRight, Check, FileUser, Contact, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { cadastroAction } from "@/features/auth/actions/auth-actions";

const cadastroSchema = z.object({
  nome: z.string().min(3, "Mínimo 3 caracteres"),
  cpf: z.string().min(14, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(14, "Telefone inválido"),
  crn: z.string().min(3, "CRN inválido"),
  regiao: z.string().min(1, "Selecione a região"),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
});

type CadastroFormValues = z.infer<typeof cadastroSchema>;

const inputClasses = "rounded-full h-12 border-zinc-200 flex w-full border bg-transparent px-4 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:opacity-50";
const selectTriggerClasses = "rounded-full h-12 border-zinc-200 disabled:opacity-50";

export function CadastroForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { nome: "", cpf: "", email: "", telefone: "", crn: "", regiao: "", senha: "" },
    mode: "onChange",
  });

  const regioesCRN = Array.from({ length: 11 }, (_, i) => `CRN-${i + 1}`);

  async function nextStep() {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ["nome", "cpf", "email", "telefone"];
    if (step === 2) fieldsToValidate = ["crn", "regiao"];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  }

  function prevStep() { setStep(step - 1); }

  async function onSubmit(data: CadastroFormValues) {
    setIsLoading(true);
    const result = await cadastroAction(data);
    
    if (result.error) {
      toast.error("Erro no cadastro", { description: result.error });
      setIsLoading(false);
    } else {
      toast.success("Conta criada!", { description: "Bem-vindo(a) ao Nutri Helo." });
      router.push("/dashboard");
    }
  }

  const stepsDef = [
    { id: 1, label: "Contato", icon: Contact },
    { id: 2, label: "Profissional", icon: FileUser },
    { id: 3, label: "Segurança", icon: Lock },
  ];

  return (
    <div className="w-full border border-zinc-100 bg-white p-10 sm:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col min-h-[720px]">
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><Leaf className="h-6 w-6" /></div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Crie sua Conta</h1>
          <p className="text-sm text-zinc-500">Junte-se ao ecossistema inteligente de nutrição.</p>
        </div>
      </div>

      <div className="flex w-full rounded-full bg-zinc-50 p-1.5 border border-zinc-100 mt-8 mb-6">
        <Link href="/login" className="flex-1 rounded-full text-zinc-500 hover:text-zinc-900 p-2.5 text-center text-sm font-medium transition-colors">
          Entrar
        </Link>
        <div className="flex-1 rounded-full bg-white text-emerald-700 p-2.5 text-center text-sm font-semibold shadow-sm cursor-default">
          Criar Conta
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8">
        {stepsDef.map((s, idx) => {
          const isCompleted = step > s.id;
          const isActive = step === s.id;
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <div 
                role="button"
                onClick={() => isCompleted ? setStep(s.id) : null} 
                className={cn("flex h-9 w-9 items-center justify-center rounded-full border border-zinc-100 transition-colors duration-300", isCompleted && "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700", isActive && "bg-white border-zinc-200 text-zinc-900 shadow-sm cursor-default", !isCompleted && !isActive && "cursor-not-allowed opacity-50")}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              {idx < stepsDef.length - 1 && <div className="h-0.5 w-8 rounded-full bg-zinc-100" />}
            </div>
          );
        })}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
          {/* PASSO 1 */}
          <div className={cn("flex flex-col flex-1", step === 1 ? "flex" : "hidden")}>
            <div className="space-y-4">
              <FormField control={form.control} name="nome" render={({ field }) => (
                <FormItem><FormLabel className="text-zinc-600 font-medium">Nome Completo</FormLabel><FormControl><Input placeholder="Registro profissional" {...field} className={inputClasses} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="cpf" render={({ field }) => (
                <FormItem><FormLabel className="text-zinc-600 font-medium">CPF</FormLabel><FormControl><IMaskInput mask="000.000.000-00" value={field.value} onAccept={(val) => field.onChange(val)} placeholder="000.000.000-00" className={inputClasses} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel className="text-zinc-600 font-medium text-sm">E-mail</FormLabel><FormControl><Input type="email" placeholder="seu@email.com" {...field} className={inputClasses} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="telefone" render={({ field }) => (
                  <FormItem><FormLabel className="text-zinc-600 font-medium text-sm">WhatsApp</FormLabel><FormControl><IMaskInput mask="(00) 00000-0000" value={field.value} onAccept={(val) => field.onChange(val)} placeholder="(00) 00000-0000" className={inputClasses} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>
            <div className="mt-auto pt-8">
              <Button type="button" onClick={nextStep} className="w-full rounded-full h-12 bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all">
                Próximo Passo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* PASSO 2 */}
          <div className={cn("flex flex-col flex-1", step === 2 ? "flex" : "hidden")}>
            <div className="space-y-6">
              <FormField control={form.control} name="crn" render={({ field }) => (
                <FormItem><FormLabel className="text-zinc-600 font-medium">Número do CRN</FormLabel><FormControl><Input placeholder="Ex: 12345" {...field} className={inputClasses} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="regiao" render={({ field }) => (
                <FormItem><FormLabel className="text-zinc-600 font-medium">Região do CRN</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className={selectTriggerClasses}><SelectValue placeholder="Selecione a região" /></SelectTrigger></FormControl><SelectContent>{regioesCRN.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select><FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="mt-auto pt-8 flex gap-3">
              <Button type="button" variant="outline" onClick={prevStep} className="w-1/3 rounded-full h-12 border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-50">
                Voltar
              </Button>
              <Button type="button" onClick={nextStep} className="w-2/3 rounded-full h-12 bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20">
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* PASSO 3 */}
          <div className={cn("flex flex-col flex-1", step === 3 ? "flex" : "hidden")}>
            <div className="space-y-6">
              <FormField control={form.control} name="senha" render={({ field }) => (
                <FormItem><FormLabel className="text-zinc-600 font-medium">Senha</FormLabel><FormControl><Input type="password" placeholder="Mínimo 6 caracteres" {...field} className={inputClasses} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="mt-auto pt-8 flex gap-3">
              <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading} className="w-1/3 rounded-full h-12 border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-50">
                Voltar
              </Button>
              <Button type="submit" disabled={isLoading} className="w-2/3 rounded-full h-12 bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Finalizar Cadastro"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}