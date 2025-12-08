const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all products (with category & supplier names)
router.get("/", (req, res) => {
  const sql = `
    SELECT
      p.product_id,
      p.name,
      p.sku,
      p.price_cents,
      p.quantity,
      p.category_id,
      p.supplier_id,
      c.category_name,
      s.name AS supplier_name
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
    ORDER BY p.product_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res
        .status(500)
        .json({ error: "Database error fetching products" });
    }
    res.json(results);
  });
});

// GET single product by id
router.get("/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT
      p.product_id,
      p.name,
      p.sku,
      p.price_cents,
      p.quantity,
      p.category_id,
      p.supplier_id,
      c.category_name,
      s.name AS supplier_name
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
    WHERE p.product_id = ?
  `;

  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res
        .status(500)
        .json({ error: "Database error fetching product" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(rows[0]);
  });
});

// helper: handle duplicate SKU
function handleProductError(err, res, action) {
  console.error(`Error ${action} product:`, err);

  if (err.code === "ER_DUP_ENTRY") {
    // unique index on sku hit
    return res.status(400).json({
      error: "SKU already exists. Please use a different SKU.",
      code: "SKU_EXISTS",
    });
  }

  return res
    .status(500)
    .json({ error: `Database error ${action} product` });
}

// CREATE product
router.post("/", (req, res) => {
  const { name, sku, category_id, supplier_id, price_cents, quantity } =
    req.body;

  if (!name || !sku || !category_id || price_cents == null) {
    return res.status(400).json({
      error: "Missing required fields (name, sku, category_id, price_cents).",
    });
  }

  const sql = `
    INSERT INTO products
      (name, sku, category_id, supplier_id, price_cents, quantity)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const params = [
    name,
    sku,
    category_id,
    supplier_id || null,
    price_cents,
    quantity ?? 0,
  ];

  db.query(sql, params, (err, result) => {
    if (err) return handleProductError(err, res, "creating");

    res.status(201).json({ product_id: result.insertId });
  });
});

// UPDATE product
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, sku, category_id, supplier_id, price_cents, quantity } =
    req.body;

  if (!name || !sku || !category_id || price_cents == null) {
    return res.status(400).json({
      error: "Missing required fields (name, sku, category_id, price_cents).",
    });
  }

  const sql = `
    UPDATE products
    SET
      name = ?,
      sku = ?,
      category_id = ?,
      supplier_id = ?,
      price_cents = ?,
      quantity = ?
    WHERE product_id = ?
  `;

  const params = [
    name,
    sku,
    category_id,
    supplier_id || null,
    price_cents,
    quantity ?? 0,
    id,
  ];

  db.query(sql, params, (err, result) => {
    if (err) return handleProductError(err, res, "updating");

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated" });
  });
});

// DELETE product
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM products WHERE product_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting product:", err);
        return res
          .status(500)
          .json({ error: "Database error deleting product" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ message: "Product deleted" });
    }
  );
});

module.exports = router;
