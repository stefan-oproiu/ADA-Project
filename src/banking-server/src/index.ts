import express from 'express';
import bodyParser from 'body-parser';
import UsersRoutes from './routes/users';

import { mongooseConnection } from './utils/dbconnection';
import { rabbitMQConnectAndConsumeUsers } from './utils/rabbitMQconnection';
const config = require('./config');

const app = express();
rabbitMQConnectAndConsumeUsers()
app.use(bodyParser.json());
mongooseConnection;
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
app.use(UsersRoutes);

app.listen(config.BANKING_SERVER_PORT);
