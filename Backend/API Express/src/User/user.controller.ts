import { Request, Response, NextFunction} from "express"
import { User } from "./user.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em


function sanitizeUserInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedUserInput = {
        name: req.body.name, 
        surname: req.body.surname, 
        user: req.body.user, 
        password: req.body.password, 
        type: req.body.type, 
        mail: req.body.mail, 
        cellphone: req.body.cellphone, 
        age: req.body.age,
    }

    Object.keys(req.body.sanitizedUserInput).forEach((key)=>{
        if(req.body.sanitizedUserInput[key] === undefined) {
            delete req.body.sanitizedUserInput[key]
        }
    })

    next()
}

async function findAll(req: Request, res: Response) {
    try {
      const users = await em.find(
        User,
        {}//,
        //{ populate: ['userClass', 'items'] }
      )
      res.status(200).json({ message: 'found all users', data: users })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async function findOne(req: Request, res: Response) {
    try {
      const id = req.params.id
      //const user = await em.findOneOrFail(User, id)
      const user = await em.findOneOrFail(User, { id })
      res.status(200).json({ message: 'found user', data: user })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async function add(req: Request, res: Response) {
    try {
      const user = em.create(User, req.body.sanitizedInput)
      await em.flush()
      res.status(201).json({ message: 'user created', data: user })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async function update(req: Request, res: Response) {
    try {
      const id = req.params.id
      //const userToUpdate = await em.findOneOrFail(User, id)
      const userToUpdate = await em.findOneOrFail(User, { id })
      em.assign(userToUpdate, req.body.sanitizedInput)
      await em.flush()
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


export {sanitizeUserInput, findAll, findOne, add, update, remove}