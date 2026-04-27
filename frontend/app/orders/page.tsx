"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Order = {
  order_id: number;
  listing_id: number;
  title: string;
  total_price: number;
  quantity: number;
  status: string;
  shipping_addr: string;
  order_date: string;
  seller: string;
};

const STATUS_COLORS: Record<string, string> = {
  Pending:    "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped:    "bg-purple-100 text-purple-800",
  Delivered:  "bg-green-100 text-green-800",
  Cancelled:  "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(stored);
    fetch(`/api/orders?buyer_id=${user.user_id}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        else setError(data.error ?? "Failed to load orders");
      })
      .catch(() => setError("Network error. Is the database running?"))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <Button asChild variant="outline">
          <Link href="/browse">Browse More</Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-16">Loading your orders...</p>
      ) : error ? (
        <p className="text-red-600 bg-red-50 px-4 py-3 rounded-md text-sm">{error}</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="mb-4">You haven&apos;t placed any orders yet.</p>
          <Button asChild><Link href="/browse">Start Shopping</Link></Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.order_id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-semibold">{order.title}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                    {order.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-1">
                <p>Order #{order.order_id} · {new Date(order.order_date).toLocaleDateString()}</p>
                <p>
                  Qty: {order.quantity} · Total:{" "}
                  <span className="font-semibold text-gray-900">${Number(order.total_price).toFixed(2)}</span>
                </p>
                <p>Seller: {order.seller}</p>
                <p className="text-xs text-gray-400">Ship to: {order.shipping_addr}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
