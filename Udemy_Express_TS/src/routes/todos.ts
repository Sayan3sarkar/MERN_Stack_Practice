import { Router } from "express";
import {
  todosController,
  addTodosController,
  replaceTodo,
  deleteTodo,
} from "../controllers/todos";

const router = Router();

router.get("/", todosController);

router.post("/todo", addTodosController);

router.put("/todo/:todoId", replaceTodo);

router.delete("/todo/:todoId", deleteTodo);

export default router;
