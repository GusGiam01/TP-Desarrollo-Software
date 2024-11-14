import { Router } from "express";
import { sanitizeAdressInput, findAll, findOne, add, update, remove } from "./address.controller.js";

export const addressRouter = Router()

addressRouter.get('/', findAll)
addressRouter.get('/:id', findOne)
addressRouter.post('/', sanitizeAdressInput, add)
addressRouter.put('/:id', sanitizeAdressInput, update)
addressRouter.patch('/:id', sanitizeAdressInput, update)
addressRouter.delete('/:id', sanitizeAdressInput, remove)