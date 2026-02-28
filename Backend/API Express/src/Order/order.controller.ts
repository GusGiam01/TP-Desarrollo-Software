import { Request, Response, NextFunction } from "express"
import { Order } from "../Order/order.entity.js"
import { User } from "../User/user.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em

function normalizeStatusHistory(raw: any): string[] | undefined {
  if (raw === undefined || raw === null) return undefined;

  if (Array.isArray(raw)) {
    return raw
      .map((s) => String(s).trim().toUpperCase())
      .filter((s) => s.length > 0);
  }

  const s = String(raw).trim().toUpperCase();
  return s ? [s] : undefined;
}

function sanitizeOrderInput(req: Request, res: Response, next: NextFunction) {
  const statusHistory = normalizeStatusHistory(req.body.statusHistory);

  req.body.sanitizedOrderInput = {
    confirmDate: req.body.confirmDate,
    user: req.body.user,
    linesOrder: req.body.linesOrder,
    totalAmount: req.body.totalAmount,
    statusHistory,              // 👈 ahora SIEMPRE string[]
    address: req.body.address,
  };

  Object.keys(req.body.sanitizedOrderInput).forEach((key) => {
    if (req.body.sanitizedOrderInput[key] === undefined) {
      delete req.body.sanitizedOrderInput[key];
    }
  });

  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const status = String(req.query.status ?? '').trim().toUpperCase();

    const where = status
      ? { statusHistory: { $contains: [status] } }
      : {};

    const orders = await em.find(Order, where);
    res.status(200).json({ message: 'found all orders', data: orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

  
  async function findOne(req: Request, res: Response, id:string) {
    try {
      //const id = req.params.id
      console.log("Entro: ", id)
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
      if (!order) {
        return res.status(404).json({ message: "order not found" });
      }
      await em.removeAndFlush(order)
      return res.status(200).json({ message: 'order removed' })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async function findAllByUserId(req: Request, res: Response, id:string) {
    try {
      const user = await em.findOneOrFail(User, {id})
      const order = await em.find(Order, { user })  

      res.status(200).json({ message: 'found order', data: order })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

export {sanitizeOrderInput, findAll, findOne, findAllByUserId, add, update, remove}