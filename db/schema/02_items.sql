-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS items CASCADE;
CREATE TABLE items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER,
  image_url TEXT,
  available BOOLEAN DEFAULT 't'
);
