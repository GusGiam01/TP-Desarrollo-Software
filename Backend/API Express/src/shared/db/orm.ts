import { MikroORM } from '@mikro-orm/core'           
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter'

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'tiendaSM',
  type: "mongo",
<<<<<<< HEAD
=======
  //clientUrl: 'mongodb://localhost:27017',
>>>>>>> 4f19c767a9f03979c4a5aca4502d85a59843e1b1
  clientUrl: 'mongodb+srv://usuario:usuario@cluster.k0o09.mongodb.net/',
  highlighter: new MongoHighlighter(),
  debug: true,
})