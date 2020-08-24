
USE employee_db;
INSERT INTO department (name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");

USE employee_db;
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 80000, 1),
("Salesperson", 70000, 1),
("Enginner Lead", 100000, 2),
("Software Engineer", 90000, 2),
("Accountant", 80000, 3),
("Lawyer", 120000, 4);


USE employee_db;
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
("Jane", "Smith", 2, 1),
("Ashley", "Qujano", 3, NULL),
("Gary", "Fish", 4, 3),
("Devin", "Castro", 6, NULL),
("Christy", "Hanamure", 5, 5);
