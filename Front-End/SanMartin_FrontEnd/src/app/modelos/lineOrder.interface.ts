import { productI } from "./product.interface.js";

export interface lineOrderI{
    product:productI;
    quantity:number;
}