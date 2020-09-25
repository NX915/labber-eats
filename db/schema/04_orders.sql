-- Drop and recreate orders table

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  informed_time INTEGER,
  accepted BOOLEAN,
  created_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  comment VARCHAR(255),
  ready_at TIMESTAMP
);
