import { addressI } from "./address.interface.js";

export interface responseAddressesI {
    data: Array<addressI>;
    message: string;
}