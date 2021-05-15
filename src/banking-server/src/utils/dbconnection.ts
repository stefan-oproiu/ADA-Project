import mongoose from 'mongoose';

const config = require('../config')

export const mongooseConnection =
    mongoose
        .connect(
            config.MONGODB_CONNECTION_STRING
            , { useNewUrlParser: true })

const db = mongoose.connection;

db.on('error',(err:any) => console.log(err));