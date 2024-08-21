import 'reflect-metadata'
import express from 'express'
import { userRouter } from './User/user.routes.js'
import { productRouter } from './Product/product.routes.js'
import { orm } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'

const app = express()
app.use(express.json())     //middleware que completa el req.body

//luego de los middlewares base
app.use((req, res, next) => {
    RequestContext.create(orm.em, next)
})
//antes de las rutas y middlewares de negocio

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)

app.use((_, res) =>{
    return res.status(404).send({message: 'Resource not found.'})
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
}) 