"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const sampleListings = [
  {
    listing_id: 1,
    title: "Vintage Leather Jacket",
    description: "Classic brown leather jacket in great condition. Size M.",
    price: 89.99,
    quantity: 1,
    condition: "Good",
    seller: "Reid M.",
    date_posted: "2026-03-28",
  },
  {
    listing_id: 2,
    title: 'MacBook Pro 14" (2024)',
    description: "M3 Pro chip, 18GB RAM, 512GB SSD. Barely used, comes with charger.",
    price: 1499.0,
    quantity: 1,
    condition: "Like New",
    seller: "Garrett H.",
    date_posted: "2026-03-30",
  },
  {
    listing_id: 3,
    title: "Calculus Textbook (8th Edition)",
    description: "James Stewart Calculus. Some highlighting but all pages intact.",
    price: 45.0,
    quantity: 3,
    condition: "Fair",
    seller: "Gabriel S.",
    date_posted: "2026-04-01",
  },
  {
    listing_id: 4,
    title: "Wireless Noise-Canceling Headphones",
    description: "Sony WH-1000XM5. Black. Includes case and cable.",
    price: 229.99,
    quantity: 2,
    condition: "New",
    seller: "Jean-Pascal G.",
    date_posted: "2026-04-02",
  },
  {
    listing_id: 5,
    title: "Standing Desk (Adjustable)",
    description: "Electric sit-stand desk, 48x24 inches. White top, black frame.",
    price: 199.0,
    quantity: 1,
    condition: "Good",
    seller: "Reid M.",
    date_posted: "2026-04-03",
  },
  {
    listing_id: 6,
    title: "Nintendo Switch OLED",
    description: "White model with dock. Includes Pro Controller and 3 games.",
    price: 310.0,
    quantity: 1,
    condition: "Like New",
    seller: "Gabriel S.",
    date_posted: "2026-04-03",
  },
];

export default function BrowsePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Marketplace</h1>

      {/* Search / Filter Form */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Search executed (demo — results below are sample data)");
            }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <Input name="keywords" placeholder="Search keywords..." />
            </div>
            <div className="w-32">
              <Input name="min_price" type="number" min="0" step="0.01" placeholder="Min $" />
            </div>
            <div className="w-32">
              <Input name="max_price" type="number" min="0" step="0.01" placeholder="Max $" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
              <input type="checkbox" name="in_stock" className="rounded border-gray-300" />
              In stock only
            </label>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sampleListings.map((listing) => (
          <Card key={listing.listing_id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              {/* Placeholder image area */}
              <div className="w-full h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-300 text-sm">
                Product Image
              </div>

              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-900 text-base leading-tight">
                  {listing.title}
                </h3>
                <span className="text-lg font-bold text-gray-900 ml-2 whitespace-nowrap">
                  ${listing.price.toFixed(2)}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{listing.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  {listing.condition} · {listing.quantity} available
                </span>
                <span>{listing.seller}</span>
              </div>

              <Button variant="outline" className="w-full mt-4" asChild>
                <a href={`/orders?listing=${listing.listing_id}`}>Place Order</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}