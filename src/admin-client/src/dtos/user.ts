import {Transaction} from './transaction';

export interface User {
    id: string;
    fullName: string;
    balance: number;
    transactions?: Array<Transaction>;
}
