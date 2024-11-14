# TP-Desarrollo-Software
## Informacion del grupo
**Integrantes del grupo:** Gustavo Giampietro (50671) & Juan Cruz Mondino (51922)  
**Profesores:** Andres Otaduy & Mario Bressano  
**Comisión:** 3k02  

### Repositorio fullstack
-----

### Video de las principales funcionalidades de la aplicación
-----

### Pull request inicial
-----

## Instrucciones de instalación y ejecución
1. Clonar el repositorio:
 ```sh
  git clone --------------------
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

## Modelo
![Modelo de dominio](./estructura%20de%20negocio/Modelo_de_dominio.png)

## Alcance funcional
### Alcance mínimo
| Req | Detalle |
|--------------|--------------|
| CRUD Simple | 1. CRUD Usuario\n2. CRUD Producto|
| CRUD dependiente| 1. Línea de pedido (depende de producto y de orden)\n2. Orden (depende de Usuario)|
| Listado\n+\ndetalle| 1. Listado de productos:\nse ordena alfabeticamente y por precio |
| CUU/Epic | 1. Login de user\n2. Crear un producto |
