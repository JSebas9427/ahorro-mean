const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const allowedOrigins = [

  'http://localhost:4200',

  process.env.FRONTEND_URL
];

app.use(cors({

  origin: function (
    origin,
    callback
  ) {

    if (
      !origin ||
      allowedOrigins.includes(origin)
    ) {

      callback(null, true);

    } else {

      callback(
        new Error(
          'No permitido por CORS'
        )
      );
    }
  }
}));
mongoose.connect(
  process.env.MONGO_URI
)

.then(() => {

  console.log(
    'MongoDB conectado 🚀'
  );
})

.catch(err => {

  console.error(
    'Error MongoDB:',
    err
  );
});