import { Transaction } from '../models/transactions';
import { rabbitMQConnect} from './rabbitMQconnection';
export function sendData(transaction:Transaction){
    rabbitMQConnect(transaction)
}
