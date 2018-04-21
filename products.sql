DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pens", "Office", 3.00, 200), ("Pink Glitter", "Crafts", 1.89, 50),
("Mason Jars", "Home", 15.99, 12), ("Toothbrush", "Bath", 3.49, 25), 
("Clock", "Home", 7.89, 50), ("Sticky Notes", "Office", 2.99, 100), 
("Popsicle Sticks", "Crafts", 3.12, 40), ("Pillow", "Home", 18.55, 5), 
("Shampoo", "Bath", 22.99, 43), ("Lamp", "Home", 25.79, 8)