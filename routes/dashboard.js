const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /dashboard/stats
router.get("/stats", (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM products) AS totalProducts,
      (SELECT COALESCE(SUM(quantity), 0) FROM products) AS totalStock,
      (SELECT COUNT(*) FROM suppliers) AS totalSuppliers,
      (SELECT COUNT(*) FROM categories) AS totalCategories
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching dashboard stats:", err);
      return res.status(500).json({ error: "Database error fetching dashboard stats" });
    }

    res.json(results[0]);
  });
});

module.exports = router;
