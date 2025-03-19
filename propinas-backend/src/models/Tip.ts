import mongoose from 'mongoose';

const TipSchema = new mongoose.Schema({
    totalAmount: { type: Number, required: true },
    employees: { type: Number, default: 1 },
    paymentMethod: { type: String, enum: ['cash', 'card', 'other'], required: false },
    splitDetails: [{
        employee: { type: Number, required: true },
        amount: { type: Number, required: true }
    }],
    createdAt: { type: Date, default: Date.now }
});

export const Tip = mongoose.model('Tip', TipSchema);