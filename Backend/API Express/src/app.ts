import express from 'express'
import { userRouter } from './User/user.routes.js'

const app = express()
app.use(express.json())     //middleware que completa el req.body

app.use('/api/users', userRouter)

app.use((_, res) =>{
    return res.status(404).send({message: 'Resource not found.'})
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
})