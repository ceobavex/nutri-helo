// src/features/auth/components/cadastro-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IMaskInput } from "react-imask";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const cadastroSchema = z.object({
  // Passo 1
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  nomeSocial: z.string().optional(),
  cpf: z.string().min(14, "CPF inválido"), // 14 com máscara
  // Passo 2
  crn: z.string().min(3, "CRN inválido"),
  regiao: z.string().min(1, "Selecione a região"),
  tipoInscricao: z.string().min(1, "Selecione o tipo"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(14, "Telefone inválido"),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
});

type CadastroFormValues = z.infer<typeof cadastroSchema>;

export function CadastroForm() {
  const [step, setStep] = useState(1);

  const form = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: "",
      nomeSocial: "",
      cpf: "",
      crn: "",
      regiao: "",
      tipoInscricao: "",
      email: "",
      telefone: "",
      senha: "",
    },
    mode: "onChange",
  });

  const regioesCRN = Array.from({ length: 11 }, (_, i) => `CRN-${i + 1}`);
  const tiposInscricao = ["Definitiva", "Provisória (P)", "Secundária (S)"];

  async function nextStep() {
    const fieldsToValidate = step === 1 
      ? ["nome", "cpf"] as const 
      : [];
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(2);
  }

  function onSubmit(data: CadastroFormValues) {
    console.log("Dados de Cadastro Final:", data);
  }

  return (
    <div className="w-full">
      {/* Stepper Visual */}
      <div className="mb-8 flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-zinc-100 -z-10" />
        <div className="absolute left-0 top-1/2 h-0.5 w-1/2 -translate-y-1/2 bg-primary transition-all duration-300 -z-10" style={{ width: step === 2 ? '100%' : '50%' }} />
        
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white ${step >= 1 ? 'bg-primary' : 'bg-zinc-200 text-zinc-500'}`}>
          {step > 1 ? <Check className="h-4 w-4" /> : "1"}
        </div>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step >= 2 ? 'bg-primary text-white' : 'bg-zinc-200 text-zinc-500'}`}>
          2
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* PASSO 1: DADOS PESSOAIS */}
          <div className={step === 1 ? "block space-y-4" : "hidden"}>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-foreground">Identificação Pessoal</h3>
              <p className="text-sm text-muted-foreground">Preencha seus dados básicos.</p>
            </div>

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Conforme registro profissional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nomeSocial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Social (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Como prefere ser chamado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    {/* Componente de Máscara substituindo o Input normal */}
                    <IMaskInput
                      mask="000.000.000-00"
                      value={field.value}
                      unmask={false}
                      onAccept={(value) => field.onChange(value)}
                      placeholder="000.000.000-00"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="button" onClick={nextStep} className="w-full mt-6">
              Próximo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* PASSO 2: DADOS PROFISSIONAIS */}
          <div className={step === 2 ? "block space-y-4" : "hidden"}>
             <div className="mb-4 flex items-center gap-2">
              <button type="button" onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h3 className="text-lg font-medium text-foreground">Dados Profissionais</h3>
                <p className="text-sm text-muted-foreground">Informações de acesso e registro.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="crn"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>CRN</FormLabel>
                    <FormControl>
                      <Input placeholder="Número" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="regiao"
                render={({ field }) => (
                  <FormItem className="w-[100px]">
                    <FormLabel>Região</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {regioesCRN.map((r) => <SelectItem key={r} value={r}>{r.replace("CRN-", "")}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tipoInscricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Inscrição</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                    <SelectContent>
                      {tiposInscricao.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail Ativo</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Profissional</FormLabel>
                  <FormControl>
                    <IMaskInput
                      mask="(00) 00000-0000"
                      value={field.value}
                      unmask={false}
                      onAccept={(value) => field.onChange(value)}
                      placeholder="(00) 00000-0000"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mínimo 6 caracteres" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-6">
              Finalizar Cadastro
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}