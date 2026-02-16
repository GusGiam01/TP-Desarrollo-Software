import { productI } from "./product.interface.js";

export interface addLineOrderI{
    product:string;
    quantity:number;
    order?: string;
}