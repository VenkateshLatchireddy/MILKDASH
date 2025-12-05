const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

console.log("ENV TEST HOST:", process.env.MYSQL_HOST);
console.log("ENV TEST PASS:", process.env.MYSQL_PASSWORD);
const bcrypt = require('bcryptjs');


const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const axios = require("axios");
const app = express();
const router = express.Router();
require("dotenv").config(); // ✅ Load environment variables from .env file



// ✅ Enable CORS for frontend


const allowedOrigins = [
  "https://milkdash-by-venkatesh.netlify.app",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile & curl

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ BLOCKED ORIGIN:", origin);
        return callback(new Error("CORS Not Allowed"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use(bodyParser.json());




// ----------------------------------------------------------
// ✅ UPDATED AIVEN MYSQL CONNECTION (ONLY CHANGE YOU REQUESTED)
// ----------------------------------------------------------
const db = mysql
  .createPool({
    host: process.env.MYSQL_HOST, 
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    // REQUIRED FOR AIVEN MYSQL
    ssl: {
      rejectUnauthorized: false,
    },
  })
  .promise();

module.exports = db;

db.getConnection()
  .then((connection) => {
    console.log("Successfully connected to the Aiven MySQL database!");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

// ----------------------------------------------------------
// YOUR ORIGINAL CODE CONTINUES EXACTLY AS YOU SENT IT
// ----------------------------------------------------------

// ✅ Success message
app.get("/", (req, res) => {
  res.send("Successfully connected to the Backend!");
});

// ---------------------------------------------
// SIGNUP
// ---------------------------------------------
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, contactnumber } = req.body;

    // Validate required fields
    if (!name || !email || !password || !contactnumber) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long." 
      });
    }

    // Check if user already exists
    const checkQuery = `SELECT * FROM users WHERE email = ? OR contactnumber = ?`;
    const [existingUsers] = await db.execute(checkQuery, [email, contactnumber]);

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      if (existingUser.email === email) {
        return res.status(400).json({ 
          message: "Email already registered. Please use another email." 
        });
      }
      if (existingUser.contactnumber === contactnumber) {
        return res.status(400).json({ 
          message: "Contact number already registered. Please use another number." 
        });
      }
    }

    // Hash the password before storing
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default address since you removed address from frontend
    const address = "Not Provided";

    // Insert new user with HASHED password
    const insertQuery = `INSERT INTO users (name, email, password, contactnumber, address) 
                         VALUES (?, ?, ?, ?, ?)`;

    await db.execute(insertQuery, [name, email, hashedPassword, contactnumber, address]);

    res.status(200).json({ message: "Registration successful!" });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user: " + error.message });
  }
});

