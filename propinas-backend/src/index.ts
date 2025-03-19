import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor funcionando 🚀');
});

app.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
});
