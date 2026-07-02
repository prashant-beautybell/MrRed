"use client";

import { Button } from "@/components/atoms/Button";
import { SignalLoader } from "@/components/atoms/SignalLoader";
import { SIGNAL_STEP_MS_FAST } from "@/lib/signal-loader-timing";

function GoogleIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.805 12.23c0-.79-.071-1.55-.203-2.28H12v4.316h5.49a4.695 4.695 0 0 1-2.036 3.082v2.558h3.294c1.928-1.775 3.057-4.393 3.057-7.676Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.077-.914 6.77-2.47l-3.294-2.557c-.914.613-2.083.975-3.476.975-2.67 0-4.93-1.804-5.737-4.228H2.859v2.637A9.997 9.997 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.263 13.72A5.996 5.996 0 0 1 5.942 12c0-.598.108-1.176.321-1.72V7.643H2.859A9.998 9.998 0 0 0 2 12c0 1.614.386 3.142 1.072 4.357l3.191-2.637Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.052c1.5 0 2.848.516 3.909 1.531l2.931-2.93C17.072 2.995 14.755 2 12 2a9.997 9.997 0 0 0-9.141 5.643l3.404 2.637C7.07 7.856 9.33 6.052 12 6.052Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GoogleAuthButton({
  mode,
  loading,
  disabled,
  onClick,
}: {
  mode: "signin" | "signup";
  loading: boolean;
  disabled?: boolean;
  onClick: () => void | Promise<void>;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full bg-white"
      disabled={disabled}
      onClick={onClick}
    >
      {loading ? (
        <SignalLoader size="sm" stepMs={SIGNAL_STEP_MS_FAST} />
      ) : (
        <>
          <GoogleIcon />
          {mode === "signin" ? "Continue with Google" : "Sign up with Google"}
        </>
      )}
    </Button>
  );
}
