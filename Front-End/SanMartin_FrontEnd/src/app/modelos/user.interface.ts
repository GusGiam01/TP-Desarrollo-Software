export interface userI{
    id:string;
    name:string;
    surname:string;
    username:string;
    password:string;
    type:string;
    mail:string;
    cellphone:string;
    age?:number | null;
    birthDate: Date;
    dni:string;
}
