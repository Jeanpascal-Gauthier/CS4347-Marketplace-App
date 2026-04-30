import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? "";
  const condition = searchParams.get("condition") ?? "";
  const maxPrice = searchParams.get("max_price") ?? "";

  const sql = `
    SELECT
      l.listing_id,
      l.title,
      l.description,
      l.price,
      l.quantity,
      l.condition,
      CONCAT(u.first_name, ' ', SUBSTRING(u.last_name, 1, 1), '.') AS seller
    FROM Listing l
    JOIN Seller s ON l.seller_id = s.user_id
    JOIN \`User\` u ON s.user_id = u.user_id
    WHERE l.title LIKE ?
    AND l.condition LIKE ?
    AND l.price <= ?
    ORDER BY l.date_posted DESC
    LIMIT 50
  `;

  const params = [
    `%${title}%`,
    `%${condition}%`,
    maxPrice === "" ? 999999 : Number(maxPrice),
  ];

  try {
    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return Response.json({ sql: sql.trim(), params, rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ sql: sql.trim(), params, error: message }, { status: 500 });
  }
}
