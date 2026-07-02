"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { PasswordInput } from "@/components/molecules/PasswordInput";
import { GoogleAuthButton } from "@/components/molecules/GoogleAuthButton";
import { PasswordRequirements } from "@/components/molecules/PasswordRequirements";
import { Label } from "@/components/atoms/Label";
import { SignalLoader } from "@/components/atoms/SignalLoader";
import { SIGNAL_STEP_MS_FAST } from "@/lib/signal-loader-timing";
import { signIn, signUp } from "@/lib/auth-client";
import {
  PASSWORD_MIN_LENGTH,
  signUpSchema,
} from "@/lib/auth-validation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = signUpSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your details and try again.");
      return;
    }

    setLoading("email");

    try {
      const result = await signUp.email(parsed.data);

      if (result.error) {
        setError(result.error.message ?? "Failed to create account");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not create account. Check your connection and try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">Create account</h1>
      <p className="text-muted-foreground text-sm mb-6">
        One clear verdict on every decision
      </p>

      <GoogleAuthButton
        mode="signup"
        loading={loading === "google"}
        disabled={loading !== null}
        onClick={async () => {
          setError("");
          setLoading("google");
          try {
            await signIn.social({
              provider: "google",
              callbackURL: "/dashboard",
              newUserCallbackURL: "/dashboard",
              errorCallbackURL: "/signup",
              requestSignUp: true,
            });
          } catch {
            setError("Could not continue with Google. Try again.");
            setLoading(null);
          }
        }}
      />

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder={`Min. ${PASSWORD_MIN_LENGTH} characters`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={PASSWORD_MIN_LENGTH}
            maxLength={128}
            required
            autoComplete="new-password"
          />
          <PasswordRequirements password={password} />
        </div>

        {error && (
          <p className="text-sm text-signal-red bg-signal-red-bg rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading !== null}>
          {loading === "email" ? (
            <SignalLoader size="sm" stepMs={SIGNAL_STEP_MS_FAST} />
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
