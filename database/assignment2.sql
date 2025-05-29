--1 Insert TOny Stark into account table

INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--2 Update account type for Tony Stark (id 1) to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

--3 Delete Tony Stark from account table
DELETE FROM account
WHERE account_id = 1;

-- 4 Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" 
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;


-- 5 Select all inventory items that are classified as 'Sport'
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6 Update all inventory images paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
