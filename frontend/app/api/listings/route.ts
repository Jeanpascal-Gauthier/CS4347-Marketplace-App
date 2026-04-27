import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const keywords = searchParams.get("keywords")?.trim() || "";
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const inStock = searchParams.get("in_stock") === "true";

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (keywords) {
    conditions.push("(l.title LIKE ? OR l.description LIKE ?)");
    params.push(`%${keywords}%`, `%${keywords}%`);
  }
  if (minPrice !== null && minPrice !== "") {
    conditions.push("l.price >= ?");
    params.push(Number(minPrice));
  }
  if (maxPrice !== null && maxPrice !== "") {
    conditions.push("l.price <= ?");
    params.push(Number(maxPrice));
  }
  if (inStock) {
    conditions.push("l.quantity > 0");
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const sql = `
    SELECT
      l.listing_id,
      l.title,
      l.description,
      l.price,
      l.quantity,
      l.condition,
      l.image_url,
      l.date_posted,
      CONCAT(u.first_name, ' ', SUBSTRING(u.last_name, 1, 1), '.') AS seller
    FROM Listing l
    JOIN Seller s ON l.seller_id = s.user_id
    JOIN \`User\` u ON s.user_id = u.user_id
    ${where}
    ORDER BY l.date_posted DESC
  `;

  try {
    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return Response.json(rows);
  } catch (err) {
    console.error("GET /api/listings error:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { seller_id, title, description, price, quantity, condition } = body;

  if (!seller_id || !title || price == null || !condition) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO Listing (seller_id, title, description, price, quantity, \`condition\`)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [seller_id, title, description ?? null, Number(price), Number(quantity ?? 1), condition]
    );
    return Response.json({ listing_id: result.insertId }, { status: 201 });
  } catch (err) {
    console.error("POST /api/listings error:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
