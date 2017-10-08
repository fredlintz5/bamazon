const AsciiTable = require('ascii-table');
const mysql = require('mysql');
const colors = require('colors');
const inquirer = require('inquirer');
const connection = mysql.createConnection({
	host: 'localhost',
	port: '8889',
	user: 'root',
	password: 'root',
	database: 'bamazon_db'
})


startManagerApp();


function startManagerApp() {
	inquirer.prompt([
	{
		name: 'choice',
		message: 'Choose your Query:',
		type: 'list',
		choices: ['View Products for Sale','View Low Inventory', 'Update Inventory','Add New Product', 'QUIT']
	}
	]).then((ans) => {
		switch(ans.choice) {
			case 'View Products for Sale':
				readDataTable('products');
				setTimeout(restart,700);
				break;

			case 'View Low Inventory':
				readDataLowInventory('products');
				break;

			case 'Update Inventory':
				readDataTable('products');
				setTimeout(updateInventory, 700);
				break;

			case 'Add New Product':
				readDataTable('products');
				setTimeout(addProduct, 700);
				break;

			case 'QUIT':
				console.log(`\nGOODBYE\n`.cyan);
				process.exit(0);
				break;
		}
	})
}


function restart() {
	inquirer.prompt([
	{
		name: 'confirm',
		message: 'End program?',
		type: 'confirm'
	}
	]).then((ans) => {
		if(ans.confirm) {
			console.log('\nGoodbye!\n'.cyan);
			connection.end();
		} else {
			startManagerApp();
		}
	})
}



function readDataTable(db_table) {
	let table = new AsciiTable();
	table.setHeading('ID', 'Description', 'Department', 'Price', 'Quantity');

	connection.query(`SELECT * FROM ${db_table}`, (err,res) => {
		console.log(`\n                  Current Product List`.cyan);
		res.forEach((product) => {
			table.addRow(product.id, product.description, product.department, product.price, product.quantity);
		})
		console.log(`${table.toString()}\n`);
	});
}


function readDataLowInventory(db_table) {
	let table = new AsciiTable();
	table.setHeading('ID', 'Description', 'Department', 'Price', 'Quantity');

	connection.query(`SELECT * FROM ${db_table} WHERE quantity<5`, (err,res) => {
		console.log(`\n         Product List with Inventory Below 5`.cyan);
		res.forEach((product) => {
			table.addRow(product.id, product.description, product.department, product.price, product.quantity);
		})
		console.log(`${table.toString()}\n`);
				restart();
	});
}


function updateInventory() {
	inquirer.prompt([
	{
		name: 'id',
		message: 'Choose which Product ID you want to update'
	},
	{
		name: 'list',
		message: 'Which property would you like to update?',
		type: 'list',
		choices: ['Description', 'Department', 'Price', 'Quantity']
	},
	{
		name: 'value',
		message: 'What is the updated value?'
	}
	]).then((ans) => {
		switch(ans.list) {
			case 'Description':
				connection.query(`UPDATE products SET description = ${ans.value} WHERE id = ${ans.id}`, (err, res) => {
					if(err) throw err;
					console.log(`\nProduct Updated\n`.green)
						restart();	
				})
				break;

			case 'Department':
				connection.query(`UPDATE products SET department = ${ans.value} WHERE id = ${ans.id}`, (err, res) => {
					if(err) throw err;
					console.log(`\nProduct Updated\n`.green)
						restart();
				})
				break;

			case 'Price':
				connection.query(`UPDATE products SET price = ${ans.value} WHERE id = ${ans.id}`, (err, res) => {
					if(err) throw err;
					console.log(`\nProduct Updated\n`.green)
						restart();
				})
				break;

			case 'Quantity':
				connection.query(`UPDATE products SET quantity = ${ans.value} WHERE id = ${ans.id}`, (err, res) => {
					if(err) throw err;
					console.log(`\nProduct Updated\n`.green)
						restart();				
				})
				break;
		}		
	})
}


function addProduct() {
	console.log(`\nLet's add a new product...\n`.cyan);
	inquirer.prompt([
	{
		name: 'desc',
		message: 'Description?'
	},
	{
		name: 'dept',
		message: 'Department'
	},
	{
		name: 'price',
		message: 'Price?',
		valid: (value) => !isNaN(value)
	},
	{
		name: 'qty',
		message: 'Quantity?',
		valid: (value) => !isNaN(value)
	}
	]).then((ans) => {
		connection.query(`INSERT INTO products (description, department, price, quantity) VALUE ('${ans.desc}', '${ans.dept}', '${ans.price}', '${ans.qty}')`, (err, res) => {
			if (err) throw err;
			console.log(`\nNew Product Added\n`.green);
				restart();
		})
	})
}







