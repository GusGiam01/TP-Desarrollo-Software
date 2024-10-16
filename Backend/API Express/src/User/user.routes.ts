import { Router } from "express";
import { sanitizeUserInput, findAll, findOneByDni, add, update, remove } from "./user.controller.js";

export const userRouter = Router()

userRouter.get('/', findAll)
userRouter.get('/:dni', findOneByDni)
userRouter.post('/', sanitizeUserInput, add)
userRouter.put('/:id', sanitizeUserInput, update)
userRouter.patch('/:id', sanitizeUserInput, update)
userRouter.delete('/:id', sanitizeUserInput, remove)