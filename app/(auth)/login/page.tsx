import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <AuthForm initialMode="login" />
    </main>
  );
}
