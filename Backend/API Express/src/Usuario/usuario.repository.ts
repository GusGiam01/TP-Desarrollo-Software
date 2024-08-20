import { Repository } from "../shared/repository.js";
import { Usuario } from "./usuarios.entity.js";
import { db } from "../shared/db/conn.js";
import { ObjectId } from "mongodb";

const usuarios = db.collection<Usuario>('usuarios')

export class UsuarioRepository implements Repository<Usuario>{

    public async findAll(): Promise<Usuario[] | undefined> {
        return await usuarios.find().toArray()
    }

    public async findOne(item: {id: string;}): Promise<Usuario | undefined> {
        const _id = new ObjectId(item.id);
        return (await usuarios.findOne({_id})) || undefined
    }

    public async add(item: Usuario): Promise<Usuario | undefined> {
        item._id=(await usuarios.insertOne(item)).insertedId
        return item
    }

    public async update(id: string, item: Usuario): Promise<Usuario | undefined> {
        const _id = new ObjectId(id)
        return (await usuarios.findOneAndUpdate({_id}, {$set:item}, {returnDocument: 'after'})) || undefined
    }

    public async delete(item: {id: string;}): Promise<Usuario | undefined>{
        const _id = new ObjectId(item.id)
        return (await usuarios.findOneAndDelete({_id}) || undefined)
    }
}