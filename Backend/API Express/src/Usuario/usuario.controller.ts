import { Request, Response, NextFunction} from "express"
import { UsuarioRepository } from "./usuario.repository.js"
import { Usuario } from "./usuarios.entity.js"

const repository = new UsuarioRepository()


function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedUsuarioInput = {
        name: req.body.name, 
        surname: req.body.surname, 
        user: req.body.user, 
        password: req.body.password, 
        type: req.body.type, 
        mail: req.body.mail, 
        cellphone: req.body.cellphone, 
        age: req.body.age,
        //id: req.body.id
    }
    //mas validaciones

    Object.keys(req.body.sanitizedUsuarioInput).forEach((key)=>{
        if(req.body.sanitizedUsuarioInput[key] === undefined) {
            delete req.body.sanitizedUsuarioInput[key]
        }
    })

    next()
}

async function findAll(req:Request, res:Response) {
    res.json({ data: await repository.findAll() })
}

async function findOne(req:Request, res:Response) {
    const usuario = await repository.findOne({id: req.params.id})
    if(!usuario){
        return res.status(404).send({message:'User not found.'})
    }
    res.json(usuario)
}

async function add(req:Request, res:Response) {
    //la info estará en la req.body, pero a veces no se obtiene toda la info, esto se soluciona con middlewares que formen el req.body
    const input = req.body.sanitizedUsuarioInput

    const usuarioInput = new Usuario(
        input.name, 
        input.surname, 
        input.user, 
        input.password, 
        input.type, 
        input.mail, 
        input.cellphone, 
        input.age, 
        //input.id
    )

    const usuario = await repository.add(usuarioInput)
    return res.status(201).send({message: 'User created', data: usuario})
}

async function update(req:Request, res:Response) {
    const usuario = await repository.update(req.params.id, req.body.sanitizedUsuarioInput)

    if(!usuario){
        return res.status(404).send({message:'User not found.'})
    }
    return res.status(200).send({message: 'User updated.', data: usuario})
}

async function remove(req:Request, res:Response) {
    const id = req.params.id
    const usuario = await repository.delete({id})
    
    if(!usuario){
        return res.status(404).send({message:'User not found.'})
    }else{
        return res.status(200).send({message:'User deleted succesfully.'})
    }
}


export {sanitizeUsuarioInput, findAll, findOne, add, update, remove}