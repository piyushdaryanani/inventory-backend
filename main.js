const express = require("express");
const cors = require("cors");
const db = require("./db"); // your MySQL connection file

// Example routers (you can create them later)
const categoriesRouter = require("./routes/categories");
const suppliersRouter = require("./routes/suppliers");
const productsRouter = require("./routes/products");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/categories", categoriesRouter);
app.use("/suppliers", suppliersRouter);
app.use("/products", productsRouter);
app.use("/dashboard", dashboardRoutes);


// Default route
app.get("/", (req, res) => {
  res.send("📦 IMS API is running and connected to MySQL");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
