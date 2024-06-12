import express from 'express'
import { usuarioRouter } from './Usuario/usuario.routes.js'

const app = express()
app.use(express.json())     //middleware que completa el req.body

app.use('/api/usuarios', usuarioRouter)

app.use((_, res) =>{
    return res.status(404).send({message: 'Resource not found.'})
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
})