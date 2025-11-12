"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function SignUp({ redirectTo }: { redirectTo: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) return toast.error("Passwords do not match.");
    await authClient.signUp.email(
      {
        name,
        email,
        password, // user password -> min 8 characters by default
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          router.push(redirectTo || "/courses");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-primary text-2xl font-bold">Create a new account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to create a new account
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <label htmlFor="name" className="text-sm leading-none font-medium">
            Name
          </label>
          <Input
            id="name"
            value={name}
            type="name"
            placeholder="Fulan Al-Fulanī..."
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <label htmlFor="email" className="text-sm leading-none font-medium">
            Email
          </label>
          <Input
            id="email"
            value={email}
            type="email"
            placeholder="m@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <label htmlFor="password" className="text-sm leading-none font-medium">
            Password
          </label>
          <Input
            id="password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3">
          <label htmlFor="confirm" className="text-sm leading-none font-medium">
            Confirm password
          </label>
          <Input
            id="confirm"
            value={confirmPassword}
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button disabled={isLoading}>Sign up</Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link
          href={redirectTo ? `/login?redirect=${redirectTo}` : "/login"}
          className="text-primary underline-offset-4 transition-all hover:text-teal-800 hover:underline"
        >
          Log in
        </Link>
      </div>
    </form>
  );
}
