import { Transaction } from '../models/transactions';

export function sendData(transaction:Transaction){
    console.log(JSON.stringify(transaction))
}
