import { pool } from "../db.js";

export async function getAdminSummary(req, res, next) {
  try {
    console.log("===== ADMIN SUMMARY =====");
    console.log("QUERY PARAMS:", req.query);
    console.log("DATABASE URL:", process.env.DATABASE_URL);

    const { from, to } = req.query;

    let dateFilter = "";
    let values = [];

    if (from && to) {
      dateFilter = "AND created_at::date BETWEEN $1::date AND $2::date";
      values = [from, to];
    }

    console.log("DATE FILTER:", dateFilter);
    console.log("VALUES:", values);

    const salesResult = await pool.query(
      `
      SELECT COALESCE(SUM(total), 0) AS total_sales
      FROM orders
      WHERE status = 'PAID'
      ${dateFilter}
      `,
      values
    );

    const ordersResult = await pool.query(
      `
      SELECT COUNT(*) AS total_orders
      FROM orders
      WHERE 1=1
      ${dateFilter}
      `,
      values
    );

    const usersResult = await pool.query(`
      SELECT COUNT(*) AS total_users
      FROM users
    `);

    console.log("SUMMARY RESULT:", {
      totalSales: salesResult.rows[0].total_sales,
      totalOrders: ordersResult.rows[0].total_orders,
      totalUsers: usersResult.rows[0].total_users,
    });

    res.json({
      totalSales: Number(salesResult.rows[0].total_sales),
      totalOrders: Number(ordersResult.rows[0].total_orders),
      totalUsers: Number(usersResult.rows[0].total_users),
    });

  } catch (error) {
    console.error("ADMIN SUMMARY ERROR:", error);
    next(error);
  }
}