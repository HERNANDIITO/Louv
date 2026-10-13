import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

// Conexión a la base de datos MongoDB
mongoose
    .connect(process.env.MONGO_STRING)
    .then(() => console.log('Conectado a la base de datos.'))
    .catch((err) => console.error('Error de conexión a la base de datos:', err));

export default mongoose;
