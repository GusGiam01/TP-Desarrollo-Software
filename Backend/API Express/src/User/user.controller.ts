import { Request, Response, NextFunction } from "express"
import { User } from "./user.entity.js"
import { orm } from "../shared/db/orm.js"
import { Address } from "../Address/address.entity.js"
import { set } from "mongoose"
import bcrypt from "bcrypt";


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
    const users = await em.find(User, {});
    const sanitizedUsers = users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
    res.status(200).json({ message: 'found all users', data: sanitizedUsers });
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response, id:string) {
  try {
    const user = await em.findOneOrFail(User, { id });
    const { password, ...safeUser } = user;
    res.status(200).json({ message: 'found user', data: safeUser });
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {

    if (req.body.sanitizedUserInput.password) {
      const hashedPassword = await bcrypt.hash(
        req.body.sanitizedUserInput.password,
        10
      );
      req.body.sanitizedUserInput.password = hashedPassword;
    }

    const user = em.create(User, req.body.sanitizedUserInput);
    await em.flush();

    user.password = undefined as any;

    res.status(201).json({ message: 'user created', data: user });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const userToUpdate = await em.findOneOrFail(User, { id });

    if (req.body.sanitizedUserInput.password) {
      const hashedPassword = await bcrypt.hash(
        req.body.sanitizedUserInput.password,
        10
      );
      req.body.sanitizedUserInput.password = hashedPassword;
    }

    em.assign(userToUpdate, req.body.sanitizedUserInput);
    await em.flush();

    const { password, ...safeUser } = userToUpdate;

    res.status(200).json({
      message: 'user updated',
      data: safeUser
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
    const user = await em.findOneOrFail(User, { dni });
    const { password, ...safeUser } = user;
    res.status(200).json({ message: 'found user', data: safeUser });

  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeUserInput, findAll, findOne, findOneByDni, add, update, remove }
