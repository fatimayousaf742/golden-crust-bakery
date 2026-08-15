import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pool from './db.js';
import authRoutes from './auth.js';
// import { authenticate, authorize } from './middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, emoji, description, image FROM categories ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/categories/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, name, price, description, image, badge FROM items WHERE category_id = $1 ORDER BY id',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { name, email, phone, category, item, quantity, delivery_type, address, city, zip, preferred_date, preferred_time, payment_method, dietary_preferences, occasion, hear_about, instructions } = req.body;
    const result = await pool.query(
      `INSERT INTO orders (name, email, phone, category, item, quantity, delivery_type, address, city, zip, preferred_date, preferred_time, payment_method, dietary_preferences, occasion, hear_about, instructions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
      [name, email, phone, category, item, quantity, delivery_type, address, city, zip, preferred_date, preferred_time, payment_method, dietary_preferences, occasion, hear_about, instructions]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/deliveries', async (req, res) => {
  try {
    const { name, phone, email, address, city, zip, category, date, time, instructions } = req.body;
    const result = await pool.query(
      `INSERT INTO deliveries (name, phone, email, address, city, zip, category, delivery_date, delivery_time, instructions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, phone, email, address, city, zip, category, date, time, instructions]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, phone, subject, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
