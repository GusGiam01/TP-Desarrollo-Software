export interface Repository<T> {
    findAll(): T[] | undefined
    findOne(item: {id: string}): T | undefined        //Si nosotros usamos DNI en vez del ID, cambiamos ese id a Integer?
    add(item: T): T | undefined
    update(item: T): T | undefined
    delete(item: {id: string}): T | undefined         //Recibo un elemento que debe tener si o si ID y ser un objeto.
}