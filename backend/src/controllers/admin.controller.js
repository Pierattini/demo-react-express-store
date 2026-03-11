import { pool } from "../db.js";

export async function getAdminSummary(req, res, next) {
  try {
    const { from, to } = req.query;

    let dateFilter = "";
    let values = [];

    // Si vienen fechas, filtramos orders por created_at
    if (from && to) {
      dateFilter = "AND created_at::date BETWEEN $1::date AND $2::date";
      values = [from, to];
    }

    // Total ventas (solo pagadas)
    const salesResult = await pool.query(
      `
      SELECT COALESCE(SUM(total), 0) AS total_sales
      FROM orders
      WHERE status = 'PAID'
      ${dateFilter}
      `,
      values
    );

    // Total órdenes
    const ordersResult = await pool.query(
      `
      SELECT COUNT(*) AS total_orders
      FROM orders
      WHERE 1=1
      ${dateFilter}
      `,
      values
    );

    // Total usuarios (sin filtro por fecha)
    const usersResult = await pool.query(`
      SELECT COUNT(*) AS total_users
      FROM users
    `);

    res.json({
      totalSales: Number(salesResult.rows[0].total_sales),
      totalOrders: Number(ordersResult.rows[0].total_orders),
      totalUsers: Number(usersResult.rows[0].total_users),
    });
  } catch (error) {
    next(error);
  }
}
