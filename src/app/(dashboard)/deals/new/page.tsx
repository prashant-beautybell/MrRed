"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/templates/PageHeader";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Spinner } from "@/components/atoms/Spinner";
import Link from "next/link";

export default function NewDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    industry: "",
    description: "",
    dealValue: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        dealValue: form.dealValue ? parseFloat(form.dealValue) : undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to create deal");
      setLoading(false);
      return;
    }

    const deal = await res.json();
    router.push(`/deals/${deal.id}`);
  };

  return (
    <div>
      <PageHeader
        title="New Deal Analysis"
        description="Enter company details to begin background research and scoring"
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-6 rounded-xl border border-border bg-card p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Deal Name</Label>
            <Input
              id="name"
              placeholder="e.g. Acme Corp Acquisition"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              placeholder="Acme Corporation"
              value={form.companyName}
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="Technology, Healthcare, etc."
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Deal Value ($)</Label>
            <Input
              id="value"
              type="number"
              placeholder="5000000"
              value={form.dealValue}
              onChange={(e) => setForm({ ...form, dealValue: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of the deal opportunity"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-signal-red bg-signal-red-bg rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Create & Analyze"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/deals">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
