var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

// Start function shows list of items with id, name, and price
function start() {
    var query = "SELECT item_id, product_name, price FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(`${res[i].item_id} ${res[i].product_name} $${res[i].price}`
            );
        };
        console.log("-----------------------------");
        action();
    });
};

// Action function
function action() {
    inquirer.prompt([
        {
            // Inquier ID of product to purchase
            name: "id",
            type: "input",
            message: "What is the ID number of the product you would like to purchase?"
        }, {
            // Inquier number of units produt to purchase
            name: "units",
            type: "input",
            message: "How many units would you like to purchase?"
        }
    ]).then(function (answers) {
        // Check if store has enough units
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { item_id: answers.id }, function (err, res) {
            // If not enough, log "Insufficient quantity!" prevent order from going through
            if (res[0].stock_quantity < answers.units) {
                console.log(`
    Sorry, we only have ${res[0].stock_quantity} units of ${res[0].product_name}`);
                
                setTimeout(function() {
                    console.log(`    Please pick a different amount or a new item:
                    `);
                }, 2000);

                setTimeout(function() {
                    start();
                }, 4000);
            } else {
                var unitsUpdate = res[0].stock_quantity - answers.units;
                // If enough, fulfill order by updating SQL database
                var query = "UPDATE products SET ? WHERE ?";
                connection.query(query, [{stock_quantity: unitsUpdate}, {item_id: answers.id}],
                function(err, res) {
                    if (err) throw err;
                });
                // Show customer total cost of purchase
                var cost = res[0].price * answers.units;
                console.log(`
    Thank you for your purchase!
    Total cost: $${cost}.`);
                connection.end();
            };
        });

    });
};
