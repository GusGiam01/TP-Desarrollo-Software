import { Request, Response, NextFunction } from "express"
import { Adress } from "./address.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em

function sanitizeAdressInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedAdressInput = {
    zipCode: req.body.zipCode,
    nickname: req.body.nickname,
    address: req.body.address,
    province: req.body.province
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
      Adress,
      {}
    )
    res.status(200).json({ message: 'found all adresss', data: adresss })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id
    const adress = await em.findOneOrFail(Adress, { id })
    res.status(200).json({ message: 'found adress', data: adress })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const adress = em.create(Adress, req.body.sanitizedAdressInput)
    await em.flush()
    res.status(201).json({ message: 'adress created', data: adress })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const adressToUpdate = await em.findOneOrFail(Adress, { id })
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
    const adress = em.getReference(Adress, id)
    await em.removeAndFlush(adress)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeAdressInput, findAll, findOne, add, update, remove }