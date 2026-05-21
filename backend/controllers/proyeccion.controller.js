const Proyeccion =
require(
  '../models/proyeccion.model'
);

const obtenerProyecciones =
async (req, res) => {

  try {

    const proyecciones =
      await Proyeccion.find();

    res.json(
      proyecciones
    );

  } catch (error) {

    res.status(500).json({

      mensaje:
      'Error al obtener proyecciones',

      error
    });
  }
};

const crearProyeccion =
async (req, res) => {

  try {

    const {

      uidFirebase,
      emailUsuario,
      nombre,
      ahorroMensual,
      meses,
      meta,
      gastosFijos,
      gastosVariables

    } = req.body;

    const ahorroNeto =

      ahorroMensual
      - gastosFijos
      - gastosVariables;

    const ahorroTotal =
      ahorroNeto * meses;

    const diferenciaMeta =
      ahorroTotal - meta;

    const cumpleMeta =
      ahorroTotal >= meta;

    const nuevaProyeccion =
    new Proyeccion({

      uidFirebase,
      emailUsuario,
      nombre,
      ahorroMensual,
      meses,
      meta,
      gastosFijos,
      gastosVariables,

      ahorroTotal,
      diferenciaMeta,
      cumpleMeta
    });

    const guardado =
      await nuevaProyeccion.save();

    res.status(201).json({

      mensaje:
      'Proyección guardada correctamente',

      data: guardado
    });

  } catch (error) {

    res.status(500).json({

      mensaje:
      'Error al crear proyección',

      error
    });
  }
};

const actualizarProyeccion =
async (req, res) => {

  try {

    const { id } =
      req.params;

    const {

      nombre,
      ahorroMensual,
      meses,
      meta,
      gastosFijos,
      gastosVariables

    } = req.body;

    const ahorroNeto =

      ahorroMensual
      - gastosFijos
      - gastosVariables;

    const ahorroTotal =
      ahorroNeto * meses;

    const diferenciaMeta =
      ahorroTotal - meta;

    const cumpleMeta =
      ahorroTotal >= meta;

    const actualizada =
      await Proyeccion.findByIdAndUpdate(

        id,

        {

          nombre,
          ahorroMensual,
          meses,
          meta,
          gastosFijos,
          gastosVariables,

          ahorroTotal,
          diferenciaMeta,
          cumpleMeta
        },

        {
          new: true
        }
      );

    res.json({

      mensaje:
      'Proyección actualizada',

      data: actualizada
    });

  } catch (error) {

    res.status(500).json({

      mensaje:
      'Error al actualizar',

      error
    });
  }
};

const eliminarProyeccion =
async (req, res) => {

  try {

    const { id } =
      req.params;

    await Proyeccion
    .findByIdAndDelete(id);

    res.json({

      mensaje:
      'Proyección eliminada'
    });

  } catch (error) {

    res.status(500).json({

      mensaje:
      'Error al eliminar',

      error
    });
  }
};

module.exports = {

  obtenerProyecciones,

  crearProyeccion,

  actualizarProyeccion,

  eliminarProyeccion
};