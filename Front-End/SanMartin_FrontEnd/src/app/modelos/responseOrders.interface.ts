import { orderI } from "./order.interface.js";

export interface responseOrdersI {
    data : Array<orderI>;
    message: string;
}