import { Injectable } from "@angular/core";
import { loginI } from "../../modelos/login.interface.js";
import { responseI } from "../../modelos/response.interface.js";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    readonly url:string = "https://jsonplaceholder.typicode.com/users"

    constructor(private http:HttpClient){   }

    user:any;

    loginByDni(dni:string):Observable<responseI>{
        let direccion = "/api/users" ;
        return this.http.get<responseI>(direccion + dni);
    }
}