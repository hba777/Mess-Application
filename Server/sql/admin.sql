CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  cmsid VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

INSERT INTO admin (cmsid, password)
VALUES ('admin', 'adminpassword');

CREATE TABLE user (
    CMIS_id INT PRIMARY KEY,         -- Unique identifier for each user
    name VARCHAR(255) NOT NULL,      -- Full name of the user
    department VARCHAR(255),         -- Department where the user belongs
    rank VARCHAR(100),               -- User's rank
    Pma_course VARCHAR(100),         -- PMA course
    degree VARCHAR(255),             -- User's degree
    phone_number VARCHAR(20),        -- Contact number
    pending_bill_id INT,             -- Foreign key to pending bill (nullable)
    total_due DECIMAL(10,2) DEFAULT 0.00,  -- Total due amount (default 0)
    FOREIGN KEY (pending_bill_id) REFERENCES bill(bill_id)  -- Linking to bill table
);