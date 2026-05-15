// src/app/(auth)/layout.tsx
import { ReactNode } from "react";
import { Stethoscope } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* LADO ESQUERDO: Formulários (Login / Cadastro) */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-12 md:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo / Header Mobile */}
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Nutri Helo
            </span>
          </div>
          
          {/* Onde os formulários vão aparecer */}
          {children}
        </div>
      </div>

      {/* LADO DIREITO: Imagem / Padrão Visual (Escondido no Mobile) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between bg-zinc-900 p-12 text-zinc-50 relative overflow-hidden">
        {/* Efeito de Gradiente de Fundo para dar profundidade */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black z-0" />
        
        {/* Topo do Lado Direito */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 shadow-md">
            <Stethoscope className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Nutri Helo</span>
        </div>

        {/* Mensagem central */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-semibold leading-tight mb-6">
            Inteligência e precisão para a sua prática clínica.
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Um sistema completo projetado exclusivamente para nutricionistas integrativas. Simplifique prontuários, gere protocolos e tenha insights automáticos.
          </p>
        </div>

        {/* Rodapé do Lado Direito */}
        <div className="relative z-10 text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} Nutri Helo. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}