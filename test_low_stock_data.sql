-- SQL script to create test data for Low Stock alerts
-- Run this in your MySQL database to create medications with low stock levels

-- First, let's check current medications and their stock levels
-- SELECT drug_name, current_stock, minimum_stock, batch_number FROM medications WHERE is_active = true;

-- Update some existing medications to have low stock (if you have existing data)
-- Uncomment and modify these based on your actual medication IDs

-- UPDATE medications SET current_stock = 5, minimum_stock = 20 WHERE id = 1;
-- UPDATE medications SET current_stock = 3, minimum_stock = 15 WHERE id = 2;
-- UPDATE medications SET current_stock = 8, minimum_stock = 25 WHERE id = 3;

-- Or insert new test medications with low stock levels
INSERT INTO medications (
    drug_name, generic_name, category, strength, dosage_form, manufacturer, 
    batch_number, current_stock, minimum_stock, maximum_stock, unit_cost, 
    expiry_date, is_active, created_at, updated_at
) VALUES
-- Low stock medications (current_stock <= minimum_stock)
('Paracetamol Test Low', 'Acetaminophen', 'Analgesics', '500mg', 'Tablet', 'Test Pharma', 
 'TEST-LOW-001', 5, 20, 100, 0.50, '2025-12-31', true, NOW(), NOW()),

('Ibuprofen Test Low', 'Ibuprofen', 'NSAIDs', '400mg', 'Tablet', 'Test Pharma', 
 'TEST-LOW-002', 3, 15, 80, 0.75, '2025-11-30', true, NOW(), NOW()),

('Amoxicillin Test Low', 'Amoxicillin', 'Antibiotics', '250mg', 'Capsule', 'Test Pharma', 
 'TEST-LOW-003', 8, 25, 150, 2.50, '2025-10-30', true, NOW(), NOW()),

-- Very low stock (almost out)
('Aspirin Test Critical', 'Acetylsalicylic Acid', 'Analgesics', '75mg', 'Tablet', 'Test Pharma', 
 'TEST-CRITICAL-001', 2, 30, 200, 0.25, '2025-12-15', true, NOW(), NOW()),

-- Out of stock
('Metformin Test Out', 'Metformin HCl', 'Antidiabetics', '500mg', 'Tablet', 'Test Pharma', 
 'TEST-OUT-001', 0, 20, 100, 1.20, '2025-11-15', true, NOW(), NOW()),

-- Low stock with minimum_stock = 0 (should trigger 10-unit rule)
('Vitamin C Test', 'Ascorbic Acid', 'Vitamins', '1000mg', 'Tablet', 'Test Pharma', 
 'TEST-MIN-ZERO-001', 5, 0, 50, 0.30, '2026-01-31', true, NOW(), NOW());

-- Check the results
-- SELECT drug_name, current_stock, minimum_stock, 
--        CASE 
--            WHEN current_stock = 0 THEN 'OUT_OF_STOCK'
--            WHEN current_stock <= minimum_stock OR (minimum_stock = 0 AND current_stock <= 10) THEN 'LOW_STOCK'
--            ELSE 'NORMAL'
--        END as stock_status
-- FROM medications 
-- WHERE is_active = true 
-- ORDER BY stock_status, current_stock;