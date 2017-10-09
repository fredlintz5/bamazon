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