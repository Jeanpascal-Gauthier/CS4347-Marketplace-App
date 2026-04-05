"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function OrderPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Order Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Vintage Leather Jacket</p>
              <p className="text-sm text-gray-500">Qty: 1 · Seller: Reid M.</p>
            </div>
            <span className="font-semibold text-gray-900">$89.99</span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">$89.99</span>
          </div>
        </CardContent>
      </Card>

      {/* Place Order Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Place Order</CardTitle>
          <CardDescription>
            Enter your shipping and payment details to complete your purchase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Order placed (demo)");
            }}
            className="space-y-6"
          >
            {/* Shipping Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Shipping Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ship_first" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input id="ship_first" name="ship_first" placeholder="Jean" required />
                  </div>
                  <div>
                    <label htmlFor="ship_last" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input id="ship_last" name="ship_last" placeholder="Doe" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="ship_address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <Input id="ship_address" name="ship_address" placeholder="123 Main St" required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="ship_city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <Input id="ship_city" name="ship_city" placeholder="Dallas" required />
                  </div>
                  <div>
                    <label htmlFor="ship_state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <Input id="ship_state" name="ship_state" placeholder="TX" required />
                  </div>
                  <div>
                    <label htmlFor="ship_zip" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <Input id="ship_zip" name="ship_zip" placeholder="75001" required />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing / Payment Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Payment Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="card_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card
                  </label>
                  <Input id="card_name" name="card_name" placeholder="Jean Doe" required />
                </div>
                <div>
                  <label htmlFor="card_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <Input id="card_number" name="card_number" placeholder="4242 4242 4242 4242" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="card_exp" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date
                    </label>
                    <Input id="card_exp" name="card_exp" placeholder="MM/YY" required />
                  </div>
                  <div>
                    <label htmlFor="card_cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <Input id="card_cvv" name="card_cvv" placeholder="123" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Address
                  </label>
                  <Input id="billing_address" name="billing_address" placeholder="Same as shipping or enter new address" required />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <Input id="quantity" name="quantity" type="number" min="1" defaultValue="1" required />
            </div>

            <Button type="submit" className="w-full text-base py-3">
              Place Order
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}