import { Request, Response, NextFunction } from "express"
import { User } from "./user.entity.js"
import { orm } from "../shared/db/orm.js"
import { Address } from "../Address/address.entity.js"
import { set } from "mongoose"


const em = orm.em

function normalizeDni(dni: unknown): string | undefined {
  if (dni === undefined || dni === null) return undefined;
  return String(dni).replace(/\D/g, ''); // deja solo números
}

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
    dni: normalizeDni(req.body.dni),
    addresses: req.body.addresses 
  }


  Object.keys(req.body.sanitizedUserInput).forEach((key) => {
    if (req.body.sanitizedUserInput[key] === undefined) {
      delete req.body.sanitizedUserInput[key];
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
    const user = em.create(User, req.body.sanitizedUserInput);
    await em.flush();
    return res.status(201).json({ message: 'user created', data: user });
  } catch (error: any) {
    // Mongo duplicate key suele incluir "E11000"
    if (String(error?.message).includes('E11000')) {
      return res.status(409).json({ message: 'User already exists (duplicate unique field)' });
    }
    return res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const userToUpdate = await em.findOneOrFail(User, { id });

    em.assign(userToUpdate, req.body.sanitizedUserInput);
    await em.flush();

    return res.status(200).json({ message: 'user updated', data: userToUpdate });
  } catch (error: any) {
    // Duplicado por unique index en Mongo
    if (String(error?.message).includes('E11000')) {
      return res.status(409).json({ message: 'Duplicate value for a unique field (dni)' });
    }

    // Si no encuentra el usuario
    if (error?.name === 'NotFoundError') {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(500).json({ message: error.message });
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
