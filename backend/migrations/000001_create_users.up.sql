CREATE TABLE phones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fullname VARCHAR(255) NOT NULL,
    phone_number VARCHAR(10) CHECK (LENGTH(phone_number) = 10) UNIQUE NOT NULL,
    note VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);