import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

const schema = z.object({
  name: z.string().min(2, "Min 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export default function SignupForm() {
  const { signup, signupLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(signup)} className="space-y-4">
      <Input label="Name" placeholder="John Doe" error={errors.name?.message} {...register("name")} />
      <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
      <Input label="Password" type="password" placeholder="••••••" error={errors.password?.message} {...register("password")} />
      <Button type="submit" className="w-full" loading={signupLoading}>Sign Up</Button>
    </form>
  );
}