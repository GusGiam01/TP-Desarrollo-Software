import { productI } from "./product.interface.js";

export interface lineOrderI{
    id?:string;
    product:string;
    quantity:number;
    order?: string;
}