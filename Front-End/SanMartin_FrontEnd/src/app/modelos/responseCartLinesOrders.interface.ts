import { cartLineOrderI } from "./cartLineOrder.interface.js";

export interface responseCartLinesOrderI {
    data: Array<cartLineOrderI>;
    message: string;
}