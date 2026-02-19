import 'reflect-metadata'
import express from 'express'
import { userRouter } from './User/user.routes.js'
import { productRouter } from './Product/product.routes.js'
import { orm } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { orderRouter } from './Order/order.routes.js'
import { lineOrderRouter } from './LineOrder/lineOrder.routes.js'
import { addressRouter } from './Address/address.routes.js'
import nodemailer from 'nodemailer';
import cors from 'cors';
import { MikroORM } from '@mikro-orm/mongodb'
import { errorHandler } from './shared/db/errorHandler.js'
import authRoutes from "./Auth/auth.routes.js"


const app = express()
app.use(express.json())
app.use(cors());

app.use((req, res, next) => {
    RequestContext.create(orm.em, next)
})

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/linesorder', lineOrderRouter)
app.use('/api/addresses', addressRouter)
app.use("/api/auth", authRoutes)

app.use(errorHandler);

const transporter = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',   
    port: 587,                
    secure: false,             
    auth: {
      user: 'dc7638f382b6448c47d3d3afe7a75b16',
      pass: 'c1416bd8b0347f80a32e4dce4b116aed',  
    },
    tls: {
      rejectUnauthorized: false 
    }
});

app.post('/api/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
  
    const mailOptions = {
      from: 'gustgiamfacu@gmail.com',
      to: to,
      subject: subject,
      text: text,
    };
  
    transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
      if (error) {
        return res.status(500).json({ message: 'Error al enviar el correo', error });
      } else {
        return res.status(200).json({ message: 'Correo enviado exitosamente', info });
      }
    });
});

app.use((_, res) =>{
    return res.status(404).send({message: 'Resource not found.'})
})


app.listen(3000, () => {
    console.log('Server running on mongodb+srv://usuario:usuario@cluster.k0o09.mongodb.net/')
}) 