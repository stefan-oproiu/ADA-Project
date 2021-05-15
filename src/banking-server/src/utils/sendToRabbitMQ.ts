import { Transaction } from '../models/transactions';
import { rabbitMQConnectAndPublishTransactions} from './rabbitMQconnection';
export function sendData(transaction:Transaction){
    rabbitMQConnectAndPublishTransactions(transaction)
}
