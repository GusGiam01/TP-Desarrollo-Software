# TP-Desarrollo-Software
## Informacion del grupo
**Integrantes del grupo:** Gustavo Giampietro (50671), Gabriel Dequelli (44073) & Juan Cruz Mondino (51922)  
**Profesores:** Andres Otaduy & Mario Bressano  
**Comisión:** 3k02  

### Repositorio fullstack
https://github.com/GusGiam01/TP-Desarrollo-Software.git

### Video de las principales funcionalidades de la aplicación
https://drive.google.com/file/d/1uorkfZujcWpvdELEk-0UnZMv32eLGcqL/view?usp=sharing

### Pull request inicial
https://github.com/GusGiam01/TP-Desarrollo-Software.git

## Instrucciones de instalación y ejecución
1. Clonar el repositorio:
 ```sh
  git clone https://github.com/GusGiam01/TP-Desarrollo-Software.git
 ```
2. Navega hacia el backend:
  ```sh
  cd backend
  ```
3. Instala las dependencias:
  ```sh
  npm install
  ```
4. Conexión a la base de datos
Nosotros utilizamos mongoDB Atlas, para su utilización debe:
   1. Ir a la parte de extensiones de VS Code e instalarse "MongoDB for VS Code".
   2. Una vez instalada, click "View" en la herramientas de arriba y abrir "Command Palette".
   3. Buscar "MongoDB:Connect with Connection String".
   4. Copiar el siguiente connection string:
   ```sh
   mongodb+srv://usuario:usuario@cluster.k0o09.mongodb.net/
   ```
   5. ¡Listo! Su conexión ya fue realizada.
5. Ejecutar el backend:
   ```sh
   npm run start:dev
   ```
6. Navega hasta el frontend
   ```sh
   cd frontend
   ```
7. Instale dependencias:
   ```sh
   npm install
   ```
8. Ejecute el frontend:
   ```sh
   ng serve -o
   ```
## Descripción del trabajo
Nuestro proyecto se va a basar en la creación de una página web para la venta de una bebida alcoholica, implementando un sistema de control de stock y otro para la reserva. Dentro del control de stock nuestra idea era implementar el ABM de cada producto (resguardándonos contra posible expansión). Para el sistema de reserva habíamos pensado en agregar un “carrito” donde uno puede ir viendo el monto del mismo.
Hay diferentes funcionalidades dependiendo de si el usuario creado es ADMIN o usuario normal, para registrarse como admin es necesario ingresar el siguiente código: DSW2024SM. Si se desea crear una cuenta como user no ingrese nada en ese campo.

## Modelo
![Modelo de dominio](./Estructura-de-negocio/Modelo%20de%20dominio.jpg)

## Alcance funcional
### Alcance mínimo
| Req | Detalle |
|--------------|--------------|
| CRUD Simple | 1. CRUD Usuario 2. CRUD Producto 3. CRUD Direcciones|
| CRUD dependiente| 1. Línea de pedido (depende de producto y de orden)  2. Orden (depende de Usuario)|
| Listado + detalle| 1. Listado de productos:  se ordena alfabeticamente y por precio 2. Listado de ordenes: se ordena por monto y fecha, tiene detalle. 3. Listado direcciones: se ordena por nickname o dirección. |
| CUU/Epic | 0. Registro de user 1. Login de user 2. Explorar catálogo de productos 3. Agregar producto al carrito 4. Eliminar producto del carrito 5. Actualizar productos del carrito 6. Confirmar pedido 7. Realizar pedido |
