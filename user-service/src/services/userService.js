import db from "../config/db.js";
import bcrypt from "bcrypt";

// 🧩 REGISTER USER
export const registerUser = async (username, password, role = "user") => {
  // Cek apakah username sudah ada
  const [existing] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  if (existing.length > 0) throw new Error("Username already exists");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user baru
  const [result] = await db.query(
    "INSERT INTO users (username, password, role, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())",
    [username, hashedPassword, role]
  );

  // Ambil data user yang baru disimpan
  const [userRows] = await db.query(
    "SELECT id, username, role FROM users WHERE id = ?",
    [result.insertId]
  );

  return userRows[0];
};

// 🧩 LOGIN USER
export const loginUser = async (username, password) => {
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  if (rows.length === 0) throw new Error("User not found");

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return { id: user.id, username: user.username, role: user.role };
};
