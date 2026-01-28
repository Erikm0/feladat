import { Router } from "express";
import { pool } from "../config/db";
import bcrypt from "bcrypt";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
    const { login, password } = req.body as { login: string; password: string };

    const { rows } = await pool.query(
        "SELECT id, login, password, admin FROM users WHERE login=$1 AND status=true",
        [login]
    );

    const user = rows[0];
    if (!user) return res.status(401).json({ message: "Hibás login" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Hibás login" });

    req.session.user = { id: user.id, login: user.login, admin: user.admin };
    res.json({ ok: true });
});

authRouter.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ ok: true });
    });
});

authRouter.get("/status", (req, res) => {
    res.json({ user: req.session.user || null });
});
