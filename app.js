const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));

// #############################################################################
// Logs all request paths and method
app.use((req, res, next) => {
    res.set('x-timestamp', Date.now());
    res.set('x-powered-by', 'cyclic.sh');
    console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`);
    next();
});

const todos = [];

app.get('/', (req, res) => {
    res.json({ statusCode: 200, message: `Welcome on ${process.env.HOME_NAME}` });
});

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.get('/todos/:id', (req, res) => {
    const { params } = req;
    res.json(todos.filter((todo) => todo.id === params.id)[0] || {});
});

app.post('/todos', (req, res) => {
    const { body } = req;
    body.id = uuidv4();
    todos.push(body);
    res.json(body);
});

app.patch('/todos/:id', (req, res) => {
    const { params, body } = req;
    const todoUpdateIndex = todos.findIndex((todo) => todo.id === params.id);
    todos[todoUpdateIndex] = { ...body, id: params.id };

    res.json(body);
});

app.delete('/todos/:id', (req, res) => {
    const { params } = req;
    const todoDeleteIndex = todos.findIndex((todo) => todo.id === params.id);
    todos.splice(todoDeleteIndex, 1);
    res.json({ status: 'success', message: `todos with id ${params.id} has been removed` });
});

// #############################################################################
// Catch all handler for all other request.
app.use('*', (req, res) => {
    res.json({
        at: new Date().toISOString(),
        method: req.method,
        hostname: req.hostname,
        ip: req.ip,
        query: req.query,
        headers: req.headers,
        cookies: req.cookies,
        params: req.params
    })
        .end();
});

module.exports = app;
