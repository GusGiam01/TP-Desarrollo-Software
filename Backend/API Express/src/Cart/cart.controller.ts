import { Request, Response, NextFunction } from "express";
import { Cart } from "./cart.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em;

function sanitizeCartInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedCartInput = {
    userId: req.body.userId,
    products: req.body.products.map((product: any) => ({
      code: product.code,
      priceUni: product.priceUni,
      name: product.name,
      stock: product.stock,
      type: product.type,
      state: product.state,
      discount: product.discount,
      brand: product.brand,
    })),
    date: req.body.date,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
  };

  Object.keys(req.body.sanitizedCartInput).forEach((key) => {
    if (req.body.sanitizedCartInput[key] === undefined) {
      delete req.body.sanitizedCartInput[key];
    }
  });

  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const carts = await em.find(Cart, {});
    res.status(200).json({ message: "found all carts", data: carts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cart = await em.findOneOrFail(Cart, { id });
    res.status(200).json({ message: "found cart", data: cart });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const cart = em.create(Cart, req.body.sanitizedCartInput);
    await em.flush();
    res.status(201).json({ message: "cart created", data: cart });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cartToUpdate = await em.findOneOrFail(Cart, { id });
    em.assign(cartToUpdate, req.body.sanitizedCartInput);
    await em.flush();
    res.status(200).json({ message: "cart updated", data: cartToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cart = em.getReference(Cart, id);
    await em.removeAndFlush(cart);
    res.status(200).json({ message: "cart removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeCartInput, findAll, findOne, add, update, remove };
