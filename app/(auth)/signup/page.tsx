import AuthForm from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <AuthForm initialMode="signup" />
    </main>
  );
}
