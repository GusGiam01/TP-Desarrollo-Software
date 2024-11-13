import { Router } from "express";
import { sanitizeShippingInput, findAll, findOne, add, update, remove } from "./shipping.controller.js";

export const shippingRouter = Router()

shippingRouter.get('/', findAll)
shippingRouter.get('/:id', findOne)
shippingRouter.post('/', sanitizeShippingInput, add)
shippingRouter.put('/:id', sanitizeShippingInput, update)
shippingRouter.patch('/:id', sanitizeShippingInput, update)
shippingRouter.delete('/:id', sanitizeShippingInput, remove)