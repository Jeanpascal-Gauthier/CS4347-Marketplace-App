import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function GET(request: NextRequest) {
  const buyer_id = request.nextUrl.searchParams.get("buyer_id");
  if (!buyer_id) {
    return Response.json({ error: "buyer_id required" }, { status: 400 });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
         o.order_id,
         o.listing_id,
         o.total_price,
         o.quantity,
         o.status,
         o.shipping_addr,
         o.order_date,
         l.title,
         CONCAT(u.first_name, ' ', SUBSTRING(u.last_name, 1, 1), '.') AS seller
       FROM \`Order\` o
       JOIN Listing l ON o.listing_id = l.listing_id
       JOIN Seller s ON l.seller_id = s.user_id
       JOIN \`User\` u ON s.user_id = u.user_id
       WHERE o.buyer_id = ?
       ORDER BY o.order_date DESC`,
      [buyer_id]
    );
    return Response.json(rows);
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { buyer_id, listing_id, quantity, shipping_addr, payment_info } = body;

  if (!buyer_id || !listing_id || !shipping_addr || !payment_info) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [listingRows] = await conn.query<RowDataPacket[]>(
      "SELECT price, quantity FROM Listing WHERE listing_id = ? FOR UPDATE",
      [listing_id]
    );

    if (listingRows.length === 0) {
      await conn.rollback();
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    const listing = listingRows[0];
    const qty = Number(quantity ?? 1);

    if (listing.quantity < qty) {
      await conn.rollback();
      return Response.json({ error: "Insufficient stock" }, { status: 409 });
    }

    const total_price = (listing.price * qty).toFixed(2);

    const [result] = await conn.query<ResultSetHeader>(
      `INSERT INTO \`Order\` (buyer_id, listing_id, total_price, quantity, shipping_addr, payment_info)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [buyer_id, listing_id, total_price, qty, shipping_addr, payment_info]
    );

    await conn.query(
      "UPDATE Listing SET quantity = quantity - ? WHERE listing_id = ?",
      [qty, listing_id]
    );

    await conn.commit();
    return Response.json({ order_id: result.insertId }, { status: 201 });
  } catch (err) {
    await conn.rollback();
    console.error("POST /api/orders error:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  } finally {
    conn.release();
  }
}
