import { Request, Response, NextFunction} from "express"
import { UserRepository } from "./user.repository.js"
import { User } from "./users.entity.js"

const repository = new UserRepository()


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

async function findAll(req:Request, res:Response) {
    res.json({ data: await repository.findAll() })
}

async function findOne(req:Request, res:Response) {
    const user = await repository.findOne({id: req.params.id})
    if(!user){
        return res.status(404).send({message:'User not found.'})
    }
    res.json(user)
}

async function add(req:Request, res:Response) {
    const input = req.body.sanitizedUserInput

    const userInput = new User(
        input.name, 
        input.surname, 
        input.user, 
        input.password, 
        input.type, 
        input.mail, 
        input.cellphone, 
        input.age,
    )

    const user = await repository.add(userInput)
    return res.status(201).send({message: 'User created', data: user})
}

async function update(req:Request, res:Response) {
    const user = await repository.update(req.params.id, req.body.sanitizedUserInput)

    if(!user){
        return res.status(404).send({message:'User not found.'})
    }
    return res.status(200).send({message: 'User updated.', data: user})
}

async function remove(req:Request, res:Response) {
    const id = req.params.id
    const user = await repository.delete({id})
    
    if(!user){
        return res.status(404).send({message:'User not found.'})
    }else{
        return res.status(200).send({message:'User deleted succesfully.'})
    }
}


export {sanitizeUserInput, findAll, findOne, add, update, remove}