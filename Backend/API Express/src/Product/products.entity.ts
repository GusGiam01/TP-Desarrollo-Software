import { ObjectId } from 'mongodb';

export class Product{
    constructor(
        public code:string, 
        public priceUni:number, 
        public name:string,
        public stock:number,
        public state:string,
        public discount:number,
        public type:string,
        public brand:string,
        public _id ?: ObjectId
    ){

    }
}