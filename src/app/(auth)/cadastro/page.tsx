// src/app/(auth)/cadastro/page.tsx
import { CadastroForm } from "@/features/auth/components/cadastro-form";

export default function CadastroPage() {
  return (
    <div className="w-full flex items-center justify-center py-8">
      <CadastroForm />
    </div>
  );
}