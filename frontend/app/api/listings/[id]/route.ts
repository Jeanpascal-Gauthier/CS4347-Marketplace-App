import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
         l.listing_id,
         l.title,
         l.description,
         l.price,
         l.quantity,
         l.condition,
         l.image_url,
         l.date_posted,
         l.seller_id,
         CONCAT(u.first_name, ' ', SUBSTRING(u.last_name, 1, 1), '.') AS seller
       FROM Listing l
       JOIN Seller s ON l.seller_id = s.user_id
       JOIN \`User\` u ON s.user_id = u.user_id
       WHERE l.listing_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }
    return Response.json(rows[0]);
  } catch (err) {
    console.error("GET /api/listings/[id] error:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
