export interface signinI{
    name:string;
    surname:string;
    userName:string;
    password:string;
    type:string;
    mail:string;
    cellphone:string;
    age?:number | null;
    birthDate: Date;
    dni:string;
}