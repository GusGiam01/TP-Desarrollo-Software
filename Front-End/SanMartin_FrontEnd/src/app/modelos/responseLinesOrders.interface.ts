import { lineOrderI } from "./lineOrder.interface.js";

export interface responseLinesOrderI {
    data: Array<lineOrderI>;
    message: string;
}