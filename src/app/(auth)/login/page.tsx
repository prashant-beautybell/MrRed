"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Spinner } from "@/components/atoms/Spinner";
import { Container } from "@/components/templates/Container";
import { signIn } from "@/lib/auth-client";
import { TrafficLight } from "@/components/organisms/TrafficLight";

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

    const result = await signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message ?? "Invalid credentials");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  const handleDevContinue = () => {
    document.cookie = `${DEV_LOGGED_OUT_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-muted/30">
        <div className="max-w-md w-full">
          <Logo size="lg" className="mb-8 justify-center" />
          <TrafficLight />
          <p className="text-center text-muted-foreground mt-6 text-sm">
            Red stop · Amber check · Green go
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <Container size="sm" className="px-0">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
            <p className="text-muted-foreground text-sm mb-6">
              Sign in to analyze deals with MrRed
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
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-signal-red bg-signal-red-bg rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner size="sm" /> : "Sign in"}
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
          </div>
        </Container>
      </div>
    </div>
  );
}
