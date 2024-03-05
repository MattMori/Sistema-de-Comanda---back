const mongoose = require('mongoose');
const esquema = new mongoose.Schema(
    {
        nome: String,
        img: String,
        resumo: String,
        texto: String,
        integrantes: String,
        urlPlaylist: String,
        instagram: String,
        facebook: String,
        wikipedia: String,
        spotify: String,
    },
    {
        timestamps: true
    }
);

const EsquemaBandas = mongoose.models.bandas || mongoose.model('bandas', esquema);
module.exports = EsquemaBandas;