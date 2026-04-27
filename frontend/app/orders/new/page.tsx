"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Listing = {
  listing_id: number;
  title: string;
  price: number;
  quantity: number;
  seller: string;
};

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listing");

  const [listing, setListing] = useState<Listing | null>(null);
  const [loadError, setLoadError] = useState("");
  const [qty, setQty] = useState(1);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    if (!listingId) {
      router.push("/cart");
      return;
    }
    fetch(`/api/listings/${listingId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setLoadError(data.error);
        else setListing(data);
      })
      .catch(() => setLoadError("Could not load listing."));
  }, [listingId, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");

    const user = JSON.parse(localStorage.getItem("user")!);
    const form = new FormData(e.currentTarget);

    const shippingAddr = [
      form.get("ship_address"),
      form.get("ship_city"),
      form.get("ship_state"),
      form.get("ship_zip"),
    ].filter(Boolean).join(", ");

    const cardNum = (form.get("card_number") as string) ?? "";
    const paymentInfo = `Card ending ${cardNum.replace(/\s/g, "").slice(-4)}`;

    setSubmitLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer_id: user.user_id,
          listing_id: listingId,
          quantity: qty,
          shipping_addr: shippingAddr,
          payment_info: paymentInfo,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Failed to place order");
        return;
      }
      router.push("/orders");
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  }

  const total = listing ? (listing.price * qty).toFixed(2) : "—";

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Order Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {loadError ? (
            <p className="text-red-600 text-sm">{loadError}</p>
          ) : listing ? (
            <>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{listing.title}</p>
                  <p className="text-sm text-gray-500">Qty: {qty} · Seller: {listing.seller}</p>
                </div>
                <span className="font-semibold text-gray-900">${total}</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">${total}</span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Loading...</p>
          )}
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Place Order</CardTitle>
          <CardDescription>Enter your shipping and payment details to complete your purchase.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Shipping Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ship_first" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <Input id="ship_first" name="ship_first" placeholder="Jean" required />
                  </div>
                  <div>
                    <label htmlFor="ship_last" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <Input id="ship_last" name="ship_last" placeholder="Doe" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="ship_address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <Input id="ship_address" name="ship_address" placeholder="123 Main St" required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="ship_city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <Input id="ship_city" name="ship_city" placeholder="Dallas" required />
                  </div>
                  <div>
                    <label htmlFor="ship_state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <Input id="ship_state" name="ship_state" placeholder="TX" required />
                  </div>
                  <div>
                    <label htmlFor="ship_zip" className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                    <Input id="ship_zip" name="ship_zip" placeholder="75001" required />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Payment Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="card_name" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                  <Input id="card_name" name="card_name" placeholder="Jean Doe" required />
                </div>
                <div>
                  <label htmlFor="card_number" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <Input id="card_number" name="card_number" placeholder="4242 4242 4242 4242" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="card_exp" className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
                    <Input id="card_exp" name="card_exp" placeholder="MM/YY" required />
                  </div>
                  <div>
                    <label htmlFor="card_cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <Input id="card_cvv" name="card_cvv" placeholder="123" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                  <Input id="billing_address" name="billing_address" placeholder="Same as shipping or enter new address" required />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <Input id="quantity" name="quantity" type="number" min="1"
                max={listing?.quantity ?? 99} value={qty}
                onChange={(e) => setQty(Number(e.target.value))} required />
            </div>

            {submitError && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{submitError}</p>
            )}

            <Button type="submit" className="w-full text-base py-3" disabled={submitLoading || !listing}>
              {submitLoading ? "Placing order..." : "Place Order"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-500">Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
