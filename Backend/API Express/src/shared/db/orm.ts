import { MikroORM } from '@mikro-orm/core'           
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter'

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'tiendaSM',
  type: "mongo",
  /*clientUrl: 'mongodb+srv://usuario:usuario@cluster.k0o09.mongodb.net/',*/
  clientUrl: 'mongodb://localhost:27017/tiendaSM',
  highlighter: new MongoHighlighter(),
  debug: true,
})