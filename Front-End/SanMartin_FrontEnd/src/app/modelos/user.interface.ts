import { addressI } from "./address.interface";

export interface userI {
    id: string;
    name: string;
    surname: string;
    password: string;
    type: string;
    mail: string;
    cellphone: string;
    age?: number | null;
    birthDate: Date;
    dni: string;
    address: string;
    addresses?: Array<addressI>; // Nueva propiedad para almacenar direcciones (tipo de Adress)
  }
  
