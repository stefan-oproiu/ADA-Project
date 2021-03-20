import express from 'express';
import bodyParser from 'body-parser';
import UsersRoutes from './routes/users';

const app = express();

app.use(bodyParser.json());

app.use(UsersRoutes);
app.listen(3000);
console.log('app started')