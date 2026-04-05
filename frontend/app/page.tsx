import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Buy & Sell with Ease
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
          A marketplace where buyers and sellers connect. List your products, discover deals, and manage orders — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/browse">
            <Button className="px-6 py-3 text-base">Browse Marketplace</Button>
          </Link>
          <Link href="/create-listing">
            <Button variant="outline" className="px-6 py-3 text-base">Start Selling</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}