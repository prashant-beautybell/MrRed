"use client";

import { Check, Dot } from "lucide-react";
import { passwordRequirementChecks } from "@/lib/auth-validation";

export function PasswordRequirements({
  password,
}: {
  password: string;
}) {
  const unmetRules = passwordRequirementChecks.filter(
    (rule) => !rule.test(password)
  );

  if (password.length === 0) {
    return (
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {passwordRequirementChecks.map((rule) => (
          <li key={rule.id} className="flex items-center gap-2">
            <Dot className="h-4 w-4 shrink-0" aria-hidden />
            <span>{rule.label}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (unmetRules.length === 0) {
    return (
      <p className="flex items-center gap-2 text-sm text-emerald-600">
        <Check className="h-4 w-4 shrink-0" aria-hidden />
        <span>All password requirements are met</span>
      </p>
    );
  }

  return (
    <ul className="space-y-1.5 text-sm text-muted-foreground">
      {unmetRules.map((rule) => (
        <li key={rule.id} className="flex items-center gap-2">
          <Dot className="h-4 w-4 shrink-0" aria-hidden />
            <span>{rule.label}</span>
        </li>
      ))}
    </ul>
  );
}
