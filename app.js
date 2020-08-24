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

const choicesArray = [
  'View all employees',
  'View all employees by department',
  'View all employees by manager',
  'Add employee',
  'Add department',
  'Remove employee',
  'Update employee role',
  'Update employee manager'
]

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
             if (err) {console.log(err)}
             console.log('employee created')
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



const mainMenu = () => {

  inquirer
    .prompt(
      questions
    )

    .then(res => {
      console.log(res.toDoChoice)

      switch (res.toDoChoice) {
        case 'View all employees':
          viewEmployees()
          break;
        case 'View all employees by department':
          
          break;
        case 'Add department':
          addDepartment()
          break;
        case 'Add employee':
          addEmployee()
          break;
        case 'Remove employee':

          break;
        case 'Update employee role':

          break;
        case 'Update employee manager':

          break;
      }




    })
    .catch(err => {
      console.log(err)
    })

}

mainMenu()



