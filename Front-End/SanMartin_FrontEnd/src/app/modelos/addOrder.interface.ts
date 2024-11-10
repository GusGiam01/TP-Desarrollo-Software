import { lineOrderI } from "./lineOrder.interface.js";
import { userI } from "./user.interface.js";

export interface addOrderI{
    confirmDate:Date;
    user: userI;
    linesOrder:Array<lineOrderI>;
    totalAmount:number;
    statusHistory:string;
}