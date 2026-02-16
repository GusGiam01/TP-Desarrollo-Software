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
import { responseAddressI } from "../../modelos/responseAddress.interface.js";
import { addressI } from "../../modelos/address.interface.js";
import { addAddressI } from "../../modelos/addAddress.interface.js";
import { responseAddressesI } from "../../modelos/responseAddresses.interface.js";
import { userPatchI } from '../../modelos/userPatch.interface';
import { orderPatchI } from '../../modelos/orderPatch.interface';



@Injectable({
    providedIn: 'root'
})
export class ApiService {
    readonly url: string = "/api"

    constructor(private http: HttpClient) { }

    user: any;

    // Usuarios

    searchUserById(id:string):Observable<responseI>{
        const params = new HttpParams().set('type', "ID");
        let direction = this.url + "/users/" + id;
        return this.http.get<responseI>(direction, {params});
    }

    searchUserByDni(dni:string):Observable<responseI>{
        const params = new HttpParams().set('type', "DNI");
        let direction = this.url + "/users/" + dni;
        return this.http.get<responseI>(direction, {params});
    }

    postUser(user: signinI) {
        let direction = this.url + "/users";
        return this.http.post<responseI>(direction, user)
    }

    updateUser(user: userI) {
        let direction = this.url + "/users/" + user.id
        return this.http.put<responseI>(direction, user)
    }

    patchUser(user: userPatchI) {
        let direction = this.url + "/users/" + user.id
        return this.http.patch<responseI>(direction, user)
    }

    // Productos

    searchProducts() {
        let direction = this.url + "/products";
        return this.http.get<responseProductsI>(direction)
    }

    searchProductById(id: string) {
        let direction = this.url + "/products/" + id;
        return this.http.get<responseProdI>(direction)
    }

    updateProduct(product: productI) {
        let direction = this.url + "/products/" + product.id
        return this.http.put<responseProdI>(direction, product)
    }

    postProduct(product: addProductI) {
        let direction = this.url + "/products";
        return this.http.post<responseOrderI>(direction, product)
    }

    // Orders

    searchOrders() {
        let direction = this.url + "/orders";
        return this.http.get<responseOrdersI>(direction)
    }

    postOrder(order: addOrderI) {
        let direction = this.url + "/orders";
        return this.http.post<responseOrderI>(direction, order)
    }

    searchOrderById(id: string) {
        const params = new HttpParams().set('type', "ORDER");
        //params.set('ID', id);
        let direction = this.url + "/orders/" + id;
        return this.http.get<responseOrderI>(direction, {params})
    }

    updateOrder(order: orderI) {
        let direction = this.url + "/orders/" + order.id;
        return this.http.put<responseOrderI>(direction, order)
    }

    patchOrder(order: orderPatchI) {
        let direction = this.url + "/orders/" + order.id;
        return this.http.patch<responseOrderI>(direction, order)
    }

    searchOrdersByUser(userid: string) {
        const params = new HttpParams().set('type', "USER ORDERS");
        let direction = this.url + "/orders/" + userid;
        return this.http.get<responseOrdersI>(direction, {params})
    }

    // Lines Order

    searchLinesOrderByOrderId(orderid: string) {
        let direction = this.url + "/linesorder/" + orderid;
        return this.http.get<responseLinesOrderI>(direction)
    }

    postLineOrder(line: lineOrderI) {
        let direction = this.url + "/linesorder";
        return this.http.post<responseLineOrderI>(direction, line)
    }

    removeLineOrder(lineId: string) {
        let direction = this.url + "/linesorder/" + lineId;
        return this.http.delete<responseLineOrderI>(direction);
    }

    // Address

    searchAllAddresses() {
        let direction = this.url + "/addresses";
        return this.http.get<responseAddressI>(direction);
    }
    
    searchAddressById(id: string) {
        const params = new HttpParams().set('type', "ADDRESS");
        let direction = this.url + "/addresses/" + id;
        return this.http.get<responseAddressI>(direction, {params});
    }

    postAddress(address: addAddressI) {
        let direction = this.url + "/addresses";
        return this.http.post<any>(direction, address);
    }
    
    updateAddress(address: addressI) {
        let direction = this.url + "/addresses/" + address.id;
        return this.http.put<responseAddressI>(direction, address);
    }
    
    removeAddress(id: string) {
        let direction = this.url + "/addresses/" + id;
        return this.http.delete<responseAddressI>(direction);
    }
    
    searchAddressesByUserId(userId:string){
        const params = new HttpParams().set('type', "USER ADDRESSES");
        let direction = this.url + "/addresses/" + userId;
        return this.http.get<responseAddressesI>(direction, {params});
    }

    //Otros

    sendEmail(emailData:any):Observable<any>{
        let direction = this.url + "/send-email"
        return this.http.post<any>(direction, emailData)
    }

    fetchData():Observable<any>{
        let direction = this.url + "/data"
        return this.http.get<any>(direction)
    }
    
    createMercadoPagoPreference(orderId: string) {
        const token = localStorage.getItem("token") ?? "";
        return this.http.post<{ preferenceId: string; initPoint: string }>(
            "/api/mercadopago/preference",
            { orderId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }
}