import { Request, Response, NextFunction} from "express"
import { ProductRepository } from "./product.repository.js"
import { Product } from "./products.entity.js"

const repository = new ProductRepository()


function sanitizeProductInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedProductInput = {
        code: req.body.code, 
        priceUni: req.body.priceUni, 
        name: req.body.name, 
        stock: req.body.stock, 
        type: req.body.type, 
        state: req.body.state, 
        discount: req.body.discount, 
        brand: req.body.brand
    }

    Object.keys(req.body.sanitizedProductInput).forEach((key)=>{
        if(req.body.sanitizedProductInput[key] === undefined) {
            delete req.body.sanitizedProductInput[key]
        }
    })

    next()
}

async function findAll(req:Request, res:Response) {
    res.json({ data: await repository.findAll() })
}

async function findOne(req:Request, res:Response) {
    const product = await repository.findOne({id: req.params.id})
    if(!product){
        return res.status(404).send({message:'Product not found.'})
    }
    res.json(product)
}

async function add(req:Request, res:Response) {
    const input = req.body.sanitizedProductInput

    const productInput = new Product(
        input.code, 
        input.priceUni, 
        input.name, 
        input.stock, 
        input.type, 
        input.state, 
        input.discount, 
        input.brand,
    )

    const product = await repository.add(productInput)
    return res.status(201).send({message: 'Product created', data: product})
}

async function update(req:Request, res:Response) {
    const product = await repository.update(req.params.id, req.body.sanitizedProductInput)

    if(!product){
        return res.status(404).send({message:'Product not found.'})
    }
    return res.status(200).send({message: 'Product updated.', data: product})
}

async function remove(req:Request, res:Response) {
    const id = req.params.id
    const product = await repository.delete({id})
    
    if(!product){
        return res.status(404).send({message:'Product not found.'})
    }else{
        return res.status(200).send({message:'Product deleted succesfully.'})
    }
}


export {sanitizeProductInput, findAll, findOne, add, update, remove}