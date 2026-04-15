import { pool } from "../db.js";

/* ======================
   PUBLIC
====================== */
export async function getAllProducts() {
  const { rows } = await pool.query(`
    SELECT 
      id,
      name,
      name_en,
      description,
      description_en,
      price,
      stock,
      image_url AS image,
      colors,
      is_featured,
      featured_order,
      active
    FROM products
    WHERE active = true
    ORDER BY id
  `);

  return rows;
}

export async function getFeaturedProducts() {
  const { rows } = await pool.query(`
    SELECT 
      id,
      name,
      name_en,
      description,
      description_en,
      price,
      stock,
      image_url AS image,
      colors
    FROM products
    WHERE active = true 
      AND is_featured = true
    ORDER BY featured_order ASC
    LIMIT 6
  `);

  return rows;
}

/* ======================
   ADMIN
====================== */
export async function createProduct(data) {

  const { 
  name,
  name_en,
  description,
  description_en,
  price,
  stock,
  image_url,
  colors = [],
  is_featured = false,
  featured_order = 0,
  active = true
} = data;

  const { rows } = await pool.query(
  `
  INSERT INTO products 
  (
    name,
    name_en,
    description,
    description_en,
    price,
    stock,
    image_url,
    colors,
    is_featured,
    featured_order,
    active
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
  RETURNING *
  `,
    [
  name,
  name_en,
  description,
  description_en,
  price,
  stock,
  image_url,
  JSON.stringify(colors),
  is_featured,
  featured_order,
  active
]
  );

  return rows[0];
}

export async function updateProduct(id, data) {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in data) {
    if (data[key] !== undefined) {
      fields.push(`${key}=$${index}`);

      if (key === "colors") {
        values.push(JSON.stringify(data[key]));
      } else {
        values.push(data[key]);
      }

      index++;
    }
  }

  if (fields.length === 0) {
    throw new Error("No hay campos para actualizar");
  }

  values.push(id);

  const query = `
    UPDATE products
    SET ${fields.join(", ")}
    WHERE id=$${index}
    RETURNING *
  `;

  const { rows } = await pool.query(query, values);

  return rows[0];
}

export async function deleteProduct(id) {
  await pool.query(
    `UPDATE products SET active = false WHERE id = $1`,
    [id]
  );
}