"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { addToCart } from "@/lib/cart";

type Listing = {
  listing_id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  condition: string;
  seller: string;
  date_posted: string;
  image_url: string | null;
};

export default function BrowsePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keywords, setKeywords] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [added, setAdded] = useState<number | null>(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (keywords) params.set("keywords", keywords);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (inStock) params.set("in_stock", "true");

    try {
      const res = await fetch(`/api/listings?${params}`);
      if (!res.ok) throw new Error();
      setListings(await res.json());
    } catch {
      setError("Could not load listings. Is the database running?");
    } finally {
      setLoading(false);
    }
  }, [keywords, minPrice, maxPrice, inStock]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  function handleAddToCart(listing: Listing) {
    addToCart({
      listing_id: listing.listing_id,
      title: listing.title,
      price: listing.price,
      quantity: 1,
      maxQty: listing.quantity,
      seller: listing.seller,
      image_url: listing.image_url,
    });
    setAdded(listing.listing_id);
    setTimeout(() => setAdded(null), 1500);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Marketplace</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form
            onSubmit={(e) => { e.preventDefault(); fetchListings(); }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <Input name="keywords" placeholder="Search keywords..." value={keywords}
                onChange={(e) => setKeywords(e.target.value)} />
            </div>
            <div className="w-32">
              <Input name="min_price" type="number" min="0" step="0.01" placeholder="Min $"
                value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            </div>
            <div className="w-32">
              <Input name="max_price" type="number" min="0" step="0.01" placeholder="Max $"
                value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
              <input type="checkbox" name="in_stock" className="rounded border-gray-300"
                checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
              In stock only
            </label>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <p className="text-red-600 text-sm mb-6 bg-red-50 px-4 py-3 rounded-md">{error}</p>
      )}

      {loading ? (
        <p className="text-gray-500 text-center py-16">Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => (
            <Card key={listing.listing_id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="w-full h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-300 text-sm">
                  {listing.image_url
                    ? <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover rounded-md" />
                    : "Product Image"}
                </div>

                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 text-base leading-tight">{listing.title}</h3>
                  <span className="text-lg font-bold text-gray-900 ml-2 whitespace-nowrap">
                    ${Number(listing.price).toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{listing.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>{listing.condition} · {listing.quantity} available</span>
                  <span>{listing.seller}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleAddToCart(listing)}
                    disabled={listing.quantity === 0}
                  >
                    {added === listing.listing_id ? "Added!" : "Add to Cart"}
                  </Button>
                  <Button className="flex-1" asChild disabled={listing.quantity === 0}>
                    <a href={`/orders/new?listing=${listing.listing_id}`}>Buy Now</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
