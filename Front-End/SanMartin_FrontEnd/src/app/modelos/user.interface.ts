export interface userI{
    id:string;
    name:string;
    surname:string;
    password:string;
    type:string;
    mail:string;
    cellphone:string;
    age?:number | null;
    birthDate: Date;
    dni:string;
    address:string;
}
