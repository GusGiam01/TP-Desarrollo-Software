import { Router } from "express";
import { sanitizeCartInput, findAll, findOne, add, update, remove } from "./cart.controller.js";

export const cartRouter = Router()

cartRouter.get('/', findAll)
cartRouter.get('/:id', findOne)
cartRouter.post('/', sanitizeCartInput, add)
cartRouter.put('/:id', sanitizeCartInput, update)
cartRouter.patch('/:id', sanitizeCartInput, update)
cartRouter.delete('/:id', sanitizeCartInput, remove)