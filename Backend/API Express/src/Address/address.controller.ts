import { Request, Response, NextFunction } from "express"
import { Address } from "./address.entity.js"
import { orm } from "../shared/db/orm.js"
import { User } from "../User/user.entity.js"

const em = orm.em

function sanitizeAdressInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedAdressInput = {
    zipCode: req.body.zipCode,
    nickname: req.body.nickname,
    address: req.body.address,
    province: req.body.province,
    user: req.body.user,
    orders: req.body.orders
  }

  Object.keys(req.body.sanitizedAdressInput).forEach((key) => {
    if (req.body.sanitizedAdressInput[key] === undefined) {
      delete req.body.sanitizedAdressInput[key]
    }
  })

  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const adresss = await em.find(
      Address,
      {}
    )
    res.status(200).json({ message: 'found all adresss', data: adresss })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response, id: string) {
  try {
    //const id = req.params.id
    const adress = await em.findOneOrFail(Address, { id })
    res.status(200).json({ message: 'found adress', data: adress })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const adress = em.create(Address, req.body.sanitizedAdressInput)
    await em.flush()
    res.status(201).json({ message: 'adress created', data: adress })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const adressToUpdate = await em.findOneOrFail(Address, { id })
    em.assign(adressToUpdate, req.body.sanitizedAdressInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'adress updated', data: adressToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const adress = em.getReference(Address, id)
    await em.removeAndFlush(adress)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findAllByUserId(req: Request, res: Response, id:string) {
  try {
    const user = await em.findOneOrFail(User, {id})
    const order = await em.find(Address, { user })    

    res.status(200).json({ message: 'found order', data: order })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeAdressInput, findAll, findAllByUserId, findOne, add, update, remove }