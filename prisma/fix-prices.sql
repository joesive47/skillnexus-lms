-- Fix course prices by dividing by 100
-- Run this on your production database

UPDATE "Course"
SET price = FLOOR(price / 100)
WHERE price > 10000;

-- Verify the changes
SELECT id, title, price 
FROM "Course" 
ORDER BY price DESC;
