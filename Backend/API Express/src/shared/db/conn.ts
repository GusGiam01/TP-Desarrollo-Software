import { MongoClient, Db } from "mongodb";

const connectionStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/'

const cli = new MongoClient(connectionStr)
await cli.connect()

let db:Db=cli.db('tiendaSM')