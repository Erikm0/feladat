import { Router } from "express";
import { pool } from "../config/db";
import bcrypt from "bcrypt";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Nincs belépve" });
    }

    const { rows } = await pool.query(`
    SELECT u.id, u.login, u.admin, p.id AS person_id, p.name AS person_name
    FROM users u
    JOIN persons p ON p.id = u.person_ref
    WHERE u.status = true AND p.status = true
    ORDER BY u.id ASC
`);

    res.json(rows);
});

userRouter.post("/", async (req, res) => {
    if (!req.session.user || !req.session.user.admin) {
        return res.status(403).json({ message: "Admin jog szükséges" });
    }

    const { person_ref, login, password, admin } = req.body;

    if (!person_ref || !login || !password || admin === undefined) {
        return res.status(400).json({ message: "Hiányzó mezők" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `
        INSERT INTO users (person_ref, login, password, admin, status)
        VALUES ($1, $2, $3, $4, true)
        RETURNING id, login, admin
        `,
        [person_ref, login, hashedPassword, admin]
    );

    res.status(201).json(result.rows[0]);
});

