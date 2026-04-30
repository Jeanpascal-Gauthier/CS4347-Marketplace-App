"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { getCartCount } from "@/lib/cart";

type User = { user_id: number; first_name: string; last_name: string; email: string };

export default function NavClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);

  function syncState() {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
    setCartCount(getCartCount());
  }

  useEffect(() => {
    syncState();
    window.addEventListener("storage", syncState);
    window.addEventListener("cartUpdated", syncState);
    window.addEventListener("userUpdated", syncState);
    return () => {
      window.removeEventListener("storage", syncState);
      window.removeEventListener("cartUpdated", syncState);
      window.removeEventListener("userUpdated", syncState);
    };
  }, []);

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-6">
      <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
        Browse
      </Link>
      <Link href="/create-listing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
        Sell
      </Link>
      <Link href="/orders" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
        Orders
      </Link>
      <Link href="/sql-injection" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
        SQL Demo
      </Link>

      {/* Cart icon with badge */}
      <Link href="/cart" className="relative text-gray-600 hover:text-gray-900 transition-colors">
        <ShoppingCart size={18} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </Link>

      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700 font-medium">{user.first_name}</span>
          <button
            onClick={logout}
            className="text-sm font-medium text-white bg-gray-900 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Log Out
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="text-sm font-medium text-white bg-gray-900 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}
