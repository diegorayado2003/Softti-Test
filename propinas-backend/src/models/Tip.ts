import mongoose from 'mongoose';

const TipSchema = new mongoose.Schema({
    totalAmount: { type: Number, required: true },
    employees: { type: [String], default: [] },
    paymentMethod: { type: String, enum: ['cash', 'card', 'other'], required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Tip = mongoose.model('Tip', TipSchema);
