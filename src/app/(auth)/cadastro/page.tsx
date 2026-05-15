// src/app/(auth)/cadastro/page.tsx
import Link from "next/link";
import { CadastroForm } from "@/features/auth/components/cadastro-form";

export default function CadastroPage() {
  return (
    <div className="w-full pb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Crie sua conta
        </h1>
        <p className="text-sm text-muted-foreground">
          Junte-se à nova era da nutrição integrativa.
        </p>
      </div>

      <CadastroForm />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Já possui cadastro?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Fazer login
        </Link>
      </p>
    </div>
  );
}