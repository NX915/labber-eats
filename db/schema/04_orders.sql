-- Drop and recreate orders table

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  estimated_wait INTEGER DEFAULT 20,
  accepted BOOLEAN,
  created_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  comment VARCHAR(255)
);
