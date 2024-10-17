import { Router } from "express";
import { sanitizeLineOrderInput, findAll, findOne, add, update, remove } from "./lineOrder.controller.js";

export const lineOrderRouter = Router()

lineOrderRouter.get('/', findAll)
lineOrderRouter.get('/:id', findOne)
lineOrderRouter.post('/', sanitizeLineOrderInput, add)
lineOrderRouter.put('/:id', sanitizeLineOrderInput, update)
lineOrderRouter.patch('/:id', sanitizeLineOrderInput, update)
lineOrderRouter.delete('/:id', sanitizeLineOrderInput, remove)