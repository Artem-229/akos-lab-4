CREATE TABLE phones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fullname VARCHAR(255) NOT NULL,
    phone_number VARCHAR(10) CHECK (LENGTH(phone_number) = 10 AND phone_number ~ '^[0-9]+$') UNIQUE NOT NULL,
    note VARCHAR(255) NOT NULL
);