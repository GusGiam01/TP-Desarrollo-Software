import { ObjectId } from 'mongodb';

export class User{
    constructor(
        public name:string, 
        public surname:string, 
        public user:string,
        public password:string,
        public type:string,
        public mail:string,
        public cellphone:number,
        public age:number,
        public _id ?: ObjectId
    ){

    }
}