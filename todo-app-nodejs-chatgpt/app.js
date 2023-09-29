const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'hello123',
    database: 'selftuts',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create a table for todos if not exists
pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task VARCHAR(255) NOT NULL
    );
`);

app.get('/', (req, res) => {
    // Retrieve todos from the database
    pool.query('SELECT * FROM todos', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const todos = results.map(result => result.task);
        res.render('index', { todos });
    });
});

app.post('/add', (req, res) => {
    const newTodo = req.body.newTodo;

    // Insert new todo into the database
    pool.query('INSERT INTO todos (task) VALUES (?)', [newTodo], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Redirect to the root URL after adding a new todo
        res.redirect('/');
    });
});


app.post('/delete', (req, res) => {
    const todoToDelete = req.body.todoToDelete;

    // Delete the todo from the database
    const deleteTodo = 'DELETE FROM todos WHERE task = ?';
    pool.query(deleteTodo, [todoToDelete], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Redirect to the root URL after deleting the todo
        res.redirect('/');
    });
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