// ---------------------------------------------
// LOGIN
// ---------------------------------------------
app.post("/login", async (req, res) => {
  try {
    const { emailOrContact, password } = req.body;

    // First, find the user by email or contact number
    const findQuery = `
      SELECT id, name, email, password 
      FROM users 
      WHERE email = ? OR contactnumber = ?
    `;

    const [results] = await db.execute(findQuery, [emailOrContact, emailOrContact]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    
    // Compare the provided password with the hashed password in database
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.status(200).json({
        message: "Login successful!",
        userId: user.id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in: " + error.message });
  }
});

// ---------------------------------------------
// PROFILE (duplicate in your code - kept as-is)
// ---------------------------------------------
app.get("/api/profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const query = `
      SELECT name, email, contactnumber, address 
      FROM users 
      WHERE id = ?
    `;

    const [results] = await db.execute(query, [userId]);

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile: " + error.message });
  }
});

// ---------------------------------------------
// STOCKS
// ---------------------------------------------
app.get("/api/stocks/:productname", async (req, res) => {
  const productname = req.params.productname;

  try {
    const [result] = await db.execute("SELECT stock FROM stocks WHERE productname = ?", [productname]);

    if (result.length > 0) {
      res.json({ stock: result[0].stock });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock", error });
  }
});

// ---------------------------------------------
// UPDATE STOCK
// ---------------------------------------------
app.put("/api/stocks/:productname", async (req, res) => {
  const productname = req.params.productname;
  const { stock } = req.body;

  try {
    await db.execute("UPDATE stocks SET stock = ? WHERE productname = ?", [stock, productname]);
    res.json({ message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error });
  }
});

// ---------------------------------------------
// RECENT ORDER
// ---------------------------------------------
app.get("/api/recent-order/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const query = `
      SELECT * FROM orders 
      WHERE id = ? 
      ORDER BY date DESC, order_id DESC 
      LIMIT 1
    `;

    const [results] = await db.execute(query, [userId]);

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: "No orders found" });
    }
  } catch (error) {
    console.error("Error fetching recent order:", error);
    res.status(500).json({ message: "Error fetching order: " + error.message });
  }
});

// ---------------------------------------------
// PRODUCT PRICES
// ---------------------------------------------
app.get("/api/products", async (req, res) => {
  try {
    const query = "SELECT product_name, price FROM productprices";
    const [results] = await db.execute(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product prices", error });
  }
});

// ---------------------------------------------
// PRODUCT PRICE BY NAME
// ---------------------------------------------
app.get("/api/product-price/:productname", async (req, res) => {
  try {
    const productName = req.params.productname;
    const query = "SELECT price FROM productprices WHERE product_name = ?";
    const [results] = await db.execute(query, [productName]);

    if (results.length > 0) {
      res.status(200).json({ price: results[0].price });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product price", error });
  }
});

// ---------------------------------------------
// DUPLICATE PROFILE ROUTE (kept EXACTLY as-is)
// ---------------------------------------------
app.get("/api/profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const query = "SELECT name, email, contactnumber, address FROM users WHERE id = ?";
    const [results] = await db.execute(query, [userId]);

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile: " + error.message });
  }
});

// ---------------------------------------------
// ORDERS FOR A USER
// ---------------------------------------------
app.get("/api/orders/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const query = "SELECT * FROM orders WHERE id = ?";
    const [orders] = await db.query(query, [userId]);

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// ---------------------------------------------
// DELETE ORDER
// ---------------------------------------------
app.delete("/api/orders/:orderId", async (req, res) => {
  try {
    await db.execute("DELETE FROM orders WHERE order_id = ?", [
      req.params.orderId,
    ]);

    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
});

// ---------------------------------------------
// UPDATE ORDER PROGRESS
// ---------------------------------------------
app.post("/orders/progress", (req, res) => {
  const { order_id, order_progress } = req.body;

  const query =
    "UPDATE orders SET order_progress = ?, date = NOW() WHERE order_id = ?";

  db.query(query, [order_progress, order_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.json({
      success: true,
      message: "Order status updated",
      updated_at: new Date(),
    });
  });
});

// ---------------------------------------------
// PLACE AN ORDER (your full logic untouched)
// ---------------------------------------------
router.post("/api/orders", async (req, res) => {
  const { id, name, contactnumber, productname, quantity, deliveryaddress } =
    req.body;

  try {
    await db.execute("SET time_zone = '+05:30';");

    const stockQuery = `SELECT stock FROM stocks WHERE productname = ?`;
    const [stockResult] = await db.execute(stockQuery, [productname]);

    if (stockResult.length === 0) {
      return res.status(400).json({ message: "Product not found in stock" });
    }

    const currentStock = stockResult[0].stock;

    if (currentStock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const query = `
      INSERT INTO orders 
      (id, name, contactnumber, date, quantity, productname, deliveryaddress, order_progress, delivered_time)
      VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      id,
      name,
      contactnumber,
      quantity,
      productname,
      deliveryaddress,
      "Order In Progress",
      null,
    ]);

    const updateStockQuery = `
      UPDATE stocks
      SET stock = stock - ?
      WHERE productname = ?
    `;

    await db.execute(updateStockQuery, [quantity, productname]);

    res.status(201).json({
      message: "Order placed successfully",
      orderId: result.insertId,
      stockLeft: currentStock - quantity,
    });
  } catch (error) {
    res.status(500).json({ message: "Error placing order" });
  }
});

app.use(router);

// ---------------------------------------------
// ADMIN ROUTES — kept unchanged
// ---------------------------------------------
app.get("/api/users", async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT id, name, email, password, contactnumber, address FROM users"
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  const { name, email, password, contactnumber, address } = req.body;

  try {
    await db.query(
      `UPDATE users SET name=?, email=?, password=?, contactnumber=?, address=? WHERE id=?`,
      [name, email, password, contactnumber, address, req.params.id]
    );

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ---------------------------------------------
app.post("/api/updatePrice", async (req, res) => {
  try {
    await db.query("UPDATE productprices SET price=? WHERE product_name=?", [
      req.body.price,
      req.body.product,
    ]);
    res.json({ message: "Price updated" });
  } catch (err) {
    res.status(500).json({ message: "Price update error" });
  }
});

// ---------------------------------------------
app.get("/api/stocks", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM stocks");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stocks" });
  }
});

// ---------------------------------------------
app.post("/api/updateStock", async (req, res) => {
  try {
    await db.query("UPDATE stocks SET stock=? WHERE productname=?", [
      req.body.stock,
      req.body.productname,
    ]);
    res.json({ message: "Stock updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update stock" });
  }
});

