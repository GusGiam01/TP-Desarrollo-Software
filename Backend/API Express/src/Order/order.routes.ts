import { Router } from "express";
import { sanitizeOrderInput, findAll, findOne, findAllByUserId, add, update, remove } from "./order.controller.js";

export const orderRouter = Router()

orderRouter.get('/', findAll)
//orderRouter.get('/:id', findOne)
orderRouter.get('/:user', findAllByUserId)
orderRouter.post('/', sanitizeOrderInput, add)
orderRouter.put('/:id', sanitizeOrderInput, update)
orderRouter.patch('/:id', sanitizeOrderInput, update)
orderRouter.delete('/:id', sanitizeOrderInput, remove)