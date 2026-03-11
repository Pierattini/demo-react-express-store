import Stripe from "stripe";
import { pool } from "../db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /payments/stripe/checkout-session
export async function createStripeCheckoutSession(req, res, next) {
  try {
    const userId = req.user.id;
    const { items, shippingData } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items inválidos" });
    }

    if (!shippingData?.full_name || !shippingData?.address || !shippingData?.phone) {
      return res.status(400).json({ message: "Faltan datos de despacho" });
    }

    // 1) Traer productos reales desde BD (precio/stock)
    const productIds = items.map((i) => i.product_id);
    const { rows: products } = await pool.query(
      `SELECT id, name, price, stock
       FROM products
       WHERE id = ANY($1) AND active = true`,
      [productIds]
    );

    if (products.length !== items.length) {
      return res.status(400).json({ message: "Producto no encontrado" });
    }

    // 2) Validar stock + armar line_items
    const line_items = [];
    let total = 0;

    for (const item of items) {
      const p = products.find((x) => x.id === item.product_id);
      if (!p) return res.status(400).json({ message: "Producto no encontrado" });
      if (p.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente: ${p.name}` });
      }

      total += Number(p.price) * item.quantity;

      line_items.push({
        quantity: item.quantity,
        price_data: {
          currency: "eur", // 👈 cambia si necesitas (ej: "clp")
          unit_amount: Math.round(Number(p.price) * 100), // si tu price viene en euros (ej 9.99)
          product_data: {
            name: p.name,
          },
        },
      });
    }

    // 3) Crear order PENDING + shipping + items + descontar stock (igual que tu lógica)
    //    OJO: aquí lo hacemos en transacción para dejarlo listo ANTES de pagar.
    const client = await pool.connect();
    let order;

    try {
      await client.query("BEGIN");

      const { rows: created } = await client.query(
        `INSERT INTO orders (user_id, total, status, payment_method)
VALUES ($1, $2, 'pending', 'stripe')
RETURNING id, total, status`,
        [userId, total]
      );

      order = created[0];

      await client.query(
        `
        INSERT INTO order_shipping (order_id, full_name, address, phone, notes)
VALUES ($1, $2, $3, $4, $5)
        `,
        [
    order.id,
    shippingData.full_name,   // ✅ ahora sí
    shippingData.address,
    shippingData.phone,
    shippingData.notes || null
  ]
      );

      for (const item of items) {
        const p = products.find((x) => x.id === item.product_id);

        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [order.id, item.product_id, item.quantity, p.price]
        );

        await client.query(
          `UPDATE products SET stock = stock - $1 WHERE id = $2`,
          [item.quantity, item.product_id]
        );
      }

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }

    // 4) Crear sesión Stripe (Checkout)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.FRONTEND_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?cancelled=1`,
      metadata: {
        order_id: String(order.id),
        user_id: String(userId),
      },
    });

    // 5) Guardar session_id en order
    await pool.query(
      `UPDATE orders SET stripe_session_id = $1 WHERE id = $2`,
      [session.id, order.id]
    );

    return res.json({ url: session.url, orderId: order.id });
  } catch (error) {
    next(error);
  }
}

// POST /payments/stripe/webhook
export async function stripeWebhook(req, res, next) {
  try {
    const sig = req.headers["stripe-signature"];
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body, // 👈 raw body (por eso configuramos express.raw en la ruta)
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;

      if (orderId) {
        await pool.query(
          `
          UPDATE orders
          SET status = 'paid', paid_at = NOW()
          WHERE id = $1
          `,
          [orderId]
        );
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
}

// GET /payments/stripe/order-status?session_id=...
export async function getOrderStatusBySession(req, res, next) {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ message: "Falta session_id" });
    }

    const { rows } = await pool.query(
      `
      SELECT id
      FROM orders
      WHERE stripe_session_id = $1
      LIMIT 1
      `,
      [session_id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.json({ orderId: rows[0].id });
  } catch (error) {
    next(error);
  }
}