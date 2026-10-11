# Inventory Management System: Back End

REST API for an inventory management system: products, categories, suppliers, and stock
levels, plus a dashboard summary. Built with Node.js and Express over a MySQL database.
The Angular front end is in [inventory-frontend](https://github.com/piyushdaryanani/inventory-frontend).

## Endpoints
| Route | What it does |
|---|---|
| `/products` | Create, read, update, and delete products and their stock levels |
| `/categories` | Manage product categories |
| `/suppliers` | Manage suppliers |
| `/dashboard` | Summary numbers for the admin dashboard |

The schema (`db.sql`) uses primary and foreign keys so products always point to a real
category and supplier.

## Tech stack
Node.js · Express · MySQL · REST APIs

## Run it locally
```bash
git clone https://github.com/piyushdaryanani/inventory-backend.git
cd inventory-backend
mysql -u root -p < db.sql      # creates the ims database and tables
npm install
npm start                      # API on http://localhost:3000
```
Database connection settings are in `db.js`.
