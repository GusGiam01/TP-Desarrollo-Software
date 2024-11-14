import { Injectable } from "@angular/core";
import { loginI } from "../../modelos/login.interface.js";
import { responseI } from "../../modelos/response.interface.js";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { userI } from "../../modelos/user.interface.js";
import { signinI } from "../../modelos/signin.interface.js";
import { responseProductsI } from "../../modelos/responseProducts.interface.js";
import { responseProdI } from "../../modelos/responseProduct.interface.js";
import { orderI } from "../../modelos/order.interface.js";
import { responseOrderI } from "../../modelos/responseOrder.interface.js";
import { addOrderI } from "../../modelos/addOrder.interface.js";
import { responseLinesOrderI } from "../../modelos/responseLinesOrders.interface.js";
import { lineOrderI } from "../../modelos/lineOrder.interface.js";
import { responseLineOrderI } from "../../modelos/responseLineOrders.interface.js";
import { productI } from "../../modelos/product.interface.js";
import { addProductI } from "../../modelos/addProduct.interface.js";
import { responseOrdersI } from "../../modelos/responseOrders.interface.js";

@Injectable({
    providedIn: 'root'
})
export class ApiService{
    readonly url:string = "/api"

    constructor(private http:HttpClient){   }

    user:any;

    // Usuarios

    searchUserById(id:string){
        let direction = this.url + "/users/" + id;
        return this.http.get<responseI>(direction)
    }

    searchByDni(dni:string):Observable<responseI>{
        let direction = this.url + "/users/" + dni;
        return this.http.get<responseI>(direction);
    }

    postUser(user:signinI){
       let direction = this.url + "/users";
       return this.http.post<responseI>(direction, user)
    }

    updateUser(user:userI){                            
        let direction = this.url + "/users/" + user.id
        return this.http.put<responseProdI>(direction, user)
    }

    // Productos

    searchProducts(){
        let direction = this.url + "/products";
        return this.http.get<responseProductsI>(direction)
    }

    searchProductById(id:string){
        let direction = this.url + "/products/" + id;
        return this.http.get<responseProdI>(direction)
    }

    updateProduct(product:productI){                            
        let direction = this.url + "/products/" + product.id
        return this.http.put<responseProdI>(direction, product)
    }

    postProduct(product:addProductI){                     
        let direction = this.url + "/products";
        return this.http.post<responseOrderI>(direction, product)
    }

    // Orders

    searchOrders(){
        let direction = this.url + "/orders";
        return this.http.get<responseOrdersI>(direction)
    }

    searchOrdersByUserId(userid:string){
        let direction = this.url + "/orders/" + userid;
        return this.http.get<responseOrdersI>(direction)
    }

    postOrder(order:addOrderI){                     
        let direction = this.url + "/orders";
        return this.http.post<responseOrderI>(direction, order)
    }

    searchOrderById(id:string){
        let direction = this.url + "/orders/" + id;
        return this.http.get<responseOrderI>(direction)
    }

    updateOrder(order:orderI){                     
        let direction = this.url + "/orders/" + order.id;
        return this.http.put<responseOrderI>(direction, order)
    }

    // Lineas de Orden

    searchLinesOrderByOrderId(orderid:string){
        let direction = this.url + "/linesorder/" + orderid;
        return this.http.get<responseLinesOrderI>(direction)
    }

    postLineOrder(line:lineOrderI){
        let direction = this.url + "/linesorder";
        return this.http.post<responseLineOrderI>(direction, line)
    }

    removeLineOrder(lineId:string){
        let direction = this.url + "/linesorder/" + lineId;
        return this.http.delete<responseLineOrderI>(direction);
    }
}