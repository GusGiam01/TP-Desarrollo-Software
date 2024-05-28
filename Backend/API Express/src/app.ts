import express, { NextFunction, Request, Response } from 'express'
import {Usuario} from './Usuario/usuarios.entity.js'
import { UsuarioRepository } from './Usuario/usuario.repository.js'

const app = express()
app.use(express.json())     //middleware que completa el req.body

//GET obtiene informacion sobre recursos desde el servidor
//POST crear nuevos recursos
//DELETE borrar recursos
//PUT y PATCH modificarán recursos

//usuario -> /api/v1/usuarios/
//get /api/v1/usuarios/:id -> obtener el usuario con id = :id
//post /api/v1/usuarios/ -> crear nuevos usuarios
//delete /api/v1/usuarios/:id -> borrar usuario con id = :id (se debe indicar el recurso del objeto a borrar)
//put o patch /api/v1/usuarios/ -> modificar usuario con id = :id

const repository = new UsuarioRepository()

const usuarios/*: Usuario[] */= [        //lo comentado se infiere
    new Usuario(
        'Juan Cruz',
        'Mondino',
        'JuanC',
        '1234',
        'Administrativo',
        'juancm.2000@hotmail.com',
        3364257592,
        23,
        '1e2f651f-f4a4-4de1-9bf1-142a38839a9f'
    ),
] 

//El Request, el Response y el NextFunction son de Express
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

app.get('/api/usuarios', (req, res)=>{
    res.json({data: repository.findAll() })
})

app.get('/api/usuarios/:id', (req, res)=>{
    const usuario = repository.findOne({id: req.params.id})
    if(!usuario){
        return res.status(404).send({message:'User not found.'})
    }
    res.json(usuario)
})

app.post('/api/usuarios', sanitizeUsuarioInput, (req, res) => {
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

    const usuario = repository.add(usuarioInput)
    return res.status(201).send({message: 'User created', data: usuario})
})

app.put('/api/usuarios/:id', sanitizeUsuarioInput, (req, res) =>{
    req.body.sanitizedUsuarioInput.id = req.params.id
    const usuario = repository.update(req.body.sanitizedUsuarioInput)

    if(!usuario){
        return res.status(404).send({message:'User not found.'})
    }
    return res.status(200).send({message: 'User updated.', data: usuario})
})

app.patch('/api/usuarios/:id', sanitizeUsuarioInput, (req, res) =>{
    req.body.sanitizedUsuarioInput.id = req.params.id
    const usuario = repository.update(req.body.sanitizedUsuarioInput)

    if(!usuario){
        return res.status(404).send({message:'User not found.'})
    }
    return res.status(200).send({message: 'User updated.', data: usuario})
})

app.delete('/api/usuarios/:id', (req, res)=>{
    const id = req.params.id
    const usuario = repository.delete({id})
    
    if(!usuario){
        return res.status(404).send({message:'User not found.'})
    }else{
        return res.status(200).send({message:'User deleted succesfully.'})
    }
})

app.use((_, res) =>{
    return res.status(404).send({message: 'Resource not found.'})
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
})