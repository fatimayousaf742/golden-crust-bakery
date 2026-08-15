CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  description TEXT,
  image TEXT
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  price VARCHAR(20) NOT NULL,
  description TEXT,
  image TEXT,
  badge VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  item VARCHAR(200) DEFAULT '',
  quantity INTEGER DEFAULT 1,
  delivery_type VARCHAR(20) DEFAULT 'pickup',
  address TEXT DEFAULT '',
  city VARCHAR(100) DEFAULT '',
  zip VARCHAR(20) DEFAULT '',
  preferred_date DATE,
  preferred_time VARCHAR(50) DEFAULT '',
  payment_method VARCHAR(50) DEFAULT 'cash',
  dietary_preferences TEXT DEFAULT '',
  occasion VARCHAR(100) DEFAULT '',
  hear_about VARCHAR(100) DEFAULT '',
  instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deliveries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(200) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  category VARCHAR(100) NOT NULL,
  delivery_date DATE NOT NULL,
  delivery_time VARCHAR(50) NOT NULL,
  instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES ('customer'), ('staff'), ('admin') ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  role_id INTEGER NOT NULL DEFAULT 1 REFERENCES roles(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  birth_date DATE,
  delivery_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name, emoji, description, image) VALUES
  ('Cakes', '🎂', 'Custom cakes for every celebration', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80'),
  ('Pizzas', '🍕', 'Wood-fired artisan pizzas', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80'),
  ('Bread', '🍞', 'Freshly baked daily artisan breads', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80'),
  ('Cupcakes', '🧁', 'Delightful cupcakes with premium frosting', 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500&q=80'),
  ('Sweets', '🍬', 'Handcrafted confections and treats', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=80'),
  ('Pastries', '🥐', 'Flaky, buttery French pastries', 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=500&q=80'),
  ('Pies', '🥧', 'Classic pies with seasonal fillings', 'https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=500&q=80'),
  ('Cookies', '🍪', 'Warm, fresh-from-the-oven cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80');
