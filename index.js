const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(express.static(__dirname + "/public"));

// Получение списка дел
app.get("/api/todos", (req, res) => {
	const content = fs.readFileSync("todos.json", "utf8");
	const todos = JSON.parse(content);
	if (!todos || todos.length <= 0) {
		res.status(404).json({ message: "Дел нет" });
	} else {
		res.json(todos);
	}
});

// Получение одного дела по id
app.get("/api/todos/:id", (req, res) => {
	const id = req.params.id;
	const content = fs.readFileSync("todos.json", "utf8");
	const todos = JSON.parse(content);
	const todo = todos.find((t) => t.id == id);

	if (todo) {
		res.json(todo);
	} else {
		res.status(404).json({ message: "Дело не найдено" });
	}
});

// Добавление нового дела
app.post("/api/todos", (req, res) => {
	if (!req.body) return res.status(400).json({ message: "Данные не переданы" });

	const taskName = req.body.name;
	const todo = { name: taskName, isDone: false };

	const data = fs.readFileSync("todos.json", "utf8");
	const todos = JSON.parse(data);

	// Находим максимальный id
	const id = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) : 0;
	todo.id = id + 1;
	todos.push(todo);

	fs.writeFileSync("todos.json", JSON.stringify(todos));
	res.json(todo);
});

// Удаление дела по id
app.delete("/api/todos/:id", (req, res) => {
	const id = req.params.id;
	const data = fs.readFileSync("todos.json", "utf8");
	const todos = JSON.parse(data);

	const index = todos.findIndex((t) => t.id == id);
	if (index > -1) {
		const [todo] = todos.splice(index, 1);
		fs.writeFileSync("todos.json", JSON.stringify(todos));
		res.json(todo);
	} else {
		res.status(404).json({ message: "Дело не найдено" });
	}
});

// Изменение дела
app.put("/api/todos", (req, res) => {
	if (!req.body) return res.status(400).json({ message: "Данные не переданы" });

	const { id, name, isDone } = req.body;
	const data = fs.readFileSync("todos.json", "utf8");
	const todos = JSON.parse(data);
	const todo = todos.find((t) => t.id == id);

	if (todo) {
		todo.name = name;
		todo.isDone = isDone;
		fs.writeFileSync("todos.json", JSON.stringify(todos));
		res.json(todo);
	} else {
		res.status(404).json({ message: "Дело не найдено" });
	}
});

app.listen(3000, () => {
	console.log("Сервер ожидает подключения...");
});
