const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * GET /suppliers
 * Returns all suppliers
 */
router.get("/", (req, res) => {
  const sql = `
    SELECT
      supplier_id,
      name,
      email,
      phone,
      address
    FROM suppliers
    ORDER BY supplier_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching suppliers:", err);
      return res.status(500).json({ error: "Database error fetching suppliers" });
    }
    res.json(results);
  });
});

/**
 * GET /suppliers/:id
 */
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT supplier_id, name, email, phone, address FROM suppliers WHERE supplier_id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching supplier:", err);
        return res.status(500).json({ error: "Database error fetching supplier" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      res.json(results[0]);
    }
  );
});

/**
 * POST /suppliers
 * Body: { name, email, phone, address }
 */
router.post("/", (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!name || !email || !phone || !address) {
    return res.status(400).json({
      error: "All supplier fields (name, email, phone, address) are required."
    });
  }

  const sql = `
    INSERT INTO suppliers (name, email, phone, address)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, email, phone, address], (err, result) => {
    if (err) {
      console.error("Error adding supplier:", err);
      return res.status(500).json({ error: "Database error adding supplier" });
    }

    res.json({
      message: "Supplier added",
      supplier_id: result.insertId
    });
  });
});

/**
 * PUT /suppliers/:id
 * Body: { name, email, phone, address }
 */
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, phone, address } = req.body;

  if (!name || !email || !phone || !address) {
    return res.status(400).json({
      error: "All supplier fields (name, email, phone, address) are required."
    });
  }

  const sql = `
    UPDATE suppliers
    SET name = ?, email = ?, phone = ?, address = ?
    WHERE supplier_id = ?
  `;

  db.query(sql, [name, email, phone, address, id], (err, result) => {
    if (err) {
      console.error("Error updating supplier:", err);
      return res.status(500).json({ error: "Database error updating supplier" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json({ message: "Supplier updated" });
  });
});

/**
 * DELETE /suppliers/:id
 */
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM suppliers WHERE supplier_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting supplier:", err);
        return res.status(500).json({ error: "Database error deleting supplier" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      res.json({ message: "Supplier deleted" });
    }
  );
});

module.exports = router;
