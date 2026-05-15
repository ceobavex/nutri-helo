// src/features/auth/components/login-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Leaf } from "lucide-react";
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

const loginSchema = z.object({
  crn: z.string().min(3, "CRN inválido"),
  regiao: z.string().min(1, "Selecione a região"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { crn: "", regiao: "", senha: "" },
  });

  function onSubmit(data: LoginFormValues) {
    console.log("Dados do Login:", data);
  }

  const regioesCRN = Array.from({ length: 11 }, (_, i) => `CRN-${i + 1}`);

  return (
    // CARD MAIOR E COM ALTURA FIXA MINIMA (min-h-[720px])
    <div className="w-full border border-zinc-100 bg-white p-10 sm:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col min-h-[720px]">
      
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Leaf className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Acesso Profissional
          </h1>
          <p className="text-sm text-zinc-500">
            Sua clínica em um ecossistema inteligente.
          </p>
        </div>
      </div>

      <div className="flex w-full rounded-full bg-zinc-50 p-1.5 border border-zinc-100 mt-10">
        <div className="flex-1 rounded-full bg-white text-emerald-700 p-2.5 text-center text-sm font-semibold shadow-sm">
          Entrar
        </div>
        <Link
          href="/cadastro"
          className="flex-1 rounded-full text-zinc-500 hover:text-zinc-900 p-2.5 text-center text-sm font-medium transition-colors"
        >
          Criar Conta
        </Link>
      </div>

      <Form {...form}>
        {/* flex-1 para empurrar o botão para baixo */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col flex-1">
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-4">
              <FormField
                control={form.control}
                name="crn"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel className="text-zinc-600 font-medium">Número do CRN</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 12345" {...field} className="rounded-full h-12 border-zinc-200" />
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
                    <FormLabel className="text-zinc-600 font-medium">Região</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-full h-12 border-zinc-200">
                          <SelectValue placeholder="CRN" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regioesCRN.map((regiao) => (
                          <SelectItem key={regiao} value={regiao}>{regiao}</SelectItem>
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
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-600 font-medium flex justify-between">
                    <span>Senha</span>
                    <span className="text-sm font-normal text-zinc-400">(Mín. 6 caracteres)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} className="rounded-full h-12 border-zinc-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* mt-auto empurra o botão firmemente para a base do card */}
          <div className="mt-auto pt-8">
            <Button
              type="submit"
              className="w-full rounded-full h-12 bg-emerald-600 text-white text-base font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all"
            >
              Acessar Sistema
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}