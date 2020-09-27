USE employee_db;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Matt', 'Doe', 1, NULL),
    ('John', 'Garden', 2, 1),
    ('Julia', 'Silva', 3, NULL),
    ('Rob', 'Joseph', 4, 3),
    ('Gabriela', 'Mula', 5, NULL),
    ('Andrew', 'Weber', 6, 5),
    ('Diogo', 'Silva', 7, NULL),
    ('Mando', 'Lucas', 8, 7);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;