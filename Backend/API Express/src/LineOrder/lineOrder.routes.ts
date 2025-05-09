import { Router } from "express";
import { sanitizeLineOrderInput, findAll, findOne, add, update, remove, findAllWithOrderId } from "./lineOrder.controller.js";

export const lineOrderRouter = Router()

lineOrderRouter.get('/', findAll)
lineOrderRouter.get('/:order', findAllWithOrderId)
lineOrderRouter.post('/', sanitizeLineOrderInput, add)
lineOrderRouter.put('/:id', sanitizeLineOrderInput, update)
lineOrderRouter.patch('/:id', sanitizeLineOrderInput, update)
lineOrderRouter.delete('/:id', sanitizeLineOrderInput, remove)