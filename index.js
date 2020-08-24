const inquirer = require('inquirer')
// Import the filsystem framework so we can use the writeFile function
const fs = require('fs')

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
  console.log('works')
}

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
      
      
      default:
        break;
    }




  })
  .catch(err => {console.log(err) 
  })





