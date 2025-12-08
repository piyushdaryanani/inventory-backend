const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * GET /categories
 * Returns all categories
 */
router.get("/", (req, res) => {
  const sql = `
    SELECT
      category_id,
      category_name
    FROM categories
    ORDER BY category_id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.status(500).json({ error: "Database error fetching categories" });
    }
    res.json(results);
  });
});

/**
 * GET /categories/:id
 */
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT category_id, category_name FROM categories WHERE category_id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching category:", err);
        return res.status(500).json({ error: "Database error fetching category" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(results[0]);
    }
  );
});

/**
 * POST /categories
 * Body: { category_name }
 */
router.post("/", (req, res) => {
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: "category_name is required" });
  }

  const sql = "INSERT INTO categories (category_name) VALUES (?)";

  db.query(sql, [category_name], (err, result) => {
    if (err) {
      console.error("Error adding category:", err);
      return res.status(500).json({ error: "Database error adding category" });
    }

    res.json({
      message: "Category added",
      category_id: result.insertId
    });
  });
});

/**
 * PUT /categories/:id
 * Body: { category_name }
 */
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: "category_name is required" });
  }

  const sql = `
    UPDATE categories
    SET category_name = ?
    WHERE category_id = ?
  `;

  db.query(sql, [category_name, id], (err, result) => {
    if (err) {
      console.error("Error updating category:", err);
      return res.status(500).json({ error: "Database error updating category" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category updated" });
  });
});

/**
 * DELETE /categories/:id
 */
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM categories WHERE category_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting category:", err);
        return res.status(500).json({ error: "Database error deleting category" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json({ message: "Category deleted" });
    }
  );
});

module.exports = router;
