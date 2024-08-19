import { Request, Response, NextFunction } from "express"
import { ProductoRepository } from "./producto.repository.js"
import { Producto } from "./producto.entity.js"

const repository = new ProductoRepository()

function sanitizeProductoInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedProductoInput = {
        codigo: req.body.codigo,
        precioUni: req.body.precioUni,
        nombre: req.body.nombre,
        estado: req.body.estado,
        descuento: req.body.descuento,
        tipo: req.body.tipo,
        marca: req.body.marca,
    }

    Object.keys(req.body.sanitizedProductoInput).forEach((key) => {
        if (req.body.sanitizedProductoInput[key] === undefined) {
            delete req.body.sanitizedProductoInput[key]
        }
    })

    next()
}

function findAll(req: Request, res: Response) {
    res.json({ data: repository.findAll() })
}

function findOne(req: Request, res: Response) {
    const producto = repository.findOne({ id: req.params.id })
    if (!producto) {
        return res.status(404).send({ message: 'Product not found.' })
    }
    res.json(producto)
}

function add(req: Request, res: Response) {
    const input = req.body.sanitizedProductoInput
    const productoInput = new Producto(
        input.codigo,
        input.precioUni,
        input.nombre,
        input.estado,
        input.descuento,
        input.tipo,
        input.marca
    )
    const producto = repository.add(productoInput)
    return res.status(201).send({ message: 'Product created', data: producto })
}

function update(req: Request, res: Response) {
    req.body.sanitizedProductoInput.id = req.params.id
    const producto = repository.update(req.body.sanitizedProductoInput)
    if (!producto) {
        return res.status(404).send({ message: 'Product not found.' })
    }
    return res.status(200).send({ message: 'Product updated.', data: producto })
}

function remove(req: Request, res: Response) {
    const id = req.params.id
    const producto = repository.delete({ id })
    if (!producto) {
        return res.status(404).send({ message: 'Product not found.' })
    } else {
        return res.status(200).send({ message: 'Product deleted successfully.' })
    }
}

export { sanitizeProductoInput, findAll, findOne, add, update, remove }
