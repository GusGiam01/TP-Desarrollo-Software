import { Router } from "express";
import { sanitizeUserInput, findAll, findOne, add, update, remove, findOneByDni } from "./user.controller.js";

export const userRouter = Router()

userRouter.get('/', findAll)
//userRouter.get('/:dni', findOneByDni)
userRouter.post('/', sanitizeUserInput, add)
userRouter.put('/:id', sanitizeUserInput, update)
userRouter.patch('/:id', sanitizeUserInput, update)
userRouter.delete('/:id', sanitizeUserInput, remove)
userRouter.get('/:value', (req, res) => {
    // type -> "DNI"|"ID"
    const type = req.query.type
    console.log(type)
    if (!req.params.value) {
        console.log("Debe proporcionar un "+type+" valido.")
    }
    else {
        if (type == "ID") {
            const id = req.params.value
            findOne(req, res, id)
            console.log("entro")
        }
        else {
            const dni = req.params.value
            findOneByDni(req, res, dni)
        }
    }
})