import LogInForm from "@/app/_components/auth/LoginForm";

export default async function LoginPage({ searchParams }: {
  searchParams: Promise<{ passwordReset?: string }>;
}) {
  const { passwordReset } = await searchParams;
  return <LogInForm passwordResetComplete={passwordReset === "complete"} />;
}
