const mongoose = require('mongoose');
const esquema = new mongoose.Schema(
    {
        nomeDaBebida: {
            type: String,
            required: 'é obrigatório!',
        },
        Ingredientes: {
            type: String,
            required: 'é obrigatório!',
        },
        
        valorDaBebida: {
            type: Number,
            required: 'é obrigatório!',
        },
        codigoDaBebida: {
            type: Number,
            required: 'é obrigatório!',
            select: false,
        },
    },
    {
        timestamps: true
    }
);

const EsquemaBebida = mongoose.models.Usuario || mongoose.model('Bebida', esquema);
module.exports = EsquemaBebida;