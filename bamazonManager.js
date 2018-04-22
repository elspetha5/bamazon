var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Lvtoreadlots5",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer.prompt(
        // List of menu options
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Nothing, I'm done"],
            name: "action"
        }).then(function (answer) {
            if (answer.action === "View Product for Sale") {
                viewProduct();
                restart();
            } else if (answer.action === "View Low Inventory") {
                lowInventory();
                restart();
            } else if (answer.action === "Add to Inventory") {
                addInventory();
            } else if (answer.action === "Add New Product") {
                newProduct();
            } else if (answer.action === "Nothing, I'm done") {
                connection.end();
            };
        });
};

function restart() {
    setTimeout(function () {
        console.log(`--------------------`);
        start();
    }, 1500);
};


// view products for sale
function viewProduct() {
    // list all items with id, names, prices, and quantities
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(`--------------------`);
        for (var i = 0; i < res.length; i++) {
            console.log(`${res[i].item_id} ${res[i].product_name} $${res[i].price} 
Quantity: ${res[i].stock_quantity}
            `);
        };
    });
};


// view low inventory
function lowInventory() {
    // list all items with an inventory count lower than 5
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(`--------------------`);
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log(`${res[i].item_id} ${res[i].product_name} $${res[i].price} 
Quantity: ${res[i].stock_quantity}
                `);
            };
        };
    });
};


// add to inventory
function addInventory() {
    inquirer.prompt(
        {
            type: "confirm",
            name: "list",
            message: "Would you like to view product list?",
            default: true
        }).then(function (answer) {
            if (answer.list) {
                viewProduct();
                setTimeout(function () {
                    update();
                }, 500);
            } else {
                update();
            };
        });
};

// display prompt that will let manager add more units of current items
function update() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "ID of product being updated:"
        },
        {
            type: "input",
            name: "numAdd",
            message: "Amount of inventory being added:"
        }
    ]).then(function (answers) {
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { item_id: answers.id }, function (err, res) {
            if (err) throw err;

            var addedUnits = parseInt(res[0].stock_quantity) + parseInt(answers.numAdd);

            var query = "UPDATE products SET ? WHERE ?";
            connection.query(query, [{ stock_quantity: addedUnits }, { item_id: answers.id }],
                function (err, res) {
                    if (err) throw err;
                });

            console.log(`--------------------
Stock updated:
    ${res[0].item_id} ${res[0].product_name} $${res[0].price} 
    Quantity: ${addedUnits}
            `);
            restart();
        });
    });
};


// add new product
function newProduct() {
    // add completely new product to store
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Product Name:"
        },
        {
            type: "input",
            name: "department",
            message: "Department:"
        },
        {
            type: "input",
            name: "price",
            message: "Price:"
        },
        {
            type: "input",
            name: "quantity",
            message: "Initial Quantity:"
        }
    ]).then(function (answers) {
        var query = "INSERT INTO products SET ?";
        connection.query(query, {
            product_name: answers.name,
            department_name: answers.department,
            price: answers.price,
            stock_quantity: answers.quantity
        }, function (err, res) {
            if (err) throw err;
        });

        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { product_name: answers.name }, function (err, res) {
            if (err) throw err;
            console.log(`--------------------`);
            for (var i = 0; i < res.length; i++) {
                console.log(`New Product Added:
    ${res[i].item_id} ${res[i].product_name} $${res[i].price} 
    Quantity: ${res[i].stock_quantity}
                `);
            };
            restart();
        });
    })
};
