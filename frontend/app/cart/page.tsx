"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getCart, removeFromCart, updateQty, CartItem } from "@/lib/cart";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  function refresh() {
    setItems(getCart());
  }

  useEffect(() => {
    refresh();
    window.addEventListener("cartUpdated", refresh);
    return () => window.removeEventListener("cartUpdated", refresh);
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center text-gray-500">
        <p className="mb-4 text-lg">Your cart is empty.</p>
        <Button asChild><Link href="/browse">Browse Marketplace</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <Card key={item.listing_id}>
            <CardContent className="pt-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-300 text-xs flex-shrink-0">
                {item.image_url
                  ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover rounded-md" />
                  : "Img"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                <p className="text-sm text-gray-500">{item.seller}</p>
                <p className="text-sm font-medium text-gray-900">${Number(item.price).toFixed(2)} each</p>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max={item.maxQty}
                  value={item.quantity}
                  onChange={(e) => { updateQty(item.listing_id, Number(e.target.value)); refresh(); }}
                  className="w-16 text-center"
                />
                <button
                  onClick={() => { removeFromCart(item.listing_id); refresh(); }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="text-right w-20 flex-shrink-0">
                <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* totals + checkout */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{items.reduce((s, i) => s + i.quantity, 0)} item(s)</span>
            <span className="font-bold text-gray-900 text-base">${total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-400">Each item is checked out separately. Click Checkout on the item you want to order first.</p>
          <div className="space-y-2 pt-1">
            {items.map((item) => (
              <Button key={item.listing_id} asChild className="w-full">
                <Link href={`/orders/new?listing=${item.listing_id}`}>
                  Checkout — {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
