const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const axios = require("axios");
const app = express();
const router = express.Router();
require("dotenv").config(); // ✅ Load environment variables from .env file

// ✅ Enable CORS for frontend
const corsOptions = {
  origin: "https://milkdash-by-venkatesh.netlify.app/",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// ✅ MySQL Connection using Pool (Better Performance)
const db = mysql.createPool({
  host: process.env.MYSQL_HOST, // Use Railway MySQL host
  user: process.env.MYSQL_USER, // Use Railway MySQL user
  password: process.env.MYSQL_PASSWORD, // Use Railway MySQL password
  database: process.env.MYSQL_DATABASE, // Use Railway MySQL database name
  port: process.env.MYSQL_PORT, // Use Railway MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise(); // ✅ Ensures db.promise() works

// ✅ Export DB for other modules
module.exports = db;

db.getConnection()
  .then((connection) => {
    console.log("Successfully connected to the database!");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

// ✅ Success message
app.get("/", (req, res) => {
  res.send("Successfully connected to the Backend!");
});


// ✅ Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, contactnumber, address } = req.body;

    if (!name || !email || !password || !contactnumber || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const query = `INSERT INTO users (name, email, password, contactnumber, address) VALUES (?, ?, ?, ?, ?)`;
    await db.execute(query, [name, email, password, contactnumber, address]);

    res.status(200).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user: " + error.message });
  }
});
// ✅ Login Route
app.post("/login", async (req, res) => {
  try {
    const { emailOrContact, password } = req.body;

    const query = `
      SELECT id, name, email 
      FROM users 
      WHERE (email = ? OR contactnumber = ?) AND password = ?
    `;

    const [results] = await db.execute(query, [emailOrContact, emailOrContact, password]);

    if (results.length > 0) {
      const user = results[0];
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

// ✅ Fetch User Profile by ID
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
// ✅ Update stock after order placement
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

// ✅ Fetch Recent Order by User ID
app.get("/api/recent-order/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Fetching recent order for user ID:", userId); // Debugging line

    const query = `
      SELECT * FROM orders 
      WHERE id = ? 
      ORDER BY date DESC, order_id DESC 
      LIMIT 1
    `; // Fetch the latest order

    const [results] = await db.execute(query, [userId]);

    if (results.length > 0) {
      res.status(200).json(results[0]); // Return only the latest order
    } else {
      res.status(404).json({ message: "No orders found" });
    }
  } catch (error) {
    console.error("Error fetching recent order:", error);
    res.status(500).json({ message: "Error fetching order: " + error.message });
  }
});
app.get("/api/products", async (req, res) => {
  try {
    const query = "SELECT product_name, price FROM productprices";
    const [results] = await db.execute(query);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching product prices:", error);
    res.status(500).json({ message: "Error fetching product prices", error });
  }
});
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
    console.error("Error fetching product price:", error);
    res.status(500).json({ message: "Error fetching product price", error });
  }
});

// ✅ Success message
app.get("/", (req, res) => {
  res.send("Successfully connected to the Backend!");
});

// ✅ Fetch User Profile by ID
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
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile: " + error.message });
  }
});

// ✅ Fetch Orders for a User
// Fetch orders
app.get("/api/orders/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("Fetching orders for user ID:", userId); // Debugging

  try {
    const query = "SELECT * FROM orders WHERE id = ?";
    const [orders] = await db.query(query, [userId]);

    // Log the raw date from the database
    console.log("Raw date from database:", orders[0].date); // Debugging

    // Return orders as-is (date is already in IST)
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error); // Debugging
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// ✅ Delete Order by Order ID
app.delete("/api/orders/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const query = "DELETE FROM orders WHERE order_id = ?";
    await db.execute(query, [orderId]);

    res.status(200).json({ message: "Order deleted successfully!" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order: " + error.message });
  }
});


app.post('/orders/progress', (req, res) => {
  const { order_id, order_progress } = req.body;
  const query = "UPDATE orders SET order_progress = ?, date = NOW() WHERE order_id = ?";

  db.query(query, [order_progress, order_id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json({ success: true, message: "Order status updated", updated_at: new Date() });
    }
  });
});

// ✅ Place a new order and update stock

