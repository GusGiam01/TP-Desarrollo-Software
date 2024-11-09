import { lineOrderI } from "./lineOrder.interface.js";

export interface orderI{
    linesOrder:Array<lineOrderI>;
    totalAmount:number;
    orderDate:Date;
    statusHistory:string;
}