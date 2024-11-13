import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api/api.service.js';
import { Router } from '@angular/router';  // Para navegar después de la compra
import { addShippingI } from '../../modelos/addShipping.interface.js';

@Component({
  selector: 'app-execute-purchase',
  templateUrl: './execute-purchase.component.html',
  styleUrls: ['./execute-purchase.component.css']
})
export class ExecutePurchaseComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    // Obtener los productos del carrito desde el backend o servicio adecuado
    this.cartLinesOrder = this.getCartItems(); // Puedes obtenerlos desde el servicio Api si es necesario
    this.calculateTotal(); // Calcular el total de la compra
  }

  // Obtener los productos del carrito
  getCartItems(): any[] {
    // Aquí puedes hacer una llamada a tu servicio para obtener los productos en el carrito.
    // Asegúrate de que la API esté bien configurada para manejar esta consulta.
    // Por ejemplo, usando ApiService si lo tienes implementado.
    // return this.apiService.getCartItems(); // Un ejemplo de cómo podrías hacer esto si existiera un endpoint.
    return []; // Retorna el carrito vacío como ejemplo.
  }

  // Calcular el total de la compra
  calculateTotal(): void {
    this.total = this.cartLinesOrder.reduce((acc, item) => acc + (item.product.priceUni * item.quantity), 0);
  }

  // Método para procesar la compra
  submitPurchase(): void {
    if (this.isFormValid()) {
      // Crear un objeto con la información necesaria para realizar la compra
      const orderData = {
        shippingDetails: this.shippingDetails,
        paymentDetails: this.paymentDetails,
        linesOrder: this.cartLinesOrder,
        total: this.total
      };

      // Llamar al API para realizar la compra
      this.apiService.postShipping(orderData).subscribe(
        (response) => {
          // Lógica si la compra fue exitosa
          alert('Compra realizada con éxito!');
          this.router.navigate(['/confirmation']); // Redirige a una página de confirmación
        },
        (error) => {
          // Lógica si hubo un error al procesar la compra
          alert('Hubo un error al procesar la compra. Intente nuevamente.');
        }
      );
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }

  // Método para validar que el formulario está completo
  isFormValid(): boolean {
    
    var respuesta;
    
    if (this.shippingDetails.fullName && this.shippingDetails.address && this.shippingDetails.city && this.shippingDetails.zipCode && this.paymentDetails.cardNumber 
      && this.paymentDetails.expiryDate && this.paymentDetails.cvv && this.paymentDetails.cardholderName){
      respuesta = true;
    }else{
      respuesta = false;
    }
    return respuesta;
  }

  // Método para manejar el envío de la información del formulario
  onSubmit(): void {
    if (this.isFormValid()) {
      console.log('Detalles de Envío:', this.shippingDetails);
      console.log('Detalles de Pago:', this.paymentDetails);
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}
