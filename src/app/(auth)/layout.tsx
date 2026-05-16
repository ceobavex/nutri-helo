// src/app/(auth)/layout.tsx
import { ReactNode } from "react";
import { Stethoscope } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-zinc-50">
      
      {/* LADO ESQUERDO: Painel Verde */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between bg-emerald-600 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 z-0 opacity-90" />
        
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-400 blur-[100px] opacity-50 z-0" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-700 blur-[100px] opacity-50 z-0" />
        
        {/* Topo: Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-md">
            <Stethoscope className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Nutri Helo</span>
        </div>

        {/* Meio: Texto Centralizado */}
        <div className="relative z-10 max-w-lg mx-auto text-center">
          <h2 className="text-4xl font-semibold leading-tight mb-6 text-white">
            Inteligência e precisão para a sua prática clínica.
          </h2>
          <p className="text-emerald-100 text-lg leading-relaxed">
            Um sistema completo projetado exclusivamente para nutricionistas integrativas. Simplifique prontuários, gere protocolos e tenha insights automáticos.
          </p>
        </div>

        {/* Rodapé: Copyright */}
        <div className="relative z-10 text-emerald-200 text-sm">
          &copy; {new Date().getFullYear()} Nutri Helo. Todos os direitos reservados.
        </div>
      </div>

      {/* LADO DIREITO: Formulários Login/Cadastro */}
      <div className="flex w-full flex-col justify-center px-6 sm:px-8 md:w-1/2 lg:px-12 relative z-10">
        <div className="mx-auto w-full max-w-[540px]">
          {/* Logo / Header Mobile */}
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Nutri Helo
            </span>
          </div>
          
          {children}
        </div>
      </div>

    </div>
  );
}