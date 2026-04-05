"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CreateListingPage() {
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Listing created (demo)");
            }}
            className="space-y-4"
          >
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
                <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="29.99" required />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity Available
                </label>
                <Input id="quantity" name="quantity" type="number" min="1" placeholder="1" required />
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
                <option value="new">New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <Input id="image" name="image" type="file" accept="image/*" />
              <p className="text-xs text-gray-400 mt-1">Upload a photo of your product (JPG, PNG)</p>
            </div>

            <Button type="submit" className="w-full">
              Publish Listing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}