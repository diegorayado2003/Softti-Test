import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();



const connectDB = async () => {
    
    try {
        await mongoose.connect("mongodb+srv://myAtlasDBUser:8LCieV386VvR3ev@cluster0.huets.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log('🟢 Conectado a MongoDB');
    } catch (error) {
        console.error('🔴 Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;
