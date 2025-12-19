import bcrypt from "bcryptjs";
import { db } from "../db.js";

export const signup = (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const q = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(q, [name, email, hashedPassword], (err) => {
    if (err) return res.status(400).json(err);
    res.status(201).json({ message: "User created successfully" });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [email], (err, data) => {
    if (err || data.length === 0)
      return res.status(404).json({ message: "User not found" });

    const isValid = bcrypt.compareSync(password, data[0].password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });

    // ⚠️ JWT can be added later
    const { password: _, ...userData } = data[0];
    res.json(userData);
  });
};
