import { pool } from "../db.js";

/* ======================
   CREAR PEDIDO (USER)
====================== */
export async function createOrder(userId, items, shippingData, paymentMethod) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Obtener productos activos
    const productIds = items.map((i) => i.product_id);

    const { rows: products } = await client.query(
      `
      SELECT id, price, stock
      FROM products
      WHERE id = ANY($1) AND active = true
      `,
      [productIds]
    );

    if (products.length !== items.length) {
      throw new Error("Producto no encontrado o inactivo");
    }

    // 2️⃣ Validar stock y calcular total
    let total = 0;

    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id);

      if (!product) {
        throw new Error("Producto inválido");
      }

      if (product.stock < item.quantity) {
        throw new Error("Stock insuficiente");
      }

      total += product.price * item.quantity;
    }
     
    // 3️⃣ Crear orden
    const initialStatus =
  paymentMethod === "bank_transfer"
    ? "pending_transfer"
    : "pending_payment";
    const { rows: [order] } = await client.query(
  `
  INSERT INTO orders (user_id, total, status, payment_method)
  VALUES ($1, $2, $3, $4)
  RETURNING id, total, status, created_at
  `,
  [userId, total, initialStatus, paymentMethod]
);

    // 4️⃣ Insertar datos de envío (CORREGIDO)
    await client.query(
      `
      INSERT INTO order_shipping (order_id, full_name, address, phone, notes)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        order.id,
        shippingData.full_name,
        shippingData.address,
        shippingData.phone,
        shippingData.notes || null
      ]
    );

    // 5️⃣ Crear items + descontar stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id);

      await client.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        `,
        [order.id, item.product_id, item.quantity, product.price]
      );

      await client.query(
        `
        UPDATE products
        SET stock = stock - $1
        WHERE id = $2
        `,
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");

    return order;

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/* ======================
   USER - MIS PEDIDOS
====================== */
export async function getOrdersByUser(userId) {
  const { rows } = await pool.query(
    `
    SELECT id, total, status, created_at, payment_method
FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return rows;
}

/* ======================
   USER / ADMIN - DETALLE PEDIDO
====================== */
export async function getOrderById(orderId) {
  const { rows: orderRows } = await pool.query(
    `
    SELECT 
      o.id,
      o.user_id,
      o.total,
      o.status,
      o.payment_method,
      o.created_at,
      os.full_name,
      os.address,
      os.phone,
      os.notes
    FROM orders o
    LEFT JOIN order_shipping os ON os.order_id = o.id
    WHERE o.id = $1
    `,
    [orderId]
  );

  if (!orderRows[0]) return null;

  const { rows: items } = await pool.query(
    `
    SELECT
      oi.product_id,
      p.name,
      p.image_url,
      oi.quantity,
      oi.price
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1
    `,
    [orderId]
  );

  let bankDetails = null;

  if (orderRows[0].payment_method === "bank_transfer") {
    const { rows } = await pool.query(
      `
      SELECT bank_name, bank_account, bank_holder
      FROM site_settings
      ORDER BY id DESC
      LIMIT 1
      `
    );

    bankDetails = rows[0] || null;
  }

  return {
    ...orderRows[0],
    items,
    bankDetails, // 🔥 ESTA LÍNEA ES LA CLAVE
  };
}

/* ======================
   ADMIN - TODOS LOS PEDIDOS
====================== */
export async function getAllOrders() {
  const { rows } = await pool.query(
    `
    SELECT o.id, o.total, o.status, o.created_at, u.email
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
    `
  );

  return rows;
}

/* ======================
   ADMIN - CAMBIAR ESTADO
====================== */
export async function updateOrderStatus(orderId, status) {
  const allowedStatuses = [
  "pending_transfer",
  "pending_payment",
  "paid",
  "cancelled",
  "shipped"
];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Estado inválido");
  }

  const { rows } = await pool.query(
    `
    UPDATE orders
    SET status = $1
    WHERE id = $2
    RETURNING id, status
    `,
    [status, orderId]
  );

  return rows[0];
}

/* ======================
   ADMIN - CANCELAR PEDIDO
   (DEVUELVE STOCK)
====================== */
export async function cancelOrder(orderId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: items } = await client.query(
      `
      SELECT product_id, quantity
      FROM order_items
      WHERE order_id = $1
      `,
      [orderId]
    );

    if (items.length === 0) {
      throw new Error("Pedido no encontrado");
    }

    for (const item of items) {
      await client.query(
        `
        UPDATE products
        SET stock = stock + $1
        WHERE id = $2
        `,
        [item.quantity, item.product_id]
      );
    }

    await client.query(
      `
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = $1
      `,
      [orderId]
    );

    await client.query("COMMIT");

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getBankDetails() {
  const { rows } = await pool.query(
    `SELECT bank_name, bank_account, bank_holder
     FROM site_settings
     ORDER BY id DESC
     LIMIT 1`
  );

  return rows[0] || null;
}


/* ======================
   ADMIN - ELIMINAR PEDIDO
====================== */
export async function deleteOrderService(orderId) {
  await pool.query(
    `DELETE FROM orders WHERE id = $1`,
    [orderId]
  );
}

export async function updateOrder(orderId, items, shippingData) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Verificar estado editable
    const { rows } = await client.query(
      `SELECT status FROM orders WHERE id = $1`,
      [orderId]
    );

    if (!rows[0]) throw new Error("Pedido no encontrado");

    const editableStatuses = ["pending_transfer", "pending_payment"];

    if (!editableStatuses.includes(rows[0].status)) {
      throw new Error("Pedido no editable");
    }

    // 2️⃣ Obtener items actuales para devolver stock
    const { rows: oldItems } = await client.query(
      `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
      [orderId]
    );

    for (const item of oldItems) {
      await client.query(
        `UPDATE products SET stock = stock + $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // 3️⃣ Eliminar items antiguos
    await client.query(
      `DELETE FROM order_items WHERE order_id = $1`,
      [orderId]
    );

    // 4️⃣ Recalcular total
    let total = 0;

    for (const item of items) {
      const { rows: productRows } = await client.query(
        `SELECT price, stock FROM products WHERE id = $1`,
        [item.product_id]
      );

      const product = productRows[0];

      if (!product) throw new Error("Producto inválido");
      if (product.stock < item.quantity) throw new Error("Stock insuficiente");

      total += product.price * item.quantity;

      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, product.price]
      );

      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // 5️⃣ Actualizar total
    await client.query(
      `UPDATE orders SET total = $1 WHERE id = $2`,
      [total, orderId]
    );

    // 6️⃣ Actualizar shipping
    await client.query(
      `UPDATE order_shipping
       SET full_name = $1,
           address = $2,
           phone = $3,
           notes = $4
       WHERE order_id = $5`,
      [
        shippingData.full_name,
        shippingData.address,
        shippingData.phone,
        shippingData.notes || null,
        orderId
      ]
    );

    await client.query("COMMIT");

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}


