import { Router } from "express";
import { sanitizeProductInput, findAll, findOne, add, update, remove, findOneByCode } from "./product.controller.js";

export const productRouter = Router()

productRouter.get('/', findAll)
productRouter.get('/code/:code', findOneByCode);
productRouter.get('/:id', findOne)
productRouter.post('/', sanitizeProductInput, add)
productRouter.put('/:id', sanitizeProductInput, update)
productRouter.patch('/:id', sanitizeProductInput, update)
productRouter.delete('/:id', sanitizeProductInput, remove)