// =============================================
// ✅ FIXED ORDER ROUTES (REPLACED 'pool' WITH 'db')
// =============================================

// Route to get all accepted orders (non-delivered orders)
app.get('/accepted-orders', async (req, res) => {
    console.log('📋 Fetching non-delivered orders...');
    
    try {
        // FIXED: Using single quotes for string literal AND db instead of pool
        const [orders] = await db.query(
            "SELECT * FROM orders WHERE order_progress != 'Order Delivered' ORDER BY date DESC"
        );
        
        console.log(`✅ Found ${orders.length} non-delivered orders`);
        res.json(orders);
        
    } catch (error) {
        console.error('❌ Database error in /accepted-orders:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ SQL message:', error.sqlMessage);
        console.error('❌ SQL query:', error.sql);
        
        res.status(500).json({ 
            error: 'Failed to fetch accepted orders',
            details: error.sqlMessage || error.message 
        });
    }
});

// Get all orders (for admin view)
app.get('/orders-all', async (req, res) => {
    console.log('📋 Fetching all orders...');
    
    try {
        const [orders] = await db.query('SELECT * FROM orders ORDER BY date DESC');
        console.log(`✅ Found ${orders.length} total orders`);
        res.json(orders);
    } catch (error) {
        console.error('❌ Database error in /orders-all:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Update order progress (for dashboard updates)
app.put('/orders/:id/progress', async (req, res) => {
    const orderId = req.params.id;
    const { progress } = req.body;
    
    console.log(`📝 Updating order ${orderId} progress to: ${progress}`);
    
    // Validate progress value matches ENUM
    const validProgress = ['Order In Progress', 'Order Confirmed', 'Out for Delivery', 'Order Delivered'];
    if (!validProgress.includes(progress)) {
        return res.status(400).json({ error: 'Invalid progress value' });
    }
    
    try {
        await db.query(
            'UPDATE orders SET order_progress = ? WHERE order_id = ?',
            [progress, orderId]
        );
        
        console.log(`✅ Order ${orderId} progress updated to ${progress}`);
        res.json({ message: 'Order progress updated successfully' });
    } catch (error) {
        console.error('❌ Database error updating order progress:', error);
        res.status(500).json({ error: 'Failed to update order progress' });
    }
});

// Get delivered orders
app.get('/delivered-orders', async (req, res) => {
    console.log('📋 Fetching delivered orders...');
    
    try {
        const [orders] = await db.query(
            "SELECT * FROM orders WHERE order_progress = 'Order Delivered' ORDER BY date DESC"
        );
        
        console.log(`✅ Found ${orders.length} delivered orders`);
        res.json(orders);
    } catch (error) {
        console.error('❌ Database error in /delivered-orders:', error);
        res.status(500).json({ error: 'Failed to fetch delivered orders' });
    }
});

// ---------------------------------------------
// ✅ FIXED: Your existing order progress update (keep this one too)
app.put("/orders/progress", async (req, res) => {
  try {
    const { order_id, order_progress } = req.body;

    let query = "";
    let params = [];

    if (order_progress === "Order Delivered") {
      query =
        "UPDATE orders SET order_progress='Order Delivered', delivered_time=CURRENT_TIMESTAMP WHERE order_id=?";
      params = [order_id];
    } else {
      query = "UPDATE orders SET order_progress=? WHERE order_id=?";
      params = [order_progress, order_id];
    }

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0)
      return res.status(404).send("Order not found.");

    res.send("Order progress updated");
  } catch (err) {
    res.status(500).send("Update failed");
  }
});

// ---------------------------------------------
const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );

    if (!response.data.length) return null;

    return {
      latitude: response.data[0].lat,
      longitude: response.data[0].lon,
    };
  } catch (error) {
    return null;
  }
};

// ---------------------------------------------
app.get("/customer-location/:order_id", async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT deliveryaddress FROM orders WHERE order_id=?",
      [req.params.order_id]
    );

    if (!result.length)
      return res.status(404).json({ error: "Order not found" });

    const coords = await geocodeAddress(result[0].deliveryaddress);

    if (!coords)
      return res.status(500).json({ error: "Could not geocode address" });

    res.json(coords);
  } catch (err) {
    res.status(500).json({ error: "Query error" });
  }
});

// ---------------------------------------------
app.get("/api/getPrices", async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT product_name, price FROM productprices"
    );

    const priceData = {};
    results.forEach((item) => {
      priceData[item.product_name] = item.price;
    });

    res.json(priceData);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------------------------------
// START SERVER
// ---------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

module.exports = router;