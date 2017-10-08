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

 
startApp();


function startApp() {
	let table = new AsciiTable();
	table.setHeading('ID', 'Description', 'Price', 'Quantity');

	connection.query('SELECT * FROM products WHERE quantity>0', (err,res) => {
		console.log(`\n       Items available for purchase:`.cyan);
		res.forEach((product) => {
			table.addRow(product.id, product.description, product.price, product.quantity);
		})
		console.log(`${table.toString()}\n`);

		setTimeout(pickItem, 700);	
	});
}


function pickItem() {
	inquirer.prompt([
	{
		name: `id`,
		message: `Type in the ID number of the item you'd like to buy:`.cyan,
		validate: (value) => !isNaN(value)
	},
	{
		name: `qty`,
		message: `How many units would you like to buy?`.cyan,
		validate: (value) => !isNaN(value)
	}
	]).then((ans) => {
		itemPicked(ans.id, ans.qty);
	})
}


function itemPicked(id, qty) {
	connection.query(`SELECT * FROM products WHERE id=${id}`, (err,res) => {
		if (err) {
			console.log(`\nYou've encountered an error.`.red);
			restart();
		}

		if (qty > res[0].quantity) {
			console.log(`\nInsufficient Quantity, try again...\n`.red);
			setTimeout(pickItem, 500);	
		} else {
			if (qty == 1) {
				console.log(`\nYou have selected ${qty} ${res[0].description} for $${res[0].price}.`.green);
				let total = qty*res[0].price;
				console.log(`Your total amount due is: $${total}.\n`);
				buyItem(id, res[0].quantity, qty, total);
			} else if (qty > 1) {
				console.log(`\nYou have selected ${qty} ${res[0].description} for $${res[0].price} each.`.green);
				let total = qty*res[0].price;
				console.log(`Your total amount due is: $${total}.\n`);
				buyItem(id, res[0].quantity, qty, total);
			}
		}
	});
}

function buyItem(id, itemQty, customerQty, total) {
	let newQty = itemQty - customerQty;
	inquirer.prompt([
	{
		name: `payment`,
		message: `Please Enter your Credit Card #`.cyan,
		validate: (value) => !isNaN(value)
	},
	{
		name: `confirm`,
		message: `Are you sure you want to make this purchase?`.cyan,
		type: 'confirm'
	}
	]).then((ans) => {
		if (ans.confirm) {
			console.log(`\nCongratulations on your new item.\n`.green);
			updateDataQTY(id, newQty, total);
			setTimeout(restart, 1000);
		} else {
			console.log(`\nOooops.\n`.green);
			restart();
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
			startApp();
		}
	})
}


function updateDataQTY(id, qty, total) {
	connection.query(`UPDATE products SET quantity=${qty}, product_sales=product_sales+${total} WHERE id=${id}`, (err, res) => {
		if (err) throw err;
	})
}













