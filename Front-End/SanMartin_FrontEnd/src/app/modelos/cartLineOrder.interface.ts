import { productI } from "./product.interface.js";

export interface cartLineOrderI{
    id?:string;
    product:productI;
    quantity:number;
    orderId?:string;
}