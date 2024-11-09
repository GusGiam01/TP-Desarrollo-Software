import { Injectable } from "@angular/core";
import { loginI } from "../../modelos/login.interface.js";
import { responseI } from "../../modelos/response.interface.js";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { userI } from "../../modelos/user.interface.js";
import { signinI } from "../../modelos/signin.interface.js";
import { responseProductsI } from "../../modelos/responseProducts.interface.js";
import { responseProdI } from "../../modelos/responseProduct.interface.js";

@Injectable({
    providedIn: 'root'
})
export class ApiService{
    readonly url:string = "/api"

    constructor(private http:HttpClient){   }

    user:any;

    searchByDni(dni:string):Observable<responseI>{
        let direccion = this.url + "/users/" + dni;
        return this.http.get<responseI>(direccion);
    }

    postUser(user:signinI){
       let direccion = this.url + "/users";
       return this.http.post<responseI>(direccion, user)
    }

    searchProducts(){
        let direction = this.url + "/products";
        return this.http.get<responseProductsI>(direction)
    }

    searchProductByCode(code:string){
        let direction = this.url + "/products/" + code;
        return this.http.get<responseProdI>(direction)
    }
}