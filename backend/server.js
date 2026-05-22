const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const proyeccionRoutes = require('./routes/proyeccion.routes');

const allowedOrigins = [
  'http://localhost:4200',
  process.env.FRONTEND_URL
];

// Middlewares
app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {

    if (
      !origin ||
      allowedOrigins.includes(origin)
    ) {

      callback(null, true);

    } else {

      callback(
        new Error('No permitido por CORS')
      );
    }
  }
}));

// Rutas
app.use('/api/proyecciones', proyeccionRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)

.then(() => {

  console.log('MongoDB conectado 🚀');

})

.catch(err => {

  console.error('Error MongoDB:', err);

});

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Servidor corriendo en puerto ${PORT}`);

});