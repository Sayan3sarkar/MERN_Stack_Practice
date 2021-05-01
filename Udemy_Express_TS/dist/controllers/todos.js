"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todos = [];
exports.todosController = (req, res, next) => {
    res.status(200).json({
        todos,
    });
};
exports.addTodosController = (req, res, next) => {
    const newTodo = {
        id: new Date().toISOString(),
        text: req.body.text,
    };
    todos.push(newTodo);
    res.status(201).json({
        message: "New Todo created",
        todo: newTodo,
        todos: todos,
    });
};
exports.replaceTodo = (req, res, next) => {
    const tid = req.params.todoId;
    const todoIndex = todos.findIndex((todoItem) => todoItem.id === tid);
    if (todoIndex >= 0) {
        todos[todoIndex] = {
            id: todos[todoIndex].id,
            text: req.body.text,
        };
        return res.status(200).json({
            message: "Updated Todo",
            todos: todos,
        });
    }
    res.status(404).json({
        message: "Could not find todo",
    });
};
exports.deleteTodo = (req, res, next) => {
    const tid = req.params.todoId;
    const todoIndex = todos.findIndex((todoItem) => todoItem.id === tid);
    if (todoIndex >= 0) {
        todos.splice(todoIndex, 1);
        return res.status(200).json({
            message: `Deleted todo with id:${tid}`,
            todos: todos,
        });
    }
    res.status(404).json({
        message: "Could not find todo",
    });
};
