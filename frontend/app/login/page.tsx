"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(isSignUp ? "Account created (demo)" : "Signed in (demo)");
            }}
            className="space-y-4"
          >
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
                  <Input id="address" name="address" placeholder="123 Main St, Dallas, TX" required />
                </div>

                <div>
                  <label htmlFor="payment_info" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Info (Card Number)
                  </label>
                  <Input id="payment_info" name="payment_info" placeholder="4242 4242 4242 4242" required />
                </div>
              </>
            )}

            <Button type="submit" className="w-full">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
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