// Import the MySQL pool instance from your DB configuration
 // Make sure the path to your DB config is correct

// POST: Create a new order
router.post("/api/orders", async (req, res) => {
  const { id, name, contactnumber, productname, quantity, deliveryaddress } = req.body;

  console.log("Received order data:", req.body); // Log the data received

  if (!id || !name || !contactnumber || !productname || !quantity || !deliveryaddress) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const orderProgress = 'Order In Progress'; // Default status
  const deliveredTime = null; // No delivered time initially

  try {
    // Set the MySQL session time zone to IST
    await db.execute("SET time_zone = '+05:30';");

    // Check the current stock before placing the order
    const stockQuery = `SELECT stock FROM stocks WHERE productname = ?`;
    const [stockResult] = await db.execute(stockQuery, [productname]);

    if (stockResult.length === 0) {
      return res.status(400).json({ message: "Product not found in stock" });
    }

    const currentStock = stockResult[0].stock;

    // Check if there is enough stock for the order
    if (currentStock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // SQL query to insert the new order into the 'orders' table
    const query = `
      INSERT INTO orders (id, name, contactnumber, date, quantity, productname, deliveryaddress, order_progress, delivered_time)
      VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      id, 
      name, 
      contactnumber, 
      quantity, 
      productname, 
      deliveryaddress, 
      orderProgress, 
      deliveredTime
    ]);

    console.log("Order inserted successfully, result:", result); // Log the result of insertion

    // Update the stock in the 'stocks' table
    const updateStockQuery = `
      UPDATE stocks
      SET stock = stock - ?
      WHERE productname = ?
    `;

    const [updateResult] = await db.execute(updateStockQuery, [quantity, productname]);

    // Check if the stock update was successful
    if (updateResult.affectedRows === 0) {
      return res.status(500).json({ message: "Failed to update stock" });
    }

    // Send a success response with the order ID and remaining stock
    res.status(201).json({
      message: "Order placed successfully",
      orderId: result.insertId, // The ID of the newly inserted order
      stockLeft: currentStock - quantity // Remaining stock after the order
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order. Please try again later." });
  }
});



app.use(router); // Register the router with the app

// ✅ Fetch all orders for a specific user
router.get("/api/orders/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const query = "SELECT * FROM orders WHERE id = ?";
        const [orders] = await db.execute(query, [userId]);

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found." });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// ✅ Fetch stock for a product
router.get("/api/stocks/:productname", async (req, res) => {
    try {
        const { productname } = req.params;
        const [stockResult] = await db.execute("SELECT stock FROM stocks WHERE productname = ?", [productname]);

        if (stockResult.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json({ stock: stockResult[0].stock });
    } catch (error) {
        console.error("Error fetching stock:", error);
        res.status(500).json({ message: "Server error." });
    }
});




// ---------------------------------------------------
// ✅ Admin    code      =---------------------------
// ---------------------------------------------------

// 1️⃣ Fetch All Users
app.get('/api/users', async (req, res) => {
  try {
      const [results] = await db.query('SELECT id, name, email, password, contactnumber, address FROM users');
      res.json(results);
  } catch (err) {
      console.error('❌ Error fetching users:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2️⃣ Update User Details
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password, contactnumber, address } = req.body;

  const sql = `UPDATE users SET name=?, email=?, password=?, contactnumber=?, address=? WHERE id=?`;
  try {
      await db.query(sql, [name, email, password, contactnumber, address, id]);
      res.json({ message: '✅ User updated successfully' });
  } catch (err) {
      console.error('❌ Error updating user:', err);
      return res.status(500).json({ error: 'Failed to update user' });
  }
});

// ---------------------------------------------------
// ✅ Product Price Routes
// ---------------------------------------------------

// 3️⃣ Update Product Price
app.post('/api/updatePrice', async (req, res) => {
  const { product, price } = req.body;
  const query = `UPDATE productprices SET price = ? WHERE product_name = ?`;
  try {
      await db.query(query, [price, product]);
      res.json({ message: '✅ Price updated successfully' });
  } catch (err) {
      console.error('❌ Error updating price:', err);
      return res.status(500).json({ message: 'Error updating price' });
  }
});

// ---------------------------------------------------
// ✅ Stocks Routes
// ---------------------------------------------------

// 4️⃣ Get all stocks
app.get('/api/stocks', async (req, res) => {
  try {
      const [results] = await db.query('SELECT * FROM stocks');
      res.json(results);
  } catch (err) {
      console.error('❌ Error fetching stocks:', err);
      return res.status(500).json({ error: 'Failed to fetch stocks' });
  }
});

// 5️⃣ Update stock for a specific product
app.post('/api/updateStock', async (req, res) => {
  const { productname, stock } = req.body;

  if (!productname || stock === undefined) {
      return res.status(400).json({ error: 'Product name and stock value are required' });
  }

  const sql = 'UPDATE stocks SET stock = ? WHERE productname = ?';
  try {
      await db.query(sql, [stock, productname]);
      res.json({ message: '✅ Stock updated successfully' });
  } catch (err) {
      console.error('❌ Error updating stock:', err);
      return res.status(500).json({ error: 'Failed to update stock' });
  }
});

// ---------------------------------------------------
// ✅ Order Routes     
// ---------------------------------------------------

// 6️⃣ Fetch all accepted orders (excluding delivered orders)
app.get('/accepted-orders', async (req, res) => {
  const query = 'SELECT * FROM orders WHERE order_progress != "Order Delivered" ORDER BY date DESC';
  try {
      const [result] = await db.query(query);
      res.json(result);
  } catch (err) {
      return res.status(500).json({ message: 'Error fetching orders', error: err });
  }
});

// 7️⃣ Update order progress
app.put('/orders/progress', async (req, res) => {
  const { order_id, order_progress } = req.body;

  const validStatuses = ["Order Confirmed", "Out for Delivery", "Order Delivered"];

  if (!order_id || !order_progress || !validStatuses.includes(order_progress)) {
      return res.status(400).json({ message: 'Invalid order progress or missing fields' });
  }

  let query;
  let params;

  if (order_progress === 'Order Delivered') {
      query = `UPDATE orders SET order_progress = 'Order Delivered', delivered_time = CURRENT_TIMESTAMP WHERE order_id = ?`;
      params = [order_id];
  } else {
      query = `UPDATE orders SET order_progress = ? WHERE order_id = ?`;
      params = [order_progress, order_id];
  }

  try {
      const [result] = await db.query(query, params);

      if (result.affectedRows === 0) {
          return res.status(404).send("Order not found.");
      }

      res.send("Order progress updated successfully.");
  } catch (err) {
      console.error("Error updating order progress:", err);
      return res.status(500).send("Failed to update order progress.");
  }
});

// 8️⃣ Get customer's delivery location (geocoding)
const geocodeAddress = async (address) => {
  try {
      const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      if (response.data.length === 0) return null;
      return {
          latitude: response.data[0].lat,
          longitude: response.data[0].lon,
      };
  } catch (error) {
      console.error("Error fetching geocode data:", error);
      return null;
  }
};

app.get("/customer-location/:order_id", async (req, res) => {
  const { order_id } = req.params;

  try {
      const [result] = await db.query("SELECT deliveryaddress FROM orders WHERE order_id = ?", [order_id]);
      if (result.length === 0) {
          return res.status(404).json({ error: "Order not found" });
      }

      const address = result[0].deliveryaddress;
      const coordinates = await geocodeAddress(address);

      if (!coordinates) {
          return res.status(500).json({ error: "Failed to geocode address" });
      }

      res.json(coordinates);
  } catch (err) {
      return res.status(500).json({ error: "Database query error" });
  }
});

// ---------------------------------------------------
// ✅ Product Prices Routes
// ---------------------------------------------------


app.get('/api/getPrices', async (req, res) => {
  const query = 'SELECT product_name, price FROM productprices';

  try {
      const [results] = await db.query(query);

      const priceData = {};
      results.forEach(item => {
          priceData[item.product_name] = item.price;
      });

      console.log("✅ Prices fetched successfully:", priceData);
      res.json(priceData);
  } catch (err) {
      console.error('❌ Error fetching prices:', err);
      return res.status(500).json({ error: 'Internal server error' });
  }
});
// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


module.exports = router;