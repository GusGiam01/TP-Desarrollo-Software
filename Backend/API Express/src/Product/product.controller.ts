import { Request, Response, NextFunction } from "express"
import { Product } from "./product.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em

function normalizeCode(code: unknown): string | undefined {
  if (code === undefined || code === null) return undefined;
  return String(code).trim().toUpperCase(); // opcional pero recomendable
}

function sanitizeProductInput(req: Request, res: Response, next: NextFunction) {
  const code = normalizeCode(req.body.code);

  req.body.sanitizedProductInput = {
    code,
    priceUni: req.body.priceUni,
    name: req.body.name,
    stock: req.body.stock,
    type: req.body.type,
    state: req.body.state,
    discount: req.body.discount,
    brand: req.body.brand,
    ...(code ? { img: `img/products/${code}.png` } : {}),
  };

  Object.keys(req.body.sanitizedProductInput).forEach((key) => {
    if (req.body.sanitizedProductInput[key] === undefined) delete req.body.sanitizedProductInput[key];
  })

  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const products = await em.find(
      Product,
      {}
    )
    res.status(200).json({ message: 'found all products', data: products })
  } catch (error: any) {
    res.status(503).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id
    const product = await em.findOneOrFail(Product, { id })
    res.status(200).json({ message: 'found product', data: product })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const product = em.create(Product, req.body.sanitizedProductInput)
    await em.flush()
    return res.status(201).json({ message: 'product created', data: product })
  } catch (error: any) {
    if (String(error?.message).includes('E11000')) {
      return res.status(409).json({ message: 'Product already exists (duplicate unique field)' });
    }
    return res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const productToUpdate = await em.findOneOrFail(Product, { id })
    em.assign(productToUpdate, req.body.sanitizedProductInput)
    await em.flush()
    return res.status(200).json({ message: 'product updated', data: productToUpdate })
  } catch (error: any) {
    if (String(error?.message).includes('E11000')) {
      return res.status(409).json({ message: 'Duplicate value for a unique field (código)' });
    }

    if (error?.name === 'NotFoundError') {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const product = em.getReference(Product, id)
    await em.removeAndFlush(product)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOneByCode(req: Request, res: Response) {
  try {
    const code = String(req.params.code).trim().toUpperCase();
    const product = await em.findOneOrFail(Product, { code })
    res.status(200).json({ message: 'found product', data: product })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


export { sanitizeProductInput, findAll, findOne, findOneByCode, add, update, remove }