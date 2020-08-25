const inquirer = require('inquirer')
const fs = require('fs')
const db = require('./db')

// call console.table
const cTable = require('console.table');

// this array holds the possible choices for the main menu, which will then be the names of all our functions
const choicesArray = ['Add employee', 'Add role', 'Add department', 'View employees', 'View roles', 'View departments', 'Update employee roles', 'Finish']

// this array holds the question for the main menu
const questions = [
  {
    type: 'list',
    message: 'What would you like to do?',
    choices: choicesArray,
    name: 'toDoChoice',
  },
]

// the following are all the functions for each choice the user decides to make
const viewEmployees = () => {
  // this is the most complex query that returns up all the employees with their, id,first name, last name, role title, role salary, department name, and manager name
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
    // use console table to nicely display the data
    console.table(employees)
    mainMenu()
  })
}

const addEmployee = () => {
  db.query("SELECT * FROM role", (err, roles) => {
    if (err) { console.log(err) }
// this maps the roles array into objects with a name key and a value key, so the user sees the role NAME but we recieve the VALUE of the id
    roles = roles.map(role => ({
      name: role.title,
      value: role.id
    }))

    db.query('SELECT * FROM employees', (err, employees) => {
// similarly now we map the employees so we see the name, but recieve the id
      employees = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }))
// this inserts a none/null employee to the top of the list
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
          // here we take all the user input and add the employee into the database
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
      // here we insert the new department into the department table
      db.query('INSERT INTO department SET ?', department, (err) => {
        if (err) { console.log(err) }
        console.log('department created')
        mainMenu()
      })
    })
    .catch(err => { console.log(err) })
}

const viewDepartments = () => {
  // here we query the db to show us the department table
  db.query(`
        SELECT * FROM department
    `, (err, departments) => {
    if (err) { console.log(err) }
    console.table(departments)
    mainMenu()
  })
}

const viewRoles = () => {
// query the db to give us the role table but we want the department NAME instead of just the department id, so we join the department table where role.department_id = department.id
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
// we need to query the department table first so we can grab the department name instead of just using its id
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
    // first we grab the employees table so we can display the first and last names but get the value of the employee id
    employees = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }))
    db.query('SELECT * FROM role', (err, roles) => {
      // now we grab the roles table so we can display the name names but get the value of the role id
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
          // now we update the employees role
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
        case 'Finish':
          console.log('You are all finished! Thank you!')
          break

      }




    })
    .catch(err => {
      console.log(err)
    })

}

mainMenu()



