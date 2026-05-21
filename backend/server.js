const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB conectado 🚀'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});

app.use('/api/proyecciones',
    require('./routes/proyeccion.routes')
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});