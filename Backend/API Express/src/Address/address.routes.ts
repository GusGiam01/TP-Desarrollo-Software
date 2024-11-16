import { Router } from "express";
import { sanitizeAdressInput, findAll, findAllByUserId, findOne, add, update, remove } from "./address.controller.js";

export const addressRouter = Router()

addressRouter.get('/', findAll)
//addressRouter.get('/:id', findOne)
addressRouter.post('/', sanitizeAdressInput, add)
addressRouter.put('/:id', sanitizeAdressInput, update)
addressRouter.patch('/:id', sanitizeAdressInput, update)
addressRouter.delete('/:id', sanitizeAdressInput, remove)

addressRouter.get('/:value', (req, res) => {
    //type -> "ADDRESS"|"USER ADDRESSES"
    const type = req.query.type
    const id = req.params.value

    if (!req.params.value) {
        return res.status(400).json({ message: 'Id is required' });
    }
    else {
        if (type == "ADDRESS") {
            findOne(req, res)
        }
        else {
            findAllByUserId(req, res, id)
        }
    }
})