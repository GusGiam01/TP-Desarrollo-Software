import { Router } from "express";
import { sanitizeOrderInput, findAll, findOne, findAllByUserId, add, update, remove } from "./order.controller.js";

export const orderRouter = Router()

orderRouter.get('/', findAll)
//orderRouter.get('/:id', findOne)
//orderRouter.get('/:user', findAllByUserId)
orderRouter.post('/', sanitizeOrderInput, add)
orderRouter.put('/:id', sanitizeOrderInput, update)
orderRouter.patch('/:id', sanitizeOrderInput, update)
orderRouter.delete('/:id', sanitizeOrderInput, remove)
orderRouter.get('/:value', (req, res) => {
    //type -> "ORDER"|"USER ORDERS"
    const type = req.query.type
    const id = req.params.value
    console.log("", id)
    
    if (!req.params.value) {
        return res.status(400).json({ message: 'Id is required' });
    }
    else {
        if (type == "ORDER") {
            findOne(req, res, id)
        }
        else {
            findAllByUserId(req, res, id)
        }
    }
        
})