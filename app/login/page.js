import { Suspense } from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-5 py-20">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  );
}
