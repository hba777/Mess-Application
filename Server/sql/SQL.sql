-- admins
CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  cmsid VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

INSERT INTO admin (cmsid, password)
VALUES ('admin', 'adminpassword');

-- users
CREATE TABLE users (
    cms_id INT PRIMARY KEY,         -- Unique identifier for each user
    password VARCHAR(255) NOT NULL, -- User password (hashed for security)
    phone_number VARCHAR(20)        -- Contact number
)

-- bill 
CREATE TABLE bill (
    id SERIAL PRIMARY KEY,
    cms_id INT NOT NULL,  -- Foreign key referencing users.cms_id
    rank TEXT,
    name TEXT,
    course TEXT,
    m_subs NUMERIC(10,2),
    saving NUMERIC(10,2),
    c_fund NUMERIC(10,2),
    messing NUMERIC(10,2),
    e_messing NUMERIC(10,2),
    sui_gas_per_day NUMERIC(10,2),
    sui_gas_25_percent NUMERIC(10,2),
    tea_bar_mcs NUMERIC(10,2),
    dining_hall_charges NUMERIC(10,2),
    swpr NUMERIC(10,2),
    laundry NUMERIC(10,2),
    gar_mess NUMERIC(10,2),
    room_maint NUMERIC(10,2),
    elec_charges_160_block NUMERIC(10,2),
    internet NUMERIC(10,2),
    svc_charges NUMERIC(10,2),
    sui_gas_boqs NUMERIC(10,2),
    sui_gas_166_cd NUMERIC(10,2),
    sui_gas_166_block NUMERIC(10,2),
    lounge_160 NUMERIC(10,2),
    rent_charges NUMERIC(10,2),
    fur_maint NUMERIC(10,2),
    sui_gas_elec_fts NUMERIC(10,2),
    mat_charges NUMERIC(10,2),
    hc_wa NUMERIC(10,2),
    gym NUMERIC(10,2),
    cafe_maint_charges NUMERIC(10,2),
    dine_out NUMERIC(10,2),
    payamber NUMERIC(10,2),
    student_societies_fund NUMERIC(10,2),
    dinner_ni_jscmcc_69 NUMERIC(10,2),
    current_bill NUMERIC(10,2),
    arrear NUMERIC(10,2),
    receipt_no TEXT,
    amount_received NUMERIC(10,2),
    gTotal NUMERIC(10,2) DEFAULT 0,
    balAmount NUMERIC(10,2) DEFAULT 0;
);

CREATE TABLE bill_payment (
    id SERIAL PRIMARY KEY,
    bill_id INT NOT NULL,  -- Foreign key referencing bill.id
    transaction_id TEXT UNIQUE NOT NULL,  -- Unique transaction identifier
    payer_cms_id INT NOT NULL,  -- User ID of the payer
    payment_amount NUMERIC(10,2) NOT NULL,  -- Amount paid
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of payment
    payment_method TEXT,  -- Method of payment (e.g., Bank Transfer, Cash)
    receipt_number TEXT,  -- Receipt number for reference
    status TEXT DEFAULT 'Pending',  -- Status of payment (Pending, Completed, Failed)
    FOREIGN KEY (bill_id) REFERENCES bill(id) ON DELETE CASCADE
);

-- This procedure will sum the total bill amount (gTotal) 
-- and subtract the total received amount (amount_received) for each cms_id
CREATE OR REPLACE FUNCTION track_pending_amount()
RETURNS TABLE (cms_id INT, total_billed NUMERIC(10,2), total_paid NUMERIC(10,2), pending_amount NUMERIC(10,2))
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.cms_id, 
        COALESCE(SUM(b.gTotal), 0) AS total_billed, 
        COALESCE(SUM(b.amount_received), 0) AS total_paid, 
        (COALESCE(SUM(b.gTotal), 0) - COALESCE(SUM(b.amount_received), 0)) AS pending_amount
    FROM bill b
    GROUP BY b.cms_id;
END;
$$;
