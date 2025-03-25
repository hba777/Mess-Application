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
    password VARCHAR(255),          -- User password (hashed for security)
    phone_number VARCHAR(20),       -- Contact number
    link_id TEXT UNIQUE,            -- Unique 1link ID (renamed for better readability)
    is_clerk BOOLEAN DEFAULT FALSE, -- Boolean to indicate if the user is a clerk
    CONSTRAINT check_clerk_password CHECK (
        (is_clerk = TRUE AND password IS NOT NULL) OR (is_clerk = FALSE AND password IS NULL)
    )
);

-- bill table
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
    balAmount NUMERIC(10,2) DEFAULT 0,
    FOREIGN KEY (cms_id) REFERENCES users(cms_id) ON DELETE CASCADE
);

-- bill_payment table
CREATE TABLE bill_payment (
    id SERIAL PRIMARY KEY,
    bill_id INT NOT NULL,  -- Foreign key referencing bill.id
    transaction_id TEXT UNIQUE NOT NULL,  -- Unique transaction identifier
    payer_cms_id INT,  -- User ID of the payer (nullable for deleted users)
    payment_amount NUMERIC(10,2) NOT NULL,  -- Amount paid
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of payment
    payment_method TEXT,  -- Method of payment (e.g., Bank Transfer, Cash)
    receipt_number TEXT,  -- Receipt number for reference
    status TEXT DEFAULT 'Pending',  -- Status of payment (Pending, Completed, Failed)
    FOREIGN KEY (bill_id) REFERENCES bill(id) ON DELETE CASCADE,
    FOREIGN KEY (payer_cms_id) REFERENCES users(cms_id) ON DELETE SET NULL
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

-- KPIs
CREATE OR REPLACE FUNCTION get_total_users()
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE 
    total_users INT;
BEGIN
    SELECT COUNT(*) INTO total_users FROM users;
    RETURN total_users;
END;
$$;

CREATE OR REPLACE FUNCTION get_total_pending_bills()
RETURNS NUMERIC(10,2) LANGUAGE plpgsql AS $$
DECLARE 
    total_pending NUMERIC(10,2);
BEGIN
    SELECT COALESCE(SUM(balAmount), 0) INTO total_pending FROM bill WHERE balAmount > 0;
    RETURN total_pending;
END;
$$;

CREATE OR REPLACE FUNCTION get_total_paid_bills()
RETURNS NUMERIC(10,2) LANGUAGE plpgsql AS $$
DECLARE 
    total_paid NUMERIC(10,2);
BEGIN
    SELECT COALESCE(SUM(amount_received), 0) INTO total_paid FROM bill WHERE amount_received > 0;
    RETURN total_paid;
END;
$$;

CREATE OR REPLACE FUNCTION get_total_users_who_paid()
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE 
    total_users_paid INT;
BEGIN
    SELECT COUNT(DISTINCT cms_id) INTO total_users_paid FROM bill WHERE amount_received > 0;
    RETURN total_users_paid;
END;
$$;

CREATE OR REPLACE FUNCTION track_pending_amount_via_payments()
RETURNS TABLE (
    cms_id INT, 
    total_paid NUMERIC(10,2), 
    last_payment_date TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bp.payer_cms_id AS cms_id, 
        COALESCE(SUM(bp.payment_amount), 0) AS total_paid, 
        MAX(bp.payment_date) AS last_payment_date
    FROM bill_payment bp
    WHERE bp.status = 'Paid'  -- Only count completed payments
    GROUP BY bp.payer_cms_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_total_pending_bills_via_payments()
RETURNS NUMERIC(10,2) 
LANGUAGE plpgsql 
AS $$
DECLARE 
    total_pending NUMERIC(10,2);
BEGIN
    SELECT 
        COALESCE(SUM(b.gTotal - COALESCE(bp.total_paid, 0)), 0) 
    INTO total_pending
    FROM bill b
    LEFT JOIN (
        SELECT bill_id, SUM(payment_amount) AS total_paid
        FROM bill_payment
        WHERE status = 'Paid'
        GROUP BY bill_id
    ) bp ON b.id = bp.bill_id
    WHERE (b.gTotal - COALESCE(bp.total_paid, 0)) > 0;  -- Bills with remaining balance

    RETURN total_pending;
END;
$$;

CREATE OR REPLACE FUNCTION get_total_paid_bills_via_payments()
RETURNS NUMERIC(10,2) 
LANGUAGE plpgsql 
AS $$
DECLARE 
    total_paid NUMERIC(10,2);
BEGIN
    SELECT COALESCE(SUM(payment_amount), 0) INTO total_paid
    FROM bill_payment
    WHERE status = 'Paid';

    RETURN total_paid;
END;
$$;

CREATE OR REPLACE FUNCTION get_total_users_who_paid_via_payments()
RETURNS INT 
LANGUAGE plpgsql 
AS $$
DECLARE 
    total_users_paid INT;
BEGIN
    SELECT COUNT(DISTINCT payer_cms_id) INTO total_users_paid 
    FROM bill_payment
    WHERE status = 'Paid';

    RETURN total_users_paid;
END;
$$;




