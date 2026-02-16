import { Request, Response, NextFunction } from "express"
import { LineOrder } from "./lineOrder.entity.js"
import { orm } from "../shared/db/orm.js" 
import { Product } from "../Product/product.entity.js"
import { MikroORM } from "@mikro-orm/mongodb"

const em = orm.em

function sanitizeLineOrderInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedLineOrderInput = {
    product: req.body.product,
    quantity: req.body.quantity,
    order: req.body.order,
  };

  Object.keys(req.body.sanitizedLineOrderInput).forEach((key) => {
    if (req.body.sanitizedLineOrderInput[key] === undefined || req.body.sanitizedLineOrderInput[key] === null) {
      delete req.body.sanitizedLineOrderInput[key];
    }
  });

  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const lineOrders = await em.find(
      LineOrder,
      {}
    )
    res.status(200).json({ message: 'found all lineOrders', data: lineOrders })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findAllWithOrderId(req: Request, res: Response) {
  try {
    const order = req.params.order
    const lineOrders = await em.find(LineOrder, { order })
    res.status(200).json({ message: 'found all lineOrders', data: lineOrders })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id
    const lineOrder = await em.findOneOrFail(LineOrder, { id })
    res.status(200).json({ message: 'found lineOrder', data: lineOrder })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const lineOrder = em.create(LineOrder, req.body.sanitizedLineOrderInput)
    await em.flush()
    res.status(201).json({ message: 'lineOrder created', data: lineOrder })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const lineOrderToUpdate = await em.findOneOrFail(LineOrder, { id })
    em.assign(lineOrderToUpdate, req.body.sanitizedLineOrderInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'lineOrder updated', data: lineOrderToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const lineOrder = em.getReference(LineOrder, id)
    await em.removeAndFlush(lineOrder)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


export { sanitizeLineOrderInput, findAll, findAllWithOrderId, findOne, add, update, remove }