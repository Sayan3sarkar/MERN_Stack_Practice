import { Todo } from "../models/todo";

const todos: Todo[] = [];

export const todosController = (req: any, res: any, next: any) => {
  res.status(200).json({
    todos,
  });
};

export const addTodosController = (req: any, res: any, next: any) => {
  const newTodo: Todo = {
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

export const replaceTodo = (req: any, res: any, next: any) => {
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

export const deleteTodo = (req: any, res: any, next: any) => {
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
