const inquirer = require('inquirer')
// Import the filsystem framework so we can use the writeFile function
const fs = require('fs')
const db = require('./db')

// call once somewhere in the beginning of the app
const cTable = require('console.table');
// console.table([
//   {
//     name: 'foo',
//     age: 10
//   }, {
//     name: 'bar',
//     age: 20
//   }
// ]);

// prints
// name  age
// ----  ---
//   foo   10
// bar   20

const choicesArray = ['Add employee', 'Add role', 'Add department', 'View employees', 'View roles', 'View departments', 'Update employee roles']

const questions = [
  {
    type: 'list',
    message: 'What would you like to do?',
    choices: choicesArray,
    name: 'toDoChoice',
  },
]

const viewEmployees = () => {
  db.query(`
        SELECT employees.id, employees.first_name, employees.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employees
        LEFT JOIN role
        ON employees.role_id = role.id
        LEFT JOIN department
        ON role.department_id = department.id
        LEFT JOIN employees manager
        ON manager.id = employees.manager_id
    `, (err, employees) => {
    if (err) { console.log(err) }
    console.table(employees)
    mainMenu()
  })
}

const addEmployee = () => {
  db.query("SELECT * FROM role", (err, roles) => {
    if (err) { console.log(err) }

    roles = roles.map(role => ({
      name: role.title,
      value: role.id
    }))

    db.query('SELECT * FROM employees', (err, employees) => {

      employees = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }))

      employees.unshift({ name: 'None', value: null })

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'first_name',
            message: 'What is the employee first name'
          },
          {
            type: 'input',
            name: 'last_name',
            message: 'What is the employee last name'
          },
          {
            type: 'list',
            name: 'role_id',
            message: 'Choose a role for the employee',
            choices: roles
          },
          {
            type: 'list',
            name: 'manager_id',
            message: 'Choose a manager for the employee',
            choices: employees
          },
        ])
        .then(employee => {
          db.query('INSERT INTO employees SET ?', employee, (err) => {
            if (err) { console.log(err) }
            console.log('employee created')
            mainMenu()
          })
        })
        .catch(err => { console.log(err) })

    })
  })
}

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the department name'
      },
    ])
    .then(department => {
      console.log(department)
      db.query('INSERT INTO department SET ?', department, (err) => {
        if (err) { console.log(err) }
        console.log('department created')
        mainMenu()
      })
    })
    .catch(err => { console.log(err) })
}

const viewDepartments = () => {
  db.query(`
        SELECT * FROM department
    `, (err, departments) => {
    if (err) { console.log(err) }
    console.table(departments)
    mainMenu()
  })
}

const viewRoles = () => {

  db.query(`
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        LEFT JOIN department
        ON role.department_id = department.id
    `, (err, role) => {
    if (err) { console.log(err) }
    console.table(role)
    mainMenu()
  })

}

const addRole = () => {

  db.query("SELECT * FROM department", (err, departments) => {
    if (err) { console.log(err) }

    departments = departments.map(department => ({
      name: department.name,
      value: department.id
    }))

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'What is the role name?'
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary?'
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'What is the department?',
          choices: departments
        },
      ])
      .then(role => {
        console.log(role)
        db.query('INSERT INTO role SET ?', role, (err) => {
          if (err) { console.log(err) }
          console.log('role created')
          mainMenu()
        })
      })
      .catch(err => { console.log(err) })
  })

}

const updateEmployeeRole = () => {
  db.query('SELECT * FROM employees', (err, employees) => {

    employees = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }))
    db.query('SELECT * FROM role', (err, roles) => {

      roles = roles.map(role => ({
        name: role.title,
        value: role.id
      }))

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employees_id',
            message: 'Choose an employee to update',
            choices: employees
          },
          {
            type: 'list',
            name: 'role_id',
            message: 'Choose the employee new role',
            choices: roles
          },
        ])
        .then(employee => {
          console.log(employee.role_id)
          db.query('UPDATE employees SET role_id = ? WHERE employees.id = ?', [employee.role_id, employee.employees_id], (err) => {
            if (err) { console.log(err) }
            console.log('employee updated')
            mainMenu()
          })
        })
        .catch(err => { console.log(err) })
    })

  })
}






const mainMenu = () => {

  inquirer
    .prompt(
      questions
    )

    .then(res => {
      console.log(res.toDoChoice)

      switch (res.toDoChoice) {
        case 'Add employee':
          addEmployee()
          break
        case 'Add role':
          addRole()
          break
        case 'Add department':
          addDepartment()
          break
        case 'View employees':
          viewEmployees()
          break
        case 'View roles':
          viewRoles()
          break
        case 'View departments':
          viewDepartments()
          break
        case 'Update employee roles':
          updateEmployeeRole()
          break

      }




    })
    .catch(err => {
      console.log(err)
    })

}

mainMenu()



