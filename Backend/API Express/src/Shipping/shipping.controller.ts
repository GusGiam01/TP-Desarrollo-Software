import { Request, Response, NextFunction} from "express"
import { Shipping } from "../Shipping/shipping.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em

function sanitizeShippingInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedShippingInput = {
      confirmDate: req.body.confirmDate,
      user: req.body.user,
      linesShipping: req.body.linesShipping,
      totalAmount: req.body.totalAmount,
      statusHistory: req.body.statusHistory,
      address: req.body.address,
      city: req.body.city,
      zipCode: req.body.zipCode,
      cardNumber: req.body.cardNumber,
      expiryDate: req.body.expiryDate,
      cvv: req.body.cvv,
      cardholderName: req.body.cardholderName,
      order: req.body.order,
  };

  Object.keys(req.body.sanitizedShippingInput).forEach((key) => {
      if (req.body.sanitizedShippingInput[key] === undefined) {
          delete req.body.sanitizedShippingInput[key];
      }
  });

  next();
}


async function findAll(req: Request, res: Response) {
    try {
      const shippings = await em.find(
        Shipping,
        {}
      )
      res.status(200).json({ message: 'found all shippings', data: shippings })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async function findOne(req: Request, res: Response) {
    try {
      const id = req.params.id
      const shipping = await em.findOneOrFail(Shipping, { id })
      res.status(200).json({ message: 'found shipping', data: shipping })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async function add(req: Request, res: Response) {
    try {
      const shipping = em.create(Shipping, req.body.sanitizedShippingInput)
      await em.flush()
      res.status(201).json({ message: 'shipping created', data: shipping })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async function update(req: Request, res: Response) {
    try {
      const id = req.params.id
      const shippingToUpdate = await em.findOneOrFail(Shipping, { id })
      em.assign(shippingToUpdate, req.body.sanitizedShippingInput)
      await em.flush()
      res
        .status(200)
        .json({ message: 'shipping updated', data: shippingToUpdate })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async function remove(req: Request, res: Response) {
    try {
      const id = req.params.id
      const shipping = em.getReference(Shipping, id)
      await em.removeAndFlush(shipping)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }


export {sanitizeShippingInput, findAll, findOne, add, update, remove}