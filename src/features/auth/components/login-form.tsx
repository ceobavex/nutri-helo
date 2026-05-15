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
import { cn } from "@/lib/utils";

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
    // Card Principal - Sombra suave e cantos muito arredondados
    <div className="border border-zinc-100 bg-white p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-12">
      {/* Header Central: Ícone e Títulos */}
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

      {/* Barra de Abas (Toggle) */}
      <div className="flex w-full rounded-full bg-zinc-50 p-1.5 border border-zinc-100">
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Campos de CRN e Região */}
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
                      placeholder="Ex: 12345"
                      {...field}
                      className="rounded-full h-11 border-zinc-200"
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
                      <SelectTrigger className="rounded-full h-11 border-zinc-200">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regioesCRN.map((regiao) => (
                        <SelectItem key={regiao} value={regiao}>
                          {regiao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Campo de Senha */}
          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-600 font-medium">
                  Senha
                  <span className="text-sm font-normal text-zinc-400 ml-1">
                    (Mín. 6 caracteres)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    {...field}
                    className="rounded-full h-11 border-zinc-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botão de Ação Green Ultra-arredondado */}
          <Button
            type="submit"
            className="w-full mt-8 rounded-full h-12 bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-500/10 transition-colors"
          >
            Acessar Sistema
          </Button>
        </form>
      </Form>
    </div>
  );
}