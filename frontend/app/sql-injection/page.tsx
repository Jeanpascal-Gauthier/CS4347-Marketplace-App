"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Row = {
  listing_id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  condition: string;
  seller: string;
};

type ApiResult = {
  sql?: string;
  params?: (string | number)[];
  rows?: Row[];
  error?: string;
};

function ResultTable({ result }: { result: ApiResult | null }) {
  if (!result) return null;
  return (
    <div className="mt-4 space-y-3">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Query sent to DB
        </p>
        <pre className="bg-gray-900 text-green-400 text-xs p-3 rounded-md overflow-x-auto whitespace-pre-wrap break-all">
          {result.sql}
        </pre>
        {result.params && (
          <p className="text-xs text-gray-500 mt-1">
            Bound params: {JSON.stringify(result.params)}
          </p>
        )}
      </div>

      {result.error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm font-semibold text-red-700">DB Error</p>
          <p className="text-xs text-red-600 mt-1 font-mono">{result.error}</p>
        </div>
      ) : (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Results ({result.rows?.length ?? 0} row{result.rows?.length !== 1 ? "s" : ""})
          </p>
          {result.rows && result.rows.length > 0 ? (
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-3 py-2 text-left">ID</th>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th className="px-3 py-2 text-left">Condition</th>
                    <th className="px-3 py-2 text-right">Price</th>
                    <th className="px-3 py-2 text-left">Seller</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.rows.map((r) => (
                    <tr key={r.listing_id} className="bg-white">
                      <td className="px-3 py-2 text-gray-500">{r.listing_id}</td>
                      <td className="px-3 py-2 font-medium text-gray-900">{r.title}</td>
                      <td className="px-3 py-2 text-gray-500">{r.condition}</td>
                      <td className="px-3 py-2 text-right text-gray-900">
                        ${Number(r.price).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-gray-500">{r.seller}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No rows returned.</p>
          )}
        </div>
      )}
    </div>
  );
}

function SearchForm({
  endpoint,
  label,
}: {
  endpoint: "vulnerable" | "secure";
  label: string;
}) {
  const [title, setTitle] = useState("");
  const [condition, setCondition] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const params = new URLSearchParams();
    params.set("title", title);
    params.set("condition", condition);
    if (maxPrice) params.set("max_price", maxPrice);
    const res = await fetch(`/api/sql-injection/${endpoint}?${params}`);
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Jacket"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
        <Input
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="e.g. New"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Max Price ($)</label>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="e.g. 100"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Querying..." : "Search"}
      </Button>
      <ResultTable result={result} />
    </form>
  );
}

export default function SqlInjectionPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SQL Injection Demo</h1>
      </div>

      {/* Injection tip banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-sm text-amber-800">
        Inputs: <code>meaningless_text%' OR 1=1-- , %' OR 1=1-- </code>      
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Part A — Vulnerable */}
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">

              Vulnerable Search
            </CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              Input is interpolated directly into the SQL string. An attacker can alter query
              logic by injecting SQL metacharacters.
            </p>
          </CardHeader>
          <CardContent>
            <SearchForm endpoint="vulnerable" label="API: /api/sql-injection/vulnerable" />
          </CardContent>
        </Card>

        {/* Part B — Secure */}
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">

              Secure Search
            </CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              Input is passed as bound <code>?</code> parameters. The DB driver escapes all
              metacharacters before execution — injection is impossible.
            </p>
          </CardHeader>
          <CardContent>
            <SearchForm endpoint="secure" label="API: /api/sql-injection/secure" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
