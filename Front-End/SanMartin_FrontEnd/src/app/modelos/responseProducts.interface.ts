import { productI } from "./product.interface.js";

export interface responseProductsI {
    data : Array<productI>;
    message: string;
}