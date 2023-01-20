const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: false }));

const accountData = fs.readFileSync(
	path.join(__dirname, "/json/accounts.json"),
	"utf8"
);
const accounts = JSON.parse(accountData);

const userData = fs.readFileSync(
	path.join(__dirname, "/json/users.json"),
	"utf8"
);
const users = JSON.parse(userData);

app.get("/", (req, res) => {
	res.render("index", {
		title: "Account Summary",
		accounts: accounts,
	});
});

app.get("/savings", (req, res) => {
	res.render("account", {
		account: accounts.savings,
	});
});

app.get("/checking", (req, res) => {
	res.render("account", {
		account: accounts.checking,
	});
});

app.get("/credit", (req, res) => {
	res.render("account", {
		account: accounts.credit,
	});
});

app.get("/profile", (req, res) => {
	res.render("profile", {
		user: users[0],
	});
});

app.get("/transfer", (req, res) => {
	res.render("transfer");
});

app.post("/transfer", (req, res) => {
	const { from, to, amount } = req.body;
	accounts[from].balance = accounts[from].balance - amount;
	accounts[to].balance = parseInt(accounts[to].balance) + parseInt(amount);
	const accountsJSON = JSON.stringify(accounts);
	console.log(accountsJSON);
	fs.writeFileSync(
		path.join(__dirname, "/json/accounts.json"),
		accountsJSON,
		"UTF8"
	);
	res.render("transfer", {
		message: "Transfer Completed",
	});
});

app.get("/payment", (req, res) => {
	res.render("payment", {
		account: accounts.credit,
	});
});

app.post("/payment", (req, res) => {
	accounts.credit.balance = accounts.credit.balance - req.body.amount;
	accounts.credit.available =
		parseInt(accounts.credit.available) + parseInt(req.body.amount);
	const accountsJSON = JSON.stringify(accounts);
	fs.writeFileSync(
		path.join(__dirname, "/json/accounts.json"),
		accountsJSON,
		"UTF8"
	);
	res.render("payment", {
		message: "Payment Successful",
		account: accounts.credit,
	});
});

app.listen(3000, () => {
	console.log("PS Project Running on port 3000!");
});
