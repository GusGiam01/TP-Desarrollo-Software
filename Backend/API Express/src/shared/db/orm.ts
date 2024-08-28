import { MikroORM } from '@mikro-orm/core'
//import { MikroORM } from '@mikro-orm/mongodb'                   //¿Sería el que está mas abajo?
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter'
import { MongoDriver } from '@mikro-orm/mongodb';

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'tiendaSM',
  //type: 'mongo',
  driver: MongoDriver,
  //driver: 'mongodb',
  clientUrl: 'mongodb://localhost:27017',
  highlighter: new MongoHighlighter(),
  debug: true,
})