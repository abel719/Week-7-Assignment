require("dotenv").config();
const express = require('express');
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
const cors = require('cors');
const logRequest = require('./middlewares/logger');
const validateTodo = require("./middlewares/validator")
const Joi = require('joi');
const errorHandler = require("./middlewares/errorHandler")
const validatorPatch = require('./middlewares/validatorPatch');
const validateTodoUpdate = require("./middlewares/validatorPatch");

const corsOptions = {
    origin: 'http://127.0.0.1:5500'
};

app.use(cors(corsOptions));
app.use(logRequest);


let todos = [
    {id: 1, task: "Learn what a todo is about", completed: false},
    {id: 2, task: "build a todo with me", completed: false}
]

app.get('/todo', (req, res, next) => {
  res.status(200).json(todos);
});

app.post('/todo', validateTodo, (req, res, next) => {
   try {
    const newTodo = {id: todos.length + 1,  ...req.body};
   todos.push(newTodo);
   res.status(200).json(newTodo);

   } catch (error) {
     next(error);
   }
});


app.get('/todo/:id', (req, res, next) => {
    try {
        const todoId = parseInt(req.params.id);
        if(isNaN(todoId)) {
            throw new Error('Invalid ID');
        }
   const foundTodo = todos.find((t) => t.id === todoId);
   if(!foundTodo) return res.status(404).json({error: "Not found"});
   res.status(200).json(foundTodo);
    } catch (error) {
        next(error);
    }
});


app.patch('/todo/:id', validateTodoUpdate, (req, res, next) => {
    try {
        const todoId = parseInt(req.params.id);
    const foundTodo = todos.find((t)=> t.id === todoId);
    if(!foundTodo) return res.status(404).json({error: "not found"});
    Object.assign(foundTodo, req.body);
    res.status(200).json({foundTodo});

    } catch (error) {
        next(error);
    }
});


app.delete('/todo/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id);
  if(todos.length === initialLength)
    return res.status(404).json({error: 'Not Found'});
res.status(204).send();

  } catch (error) {
    next(errror);
  }
});


app.get('/todos/completed', (req, res) => {

  try {
    const completed = todos.filter((t) => t.completed);
  res.json(completed);

  } catch (error) {
    next(error);
  }
});


app.use(errorHandler);







app.listen(port, () => console.log(`Server is running on port ${port}`));