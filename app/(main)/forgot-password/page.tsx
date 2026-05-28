import ForgotPasswordForm from "@/components/forms/forgot-password-form";

export const metadata = {
  title: "Forgot Password | Savvy Bee Deals",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <ForgotPasswordForm />
    </div>
  );
}
