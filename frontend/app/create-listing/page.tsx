"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      router.push("/login");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(stored);
    const form = new FormData(e.currentTarget);

    const payload = {
      seller_id: user.user_id,
      title: form.get("title"),
      description: form.get("description"),
      price: form.get("price"),
      quantity: form.get("quantity"),
      condition: form.get("condition"),
    };

    setLoading(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to create listing");
        return;
      }

      setSuccess(`Listing #${data.listing_id} created successfully!`);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => router.push("/browse"), 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a Listing</CardTitle>
          <CardDescription>
            Fill out the details below to list your product on the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Product Title
              </label>
              <Input id="title" name="title" placeholder="e.g. Vintage Leather Jacket" required />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe your product in detail..."
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00" required />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity Available
                </label>
                <Input id="quantity" name="quantity" type="number" min="0" placeholder="0" required />
              </div>
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              >
                <option value="">Select condition...</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <Input id="image" name="image" type="file" accept="image/*" />
              <p className="text-xs text-gray-400 mt-1">Upload a photo of your product (JPG, PNG)</p>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">{success}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Publishing..." : "Publish Listing"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
