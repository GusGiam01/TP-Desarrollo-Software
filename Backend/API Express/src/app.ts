import 'reflect-metadata'
import express from 'express'
import { userRouter } from './User/user.routes.js'
import { productRouter } from './Product/product.routes.js'
import { orm } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { orderRouter } from './Order/order.routes.js'
import { lineOrderRouter } from './LineOrder/lineOrder.routes.js'
import { shippingRouter } from './Shipping/shipping.routes.js'

const app = express()
app.use(express.json())

app.use((req, res, next) => {
    RequestContext.create(orm.em, next)
})

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/linesorder', lineOrderRouter)
app.use('/api/shipping', shippingRouter)

app.use((_, res) =>{
    return res.status(404).send({message: 'Resource not found.'})
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:27017/')
}) 