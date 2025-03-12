CREATE TABLE card_brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- Ej: "Visa", "Mastercard", "Amex"
);

CREATE TABLE currencies (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL, -- Código de moneda (ej: "ARS", "USD", "EUR")
    name VARCHAR(50) UNIQUE NOT NULL  -- Nombre completo (ej: "Peso Argentino", "Dólar Estadounidense")
);

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Usa el id de Supabase Auth
    brand_id INT REFERENCES card_brands(id) ON DELETE RESTRICT, -- Relación con la tabla de marcas
    name VARCHAR(255) NOT NULL,  -- Ej: "Visa Banco X"
    card_type VARCHAR(50) CHECK (card_type IN ('credit', 'debit')),
    expire_date DATE NOT NULL, -- Fecha de vencimiento de la tarjeta
    currency_id INT REFERENCES currencies(id) ON DELETE RESTRICT DEFAULT 1, -- Moneda de la tarjeta
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expense_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Usa el id de Supabase Auth
    category_id INT REFERENCES expense_categories(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency_id INT REFERENCES currencies(id) ON DELETE RESTRICT DEFAULT 1, -- Relación con la tabla de monedas
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'card', 'transfer')),
    card_id INT REFERENCES cards(id) ON DELETE SET NULL, -- Si el pago es con tarjeta
    is_shared BOOLEAN DEFAULT FALSE,
    total_installments INT NOT NULL DEFAULT 1, -- Define la cantidad de cuotas
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE installments (
    id SERIAL PRIMARY KEY,
    expense_id INT REFERENCES expenses(id) ON DELETE CASCADE,
    installment_number INT NOT NULL,  -- Número de cuota (ej: 1, 2, 3...)
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Persona que debe pagar la cuota (de Supabase Auth)
    fallback_name VARCHAR(255), -- Si la persona no está registrada
    paid BOOLEAN DEFAULT FALSE
);
