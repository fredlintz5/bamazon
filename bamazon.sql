CREATE DATABASE bamazon_db;

USE bamazon_db;


CREATE TABLE products(	
	id INT AUTO_INCREMENT NOT NULL,
	description VARCHAR(30) NOT NULL,
	department VARCHAR(30),
	price FLOAT(11,2),
	quantity INT(11),
	PRIMARY KEY (id)
);


CREATE TABLE departments(
	department_id INT(11) NOT NULL,
	department_name VARCHAR(30) NOT NULL,
	over_head_costs INT(11) NOT NULL,
	PRIMARY KEY (department_id)
);


INSERT INTO products (description, department, price, quantity)
VALUE 
('Trek Marlin 4', 'Bicycles', 399.99, 3), 
('Trek Skye WSD', 'Bicycles', 399.99, 2),
('Trek Roscoe 8', 'Bicycles', 1199.99, 5),
('Trek Domane 5.2', 'Bicycles', 3399.99, 1),
('Trek Farley 9.6', 'Bicycles', 2699.99, 6),
('Trek Fuel 8', 'Bicycles', 2999.99, 3),
('Trek Top Fuel', 'Bicycles', 5199.99, 4),
('Trek Lexa', 'Bicycles', 799.99, 2);