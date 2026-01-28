import { Router } from "express";
import { pool } from "../config/db";

export const personRouter = Router();

personRouter.get("/", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Nincs belépve" });
    }

    const { rows } = await pool.query(`
    SELECT person.id, person.name, person.phone, person.email, person.comment,
      company.id AS company_id, company.name AS company_name
      
    FROM persons person JOIN companies company ON company.id = person.company_ref
    
    WHERE person.status = true AND company.status = true
    
    ORDER BY person.id ASC;
  `);

    res.json(rows);
});

personRouter.post("/", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Nincs belépve" });
    }

    const { name, company_ref, phone, email, comment } = req.body;

    if (!name || !company_ref) {
        return res.status(400).json({ message: "Hiányzó mezők" });
    }

    const result = await pool.query(
        `
    INSERT INTO persons (name, company_ref, phone, email, comment, status)
    VALUES ($1, $2, $3, $4, $5, true)
    RETURNING *
    `,[name, company_ref, phone || null, email || null, comment || null]);

    res.status(201).json(result.rows[0]);
});
