import { Request, Response, NextFunction } from "express"
import { User } from "./user.entity.js"
import { orm } from "../shared/db/orm.js"
import { Address } from "../Address/address.entity.js"
import { set } from "mongoose"


const em = orm.em

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedUserInput = {
    name: req.body.name,
    surname: req.body.surname,
    address: req.body.address,
    password: req.body.password,
    type: req.body.type,
    mail: req.body.mail,
    cellphone: req.body.cellphone,
    age: req.body.age,
    birthDate: req.body.birthDate,
    dni: req.body.dni,
    addresses: req.body.addresses 
  }


  Object.keys(req.body.sanitizedUserInput).forEach((key) => {
    if (req.body.sanitizedUserInput[key] === undefined) {
      delete req.body.sanitizedUserInput[key]
    }
  })

  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const users = await em.find(
      User,
      {}
    )
    res.status(200).json({ message: 'found all users', data: users })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response, id:string) {
  try {
    //const id = req.params.id
    const user = await em.findOneOrFail(User, { id })
    res.status(200).json({ message: 'found user', data: user })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const user = em.create(User, req.body.sanitizedUserInput)
    await em.flush()
    res.status(201).json({ message: 'user created', data: user })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    
    const id = req.params.id
    const userToUpdate = await em.findOneOrFail(User, { id })
    em.assign(userToUpdate, req.body.sanitizedUserInput)
    await em.flush()
    console.log(req.body.sanitizedUserInput)
    res
      .status(200)
      .json({ message: 'user updated', data: userToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const user = em.getReference(User, id)
    await em.removeAndFlush(user)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOneByDni(req: Request, res: Response, dni:string) {
  try {
    //const dni = req.params.dni
    const user = await em.findOneOrFail(User, { dni })
    res.status(200).json({ message: 'found user', data: user })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeUserInput, findAll, findOne, findOneByDni, add, update, remove }
