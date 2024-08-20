import { ObjectId } from 'mongodb';
import crypto from 'node:crypto'

export class Usuario{
    constructor(
        public name:string, 
        public surname:string, 
        public user:string,
        public password:string,
        public type:string,
        public mail:string,
        public cellphone:number,
        public age:number,
        //public id = crypto.randomUUID(),
        public _id ?: ObjectId                  //Se la deja como opcional.
    ){

    }
}