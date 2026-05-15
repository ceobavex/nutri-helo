// src/features/auth/components/cadastro-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IMaskInput } from "react-imask";
import Link from "next/link";
import { Leaf, ArrowRight, Check, FileUser, Contact } from "lucide-react";
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
import { cn } from "@/lib/utils";

const cadastroSchema = z.object({
  // Passo 1
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  nomeSocial: z.string().optional(),
  cpf: z.string().min(14, "CPF inválido"),
  // Passo 2
  crn: z.string().min(3, "CRN inválido"),
  regiao: z.string().min(1, "Selecione a região"),
  tipoInscricao: z.string().min(1, "Selecione o tipo"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(14, "Telefone inválido"),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
});

type CadastroFormValues = z.infer<typeof cadastroSchema>;

// Classes comuns para reutilização (DRY)
const inputClasses = "rounded-full h-11 border-zinc-200 flex w-full border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
const selectTriggerClasses = "rounded-full h-11 border-zinc-200";

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
    const fieldsToValidate =
      step === 1 ? (["nome", "cpf"] as const) : [];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(2);
  }

  function onSubmit(data: CadastroFormValues) {
    console.log("Dados de Cadastro Final:", data);
  }

  // Definição dos Passos do Stepper Polido
  const stepsDef = [
    { id: 1, label: "Pessoal", icon: Contact },
    { id: 2, label: "Profissional", icon: FileUser },
  ];

  return (
    <div className="border border-zinc-100 bg-white p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-12">
      {/* Header Central */}
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Leaf className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Crie sua Conta
          </h1>
          <p className="text-sm text-zinc-500">
            Junte-se ao ecossistema inteligente de nutrição integrativa.
          </p>
        </div>
      </div>

      {/* Barra de Abas (Toggle) */}
      <div className="flex w-full rounded-full bg-zinc-50 p-1.5 border border-zinc-100">
        <Link
          href="/login"
          className="flex-1 rounded-full text-zinc-500 hover:text-zinc-900 p-2.5 text-center text-sm font-medium transition-colors"
        >
          Entrar
        </Link>
        <div className="flex-1 rounded-full bg-white text-emerald-700 p-2.5 text-center text-sm font-semibold shadow-sm">
          Criar Conta
        </div>
      </div>

      {/* Stepper Polido e Moderno */}
      <div className="flex items-center justify-center gap-2">
        {stepsDef.map((s, idx) => {
          const isCompleted = step > s.id;
          const isActive = step === s.id;
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border border-zinc-100 transition-colors duration-300",
                  isCompleted && "bg-emerald-600 border-emerald-600 text-white",
                  isActive && "bg-white border-zinc-200 text-zinc-900 shadow-sm"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              {idx < stepsDef.length - 1 && (
                <div className="h-0.5 w-10 rounded-full bg-zinc-100" />
              )}
            </div>
          );
        })}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* PASSO 1: DADOS PESSOAIS */}
          <div className={step === 1 ? "block space-y-5" : "hidden"}>
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-600 font-medium">
                    Nome Completo
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Conforme registro profissional"
                      {...field}
                      className={inputClasses}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-600 font-medium">
                      CPF
                    </FormLabel>
                    <FormControl>
                      <IMaskInput
                        mask="000.000.000-00"
                        value={field.value}
                        onAccept={(value) => field.onChange(value)}
                        placeholder="000.000.000-00"
                        className={inputClasses}
                      />
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
                    <FormLabel className="text-zinc-600 font-medium">
                      Nome Social (Opç.)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Como prefere..."
                        {...field}
                        className={inputClasses}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              onClick={nextStep}
              className="w-full mt-10 rounded-full h-12 bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-500/10 transition-colors"
            >
              Próximo Passo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* PASSO 2: DADOS PROFISSIONAIS */}
          <div className={step === 2 ? "block space-y-5" : "hidden"}>
            <div className="grid grid-cols-5 gap-3">
              <FormField
                control={form.control}
                name="crn"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel className="text-zinc-600 font-medium">
                      Número do CRN
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apenas números"
                        {...field}
                        className={inputClasses}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="regiao"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-zinc-600 font-medium">
                      Região
                  </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={selectTriggerClasses}>
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regioesCRN.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r.replace("CRN-", "")}
                          </SelectItem>
                        ))}
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
                  <FormLabel className="text-zinc-600 font-medium">
                    Tipo de Inscrição
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={selectTriggerClasses}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposInscricao.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-600 font-medium">
                      E-mail Ativo
                  </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                        className={inputClasses}
                      />
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
                    <FormLabel className="text-zinc-600 font-medium">
                      WhatsApp Prof.
                  </FormLabel>
                    <FormControl>
                      <IMaskInput
                        mask="(00) 00000-0000"
                        value={field.value}
                        onAccept={(value) => field.onChange(value)}
                        placeholder="(00) 00000-0000"
                        className={inputClasses}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-600 font-medium">
                    Senha (Mín. 6 carc.)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      className={inputClasses}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 mt-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 rounded-full h-12 h-12 border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                className="flex-[2] rounded-full h-12 h-12 bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-500/10 transition-colors"
              >
                Finalizar Cadastro
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}