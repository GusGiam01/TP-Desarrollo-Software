import { lineOrderI } from "./lineOrder.interface.js";

export interface addShippingI{
    address: string;
    city: string;
    zipCode: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    order: string;
}