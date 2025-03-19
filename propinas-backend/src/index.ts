import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database';
import { Tip } from './models/Tip';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();



// Registrar el monto total de propinas
app.post('/tips', async (req, res) => {
    try {
        const { totalAmount, paymentMethod } = req.body;
        if (!totalAmount || totalAmount <= 0 || !paymentMethod) {
            res.status(400).json({ message: 'Datos inválidos' });
        }

        const tip = new Tip({ totalAmount, paymentMethod });
        await tip.save();

        res.status(201).json({ message: 'Propinas registradas', tip });
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar en la BD' });
    }
});

// Dividir las propinas entre empleados
app.post('/tips/split', (req, res) => {
    const { totalAmount, employees } = req.body;
    if (!totalAmount || !employees || employees.length === 0) {
        res.status(400).json({ message: 'Datos inválidos' });
    }
    const amountPerEmployee = totalAmount / employees.length;
    res.json({ message: 'Propinas divididas', amountPerEmployee });
});

// Procesar el pago de propinas
app.post('/tips/pay', (req, res) => {
    const { amount, method } = req.body;
    if (!amount || amount <= 0 || !method) {
       res.status(400).json({ message: 'Datos de pago inválidos' });
    }
    res.json({ message: 'Pago realizado', amount, method });
});

// Obtener historial de transacciones
app.get('/tips/transactions', (req, res) => {
    res.json({ message: 'Lista de transacciones', transactions: [] });
});

// Iniciar servidor
app.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
});
