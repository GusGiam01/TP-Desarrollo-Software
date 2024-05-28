import { Repository } from "../shared/repository.js";
import { Usuario } from "./usuarios.entity.js";

const usuarios/*: Usuario[] */= [        //lo comentado se infiere
    new Usuario(
        'Juan Cruz',
        'Mondino',
        'JuanCC',
        '1234',
        'Administrativo',
        'juancm.2000@hotmail.com',
        3364257592,
        23,
        '1e2f651f-f4a4-4de1-9bf1-142a38839a9f'
    ),
] 

export class UsuarioRepository implements Repository<Usuario>{

    public findAll(): Usuario[] | undefined{
        return usuarios
    }

    public findOne(item: {id: string;}): Usuario | undefined{
        return usuarios.find((usuario)=>usuario.id === item.id)
    }

    public add(item: Usuario): Usuario | undefined{
        usuarios.push(item)
        return item
    }

    public update(item: Usuario): Usuario | undefined {
        const usuarioId = usuarios.findIndex((usuario) => usuario.id === item.id)

        if(usuarioId !== -1){
            usuarios[usuarioId] = {...usuarios[usuarioId], ...item}
        }
        return usuarios[usuarioId]
    }

    public delete(item: {id: string;}): Usuario | undefined{
        const usuarioId = usuarios.findIndex((usuario) => usuario.id === item.id)

        if(usuarioId !== -1){
            const deletedUsuarios = usuarios[usuarioId] 
            usuarios.splice(usuarioId, 1)
            return deletedUsuarios
        }
    }
}