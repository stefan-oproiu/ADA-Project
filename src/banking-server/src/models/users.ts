import { Transaction } from './transactions';

export interface User {
    id:string
    fullName: string;
    balance: number;
    transactions: Transaction[];
}