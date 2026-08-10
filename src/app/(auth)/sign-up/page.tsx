import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata = {
  title: "Sign Up | MAX",
  description: "Create your pseudonymous MAX account",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
