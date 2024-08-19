import { Repository } from "../shared/repository.js";
import { Producto } from "./producto.entity.js";

const productos/*: Producto[] */= [        //lo comentado se infiere
    new Producto(
        1,
        20.50,
        'Queso',
        'Agotado',
        2,
        'Lacteos',
        'La paulina',
        23,
        '1e2f651f-f4a4-4de1-9bf1-142a38839a9f'
    ),
] 

export class ProductoRepository implements Repository<Producto>{

    public findAll(): Producto[] | undefined{
        return productos
    }

    public findOne(item: {id: string;}): Producto | undefined{
        return productos.find((producto)=>producto.id === item.id)
    }

    public add(item: Producto): Producto | undefined{
        productos.push(item)
        return item
    }

    public update(item: Producto): Producto | undefined {
        const productoId = productos.findIndex((producto) => producto.id === item.id)

        if(productoId !== -1){
            productos[productoId] = {...productos[productoId], ...item}
        }
        return productos[productoId]
    }

    public delete(item: {id: string;}): Producto | undefined{
        const productoId = productos.findIndex((producto) => producto.id === item.id)

        if(productoId !== -1){
            const deletedProductos = productos[productoId] 
            productos.splice(productoId, 1)
            return deletedProductos
        }
    }
}