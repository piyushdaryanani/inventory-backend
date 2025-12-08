CREATE DATABASE IF NOT EXISTS ims;
USE ims;

-- TABLE: categories
CREATE TABLE categories (
  category_id INT(100) NOT NULL AUTO_INCREMENT,
  category_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (category_id),
  UNIQUE KEY uq_categories_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO categories (category_id, category_name) VALUES
(1, 'Electronics'),
(2, 'Office Supplies'),
(3, 'Groceries');

-- TABLE: suppliers
CREATE TABLE suppliers (
  supplier_id INT(100) NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) DEFAULT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (supplier_id),
  UNIQUE KEY uq_suppliers_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO suppliers (supplier_id, name, email, phone, address) VALUES
(1, 'Acme Distribution', 'sales@acme.example', '+1-555-0100', '101 Acme Way, Vancouver, BC'),
(2, 'NorthWest Wholesale', 'hello@nww.example', '+1-555-0101', '22 River Rd, Prince George, BC'),
(3, 'Everyday Goods Co.', 'orders@egc.example', '+1-555-0102', '5 Market St, Kelowna, BC');

-- TABLE: products
CREATE TABLE products (
  product_id INT(100) NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  sku VARCHAR(64) NOT NULL,
  category_id INT(100) NOT NULL,
  supplier_id INT(100) DEFAULT NULL,
  price_cents INT(100) NOT NULL,
  quantity INT(100) NOT NULL DEFAULT '0',
  PRIMARY KEY (product_id),
  UNIQUE KEY uq_products_sku (sku),
  KEY idx_products_category (category_id),
  KEY idx_products_supplier (supplier_id),
  KEY idx_products_name (name),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (category_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers (supplier_id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO products (product_id, name, sku, category_id, supplier_id, price_cents, quantity) VALUES
(1, 'USB-C Cable 1m', 'USB1M-BLK', 1, 1, 1299, 50),
(2, 'A4 Printer Paper 500ct', 'PAPER-A4-500', 2, 2, 899, 200),
(3, 'Almond Milk 1L', 'ALM-1L', 3, 3, 349, 30),
(4, 'HDMI Cable 2m', 'HDMI2M-BLK', 1, 1, 1699, 40);
