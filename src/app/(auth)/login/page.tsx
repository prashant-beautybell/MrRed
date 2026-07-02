"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { PasswordInput } from "@/components/molecules/PasswordInput";
import { GoogleAuthButton } from "@/components/molecules/GoogleAuthButton";
import { Label } from "@/components/atoms/Label";
import { SignalLoader } from "@/components/atoms/SignalLoader";
import { SIGNAL_STEP_MS_FAST } from "@/lib/signal-loader-timing";
import { signIn } from "@/lib/auth-client";
import { signInSchema } from "@/lib/auth-validation";

const DEV_LOGGED_OUT_COOKIE = "mrred_dev_logged_out";
const isDevMode = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your details and try again.");
      return;
    }

    setLoading("email");

    try {
      const result = await signIn.email(parsed.data);

      if (result.error) {
        setError(result.error.message ?? "Invalid credentials");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not sign in. Check your connection and try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleDevContinue = () => {
    document.cookie = `${DEV_LOGGED_OUT_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Sign in to your everyday companion
      </p>

      <GoogleAuthButton
        mode="signin"
        loading={loading === "google"}
        disabled={loading !== null}
        onClick={async () => {
          setError("");
          setLoading("google");
          try {
            await signIn.social({
              provider: "google",
              callbackURL: "/dashboard",
              errorCallbackURL: "/login",
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={128}
            required
            autoComplete="current-password"
          />
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
            "Sign in"
          )}
        </Button>
      </form>

      {isDevMode && (
        <Button
          type="button"
          variant="outline"
          className="w-full mt-3"
          onClick={handleDevContinue}
          disabled={loading !== null}
        >
          Continue as Dev User
        </Button>
      )}

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}
