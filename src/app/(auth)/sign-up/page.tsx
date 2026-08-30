import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata = {
  title: "Sign Up | M.A.X",
  description: "Create your pseudonymous M.A.X account",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
