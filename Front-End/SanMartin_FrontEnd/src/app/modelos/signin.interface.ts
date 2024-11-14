import { orderI } from "./order.interface.js";

export interface signinI{
    name:string;
    surname:string;
    address:string;
    password:string;
    type:string;
    mail:string;
    cellphone:string;
    age?:number | null;
    birthDate: Date;
    dni:string;
    orders:Array<string>;
}