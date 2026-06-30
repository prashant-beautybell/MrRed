"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { PasswordInput } from "@/components/molecules/PasswordInput";
import { Label } from "@/components/atoms/Label";
import { SignalLoader } from "@/components/atoms/SignalLoader";
import { SIGNAL_STEP_MS_FAST } from "@/lib/signal-loader-timing";
import { signIn } from "@/lib/auth-client";

const DEV_LOGGED_OUT_COOKIE = "mrred_dev_logged_out";
const isDevMode = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn.email({ email, password });

      if (result.error) {
        setError(result.error.message ?? "Invalid credentials");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not sign in. Check your connection and try again.");
    } finally {
      setLoading(false);
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-sm text-signal-red bg-signal-red-bg rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
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
