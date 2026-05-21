const mongoose = require('mongoose');

const proyeccionSchema = new mongoose.Schema({
    uidFirebase: {
        type: String,
        required: true
    },

    emailUsuario: {
        type: String,
        required: true
    },

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    ahorroMensual: {
        type: Number,
        required: true,
        min: 0
    },

    meses: {
        type: Number,
        required: true,
        min: 1
    },

    meta: {
        type: Number,
        required: true,
        min: 0
    },

    gastosFijos: {
        type: Number,
        required: true,
        min: 0
    },

    gastosVariables: {
        type: Number,
        required: true,
        min: 0
    },

    ahorroTotal: {
        type: Number,
        required: true
    },

    diferenciaMeta: {
        type: Number,
        required: true
    },

    cumpleMeta: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    'Proyeccion',
    proyeccionSchema
);