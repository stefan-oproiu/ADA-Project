import mongoose from 'mongoose';



export const TransactionSchema = new mongoose.Schema({
  id: {type: Number, required: true },
  sourceId: { type: String, required: true },
  targetId: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  sourceFullName: { type: String, required: true },
  targetFullName: { type: String, required: true }
});

const TransactionTable = mongoose.model('Transaction', TransactionSchema);

export default TransactionTable