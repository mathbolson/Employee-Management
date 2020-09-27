var inquirer = require("inquirer");
var consoleTable = require("console.table");
var mysql = require("mysql");
// const { type } = require("os");
// const { listenerCount } = require("process");

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
      "view all employees by departments",
      "view all employees by roles",
      "add employee",
      "Udpate employee",
      "add role",
      "add department",
      "delete employee",
    ]

  })
  .then(function (answers) {
    console.log(answers.action);
    switch (answers.action) {
      case "view all employees":
        employeeView();
        break;

        case "view all employees by departments":
          departmentView();
          break;

      case "view all employees by roles":
        rolesView();
      break;

      case "add employee":
        employeeAdd();
        break;

      case "Udpate employee":
        updateEmployee();
      break;

      case "add role":
        roleAdd();
      break;

      case "add department":
        departmentAdd();
     break;

      case "delete employee":
        deleteEmpl();
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

function departmentView() {
  connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
  function(err, res) {
    if (err) throw err
    console.table(res)
    runSearch()
  })
}

function rolesView() {
  connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
  function(err, res) {
  if (err) throw err
  console.table(res)
  runSearch()
  })
}


var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}

var managersArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}

function employeeAdd() { 
  inquirer.prompt([
      {
        name: "firstname",
        type: "input",
        message: "Enter their first name "
      },
      {
        name: "lastname",
        type: "input",
        message: "Enter their last name "
      },
      {
        name: "role",
        type: "list",
        message: "What is their role? ",
        choices: selectRole()
      },
      {
          name: "choice",
          type: "rawlist",
          message: "Whats their managers name?",
          choices: selectManager()
      }
  ]).then(function (val) {
    var roleId = selectRole().indexOf(val.role) + 1
    var managerId = selectManager().indexOf(val.choice) + 1
    connection.query("INSERT INTO employee SET ?", 
    {
        first_name: val.firstName,
        last_name: val.lastName,
        manager_id: managerId,
        role_id: roleId
        
    }, function(err){
        if (err) throw err
        console.table(val)
        runSearch()
    })

})
}

function updateEmployee() {
  connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
  // console.log(res)
   if (err) throw err
   console.log(res)
  inquirer.prompt([
        {
          name: "lastName",
          type: "rawlist",
          choices: function() {
            var lastName = [];
            for (var i = 0; i < res.length; i++) {
              lastName.push(res[i].last_name);
            }
            return lastName;
          },
          message: "What is the Employee's last name? ",
        },
        {
          name: "role",
          type: "rawlist",
          message: "What is the Employees new title? ",
          choices: selectRole()
        },
    ]).then(function(val) {
      var roleId = selectRole().indexOf(val.role) + 1
      connection.query("UPDATE employee SET WHERE ?", 
      {
        last_name: val.lastName
         
      }, 
      {
        role_id: roleId
         
      }, 
      function(err){
          if (err) throw err
          console.table(val)
          runSearch()
      })

  });
});

}

function roleAdd() { 
  connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",   function(err, res) {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "What is the roles Title?"
        },
        {
          name: "Salary",
          type: "input",
          message: "What is the Salary?"

        } 
    ]).then(function(res) {
        connection.query(
            "INSERT INTO role SET ?",
            {
              title: res.Title,
              salary: res.Salary,
            },
            function(err) {
                if (err) throw err
                console.table(res);
                runSearch();
            }
        )

    });
  });
  }

  function departmentAdd() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add?"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
              name: res.name
            
            },
            function(err) {
                if (err) throw err
                console.table(res);
                runSearch();
            }
        )
    })
  }
  function deleteEmpl() {
    connection.query("SELECT * FROM employee", function (error, result) {
      if (error) throw error;
      console.table(result);
      inquirer.prompt([
        {
          type: "input",
          name: "delEmpl",
          message: "Insert the ID of the employee to remove"
        }
      ]).then(function (answers) {
        connection.query("DELETE FROM employee WHERE id = ?", [answers.delEmpl], function () {
          connection.query("SELECT * FROM employee", function (error, result) {
            console.table(result);
            runSearch();
          });
        });
      });
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


