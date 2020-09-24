var inquirer = require("inquirer");
var consoleTable = require("console.table");
var mysql = require("mysql");
const { type } = require("os");
const { listenerCount } = require("process");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employee_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
  .prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "view all employees",
      "view all departments",
      "view all managers",
      "add employee",
      "add department",
      "add role",
      "remove employee",
      "remove role",
      "remove manager",
      "exit"
    ]

  })
  .then(function (answers) {
    console.log(answers.action);
    switch (answers.action) {
      case "view all employees":
        employeeView();
        break;

        case "view all employees by department":
          departmentView();
          break;

      case "view all managers":
        managerView();
      break;

      case "add employee":
        employeeAdd();
        break;

      case "add department":
        departmentAddd();
        break;

      case "add role":
        roleAdd();
        break;

      case "remove employee":
        employeeRemove();
        break

      case "remove role":
        roleRemove();
        break;
      
      case "remove manager":
        managerRemove();
        break;

        case "Update Employee Role":
          employeeUpdate();
          break;

      case "exit":
        connection.end();
        break;
      }

  });
  // .catch(error => {
    // if(error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    // } else {
      // Something else when wrong
    // }
  // });
}

function employeeView() {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
    connection.query(query, function (err, res) {
      if(err) return err;
      console.log("\n");
      console.table(res);
      runSearch();
    });
  
}

// function departmentView(){
// inquirer
//   .prompt({
//     type: "list",
//     name: "departmentView",
//     message: "Choose a department",
//     choices: [
//       "Sales", "Engineering", "Finance", "Legal",
//     ] 
//   })
//   .then(function (answers) {
//     var query = "SELECT name FROM employee_db.department ";
//     connection.query(query, function(err, res) {
//       for (var i=0; i< res.length; i++) {
//         console.log(res[i].name);
//         runSearch();
//       }
//     })
//   })
// }
