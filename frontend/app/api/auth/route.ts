import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const SALT_ROUNDS = 10;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  //login
  if (action === "login") {
    const { email, password } = body;
    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 });
    }

    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT user_id, first_name, last_name, email, password FROM `User` WHERE email = ?",
        [email]
      );

      if (rows.length === 0) {
        return Response.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const stored = rows[0].password as string;

      // Support bcrypt hashes (new users) and plaintext (seed/demo users)
      const isBcrypt = stored.startsWith("$2");
      const valid = isBcrypt
        ? await bcrypt.compare(password, stored)
        : password === stored;

      if (!valid) {
        return Response.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const { password: _pw, ...user } = rows[0];
      return Response.json({ user });
    } catch (err) {
      console.error("login error:", err);
      return Response.json({ error: "Database error" }, { status: 500 });
    }
  }

  //signup
    if (action === "signup") {
    const { first_name, last_name, email, password, address, payment_info } = body;
    if (!first_name || !last_name || !email || !password) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query<ResultSetHeader>(
        "INSERT INTO `User` (first_name, last_name, email, password, address) VALUES (?, ?, ?, ?, ?)",
        [first_name, last_name, email, hashed, address ?? null]
      );
      const user_id = result.insertId;

      await conn.query(
        "INSERT INTO Buyer (user_id, dft_payment) VALUES (?, ?)",
        [user_id, payment_info ?? null]
      );

      await conn.commit();
      return Response.json(
        { user: { user_id, first_name, last_name, email } },
        { status: 201 }
      );
    } catch (err: unknown) {
      await conn.rollback();
      if ((err as { code?: string }).code === "ER_DUP_ENTRY") {
        return Response.json({ error: "Email already in use" }, { status: 409 });
      }
      console.error("signup error:", err);
      return Response.json({ error: "Database error" }, { status: 500 });
    } finally {
      conn.release();
    }
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
