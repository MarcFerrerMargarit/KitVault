import { Brand } from "@/components/Brand";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Reset your password — KitVault",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Brand />
      </div>
      <div className="w-full max-w-sm rounded-[var(--radius)] border border-border bg-surface p-6 sm:p-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
