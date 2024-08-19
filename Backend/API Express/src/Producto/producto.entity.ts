import { ObjectId } from 'mongodb';
import crypto from 'node:crypto'

export class Producto{
    constructor(
        public codigo:number, 
        public precioUni:number, 
        public nombre:string,
        public estado:string,
        public descuento:number,
        public tipo:string,
        public marca:string,
        public id = crypto.randomUUID(),
        public _id ?: ObjectId                  //Se la deja como opcional.
    ){

    }
}