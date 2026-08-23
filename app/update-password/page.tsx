import { Brand } from "@/components/Brand";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export const metadata = {
  title: "Set a new password — KitVault",
};

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Brand />
      </div>
      <div className="w-full max-w-sm rounded-[var(--radius)] border border-border bg-surface p-6 sm:p-8">
        <UpdatePasswordForm />
      </div>
      <LocaleSwitcher className="mt-8" />
    </div>
  );
}
