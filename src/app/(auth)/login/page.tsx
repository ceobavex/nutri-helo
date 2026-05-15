// src/app/(auth)/login/page.tsx
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Bem-vindo de volta
        </h1>
        <p className="text-sm text-muted-foreground">
          Insira seu CRN e senha para acessar o prontuário.
        </p>
      </div>

      <LoginForm />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Ainda não tem uma conta?{" "}
        <Link href="/cadastro" className="font-semibold text-primary hover:underline">
          Criar minha conta
        </Link>
      </p>
    </div>
  );
}