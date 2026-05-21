const express =
require('express');

const router =
express.Router();

const {

  obtenerProyecciones,

  crearProyeccion,

  actualizarProyeccion,

  eliminarProyeccion

} = require(
  '../controllers/proyeccion.controller'
);

router.get(
  '/',
  obtenerProyecciones
);

router.post(
  '/',
  crearProyeccion
);

router.put(
  '/:id',
  actualizarProyeccion
);

router.delete(
  '/:id',
  eliminarProyeccion
);

module.exports =
router;