import { addressI } from "./address.interface.js";
import { lineOrderI } from "./lineOrder.interface.js";
import { userI } from "./user.interface.js";

export interface orderI{
    id:string;
    confirmDate?:Date;
    user: string;
    linesOrder:Array<lineOrderI>;
    totalAmount:number;
    statusHistory:Array<string>;
    address?:addressI;
}