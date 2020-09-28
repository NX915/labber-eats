-- Drop and recreate orders table

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  comment VARCHAR(255),
  accepted_at TIMESTAMP,
  informed_time INTEGER,
  rejected_at TIMESTAMP,
  ready_at TIMESTAMP,
  completed_at TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
