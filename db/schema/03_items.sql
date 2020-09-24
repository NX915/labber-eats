-- Drop and recreate items table

DROP TABLE IF EXISTS items CASCADE;
CREATE TABLE items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT 't',
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  acronym VARCHAR(5) NOT NULL,
  prep_time INTEGER NOT NULL
);
