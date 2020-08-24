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
          updateEmployeeRole
          break

      }




    })
    .catch(err => {
      console.log(err)
    })

}

mainMenu()



