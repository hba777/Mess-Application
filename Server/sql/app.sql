CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  cmsid VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

INSERT INTO admin (cmsid, password)
VALUES ('admin', 'adminpassword');

-- Create the users table first (since bills depend on users)
CREATE TABLE users (
    cms_id INT PRIMARY KEY,         -- Unique identifier for each user
    name VARCHAR(255) NOT NULL,      -- Full name of the user
    department VARCHAR(255),         -- Department where the user belongs
    rank VARCHAR(100),               -- User's rank
    Pma_course VARCHAR(100),         -- PMA course
    degree VARCHAR(255),             -- User's degree
    phone_number VARCHAR(20),        -- Contact number
    total_due DECIMAL(10,2) DEFAULT 0.00  -- Total due amount (default 0)
);


CREATE TABLE managers (
  id SERIAL PRIMARY KEY,
  cmsid VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

INSERT INTO managers (cmsid, password)
VALUES ('manager123', 'securepassword');


SELECT * FROM managers 

-- Create the bill table (after users)
CREATE TABLE bill (
    bill_id SERIAL PRIMARY KEY,     -- Auto-incremented unique ID for each bill
    CMIS_id INT NOT NULL,           -- Foreign key referencing the users table
    amount DECIMAL(10,2) NOT NULL,  -- Bill amount with two decimal places
    due_date DATE NOT NULL,         -- Due date for the bill
    status VARCHAR(50) NOT NULL,    -- Status (e.g., "pending", "paid")
    receipt_number VARCHAR(100) UNIQUE, -- Unique receipt number (nullable if unpaid)
    FOREIGN KEY (CMIS_id) REFERENCES users(CMIS_id) ON DELETE CASCADE
);

select * from users

