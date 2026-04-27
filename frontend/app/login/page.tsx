"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload: Record<string, string> = { action: isSignUp ? "signup" : "login" };
    for (const [key, value] of form.entries()) {
      payload[key] = value.toString();
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userUpdated"));
      router.push("/browse");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
          <CardDescription>
            {isSignUp
              ? "Sign up to start buying and selling on the marketplace."
              : "Welcome back. Sign in to your account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <Input id="first_name" name="first_name" placeholder="Jean" required />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <Input id="last_name" name="last_name" placeholder="Doe" required />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>

            {isSignUp && (
              <>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Input id="address" name="address" placeholder="123 Main St, Dallas, TX" />
                </div>
                <div>
                  <label htmlFor="payment_info" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Info (Card Number)
                  </label>
                  <Input id="payment_info" name="payment_info" placeholder="4242 4242 4242 4242" />
                </div>
              </>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              className="text-gray-900 font-medium underline underline-offset-2 hover:text-gray-700"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
