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
  db.query('SELECT employees.id, employees.first_name, employees.last_name, role.title, role.salary, department.name, employees.manager_id FROM employees, role, department WHERE employees.role_id = role.id AND role.department_id = department.id', (err, data) => {
    if (err) { console.log(err) }

    // console.log(data)
    // console.log(data[data[1].manager_id].first_name)

    let = employees = []
    
    
    for (let i = 0; i < data.length; i++) {
      if (data[i].manager_id === null) {
        
        let employeeObj = {
          "first name": data[i].first_name,
          "last name": data[i].last_name,
          "title": data[i].title,
          "salary": data[i].salary,
          // "manager": data[data[i].manager_id].first_name
          "manager": data[i].manager_id
        }
        employees.push(employeeObj)
      } 
      else {
        
        let employeeObj = {
          "first name": data[i].first_name,
          "last name": data[i].last_name,
          "title": data[i].title,
          "salary": data[i].salary,
          "manager": data[data[1].manager_id].first_name
        }
        employees.push(employeeObj)
      }
    }

    // let employeeObj = {
    //   "first name": data[i].first_name,
    //   "last name": data[i].last_name,
    //   "title": data[i].title,
    //   "salary": data[i].salary,
    //   // "manager": data[data[i].manager_id].first_name
    //   "manager": data[i].manager_id
    // }
    

    console.table(employees)
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
        case 'View all employees':
          viewEmployees()
          break;
        case 'View all employees by department':

          break;
        case 'View all employees by manager':

          break;
        case 'Add employee':

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



