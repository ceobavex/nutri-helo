// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="w-full flex items-center justify-center py-8">
      <LoginForm />
    </div>
  );
}