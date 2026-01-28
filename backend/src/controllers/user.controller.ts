import { Request, Response } from "express";
import { pool } from "../config/db";

export async function testDb(req: Request, res: Response) {
    const r = await pool.query("SELECT NOW() as now");
    res.json(r.rows[0]);
}
