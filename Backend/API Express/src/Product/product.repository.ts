import { Repository } from "../shared/repository.js";
import { Product } from "./products.entity.js";
import { db } from "../shared/db/conn.js";
import { ObjectId } from "mongodb";

const products = db.collection<Product>('Products')

export class ProductRepository implements Repository<Product>{

    public async findAll(): Promise<Product[] | undefined> {
        return await products.find().toArray()
    }

    public async findOne(item: {id: string;}): Promise<Product | undefined> {
        const _id = new ObjectId(item.id);
        return (await products.findOne({_id})) || undefined
    }

    public async add(item: Product): Promise<Product | undefined> {
        item._id=(await products.insertOne(item)).insertedId
        return item
    }

    public async update(id: string, item: Product): Promise<Product | undefined> {
        const _id = new ObjectId(id)
        return (await products.findOneAndUpdate({_id}, {$set:item}, {returnDocument: 'after'})) || undefined
    }

    public async delete(item: {id: string;}): Promise<Product | undefined>{
        const _id = new ObjectId(item.id)
        return (await products.findOneAndDelete({_id}) || undefined)
    }
}