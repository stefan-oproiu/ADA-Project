import mongoose, { Schema } from 'mongoose';
import { TransactionSchema } from './transactions';


export const UserSchema = new mongoose.Schema({
    id: {type: String, required: true },
    fullName: { type: String, required: true },
    balance: { type: Number, required: true },
    transactions: [{ type:String, required: true, ref:"Transaction" }]
});

const UserTable = mongoose.model('User', UserSchema);

export default UserTable;