import { Request, Response, NextFunction } from "express"
import { Order } from "../Order/order.entity.js"
import { User } from "../User/user.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em

function sanitizeOrderInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedOrderInput = {
    confirmDate: req.body.confirmDate,
    user: req.body.user,
    linesOrder: req.body.linesOrder,
    totalAmount: req.body.totalAmount,
    statusHistory: req.body.statusHistory,
    address: req.body.address,
    zipCode: req.body.zipCode,
    province: req.body.province,
  };

  Object.keys(req.body.sanitizedOrderInput).forEach((key) => {
    if (req.body.sanitizedOrderInput[key] === undefined) {
      delete req.body.sanitizedOrderInput[key]
    }
  })

  next()
}

async function findAll(req: Request, res: Response) {
    try {
      const orders = await em.find(
        Order,
        {}
      )
      res.status(200).json({ message: 'found all orders', data: orders })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async function findOne(req: Request, res: Response) {
    try {
      const id = req.params.id
      const order = await em.findOneOrFail(Order, { id })
      res.status(200).json({ message: 'found order', data: order })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async function add(req: Request, res: Response) {
    try {
      const order = em.create(Order, req.body.sanitizedOrderInput)
      await em.flush()
      res.status(201).json({ message: 'order created', data: order })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async function update(req: Request, res: Response) {
    try {
      const id = req.params.id
      const orderToUpdate = await em.findOneOrFail(Order, { id })
      em.assign(orderToUpdate, req.body.sanitizedOrderInput)
      await em.flush()
      res
        .status(200)
        .json({ message: 'order updated', data: orderToUpdate })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async function remove(req: Request, res: Response) {
    try {
      const id = req.params.id
      const order = em.getReference(Order, id)
      await em.removeAndFlush(order)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async function findAllByUserId(req: Request, res: Response) {
    try {
      const id = req.params.user

      const user = await em.findOneOrFail(User, {id})

      const order = await em.findOneOrFail(Order, { user })     //Aca esta el problema

      res.status(200).json({ message: 'found order', data: order })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

export {sanitizeOrderInput, findAll, findOne, findAllByUserId, add, update, remove}