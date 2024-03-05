const mongoose = require('mongoose');

const esquema = new mongoose.Schema(
  {
    titulo: String,
    img: String,
    texto: String,
  },
  {
    timestamps: true
  }
);

const EsquemaNoticias = mongoose.models.noticias || mongoose.model('noticias', esquema);
module.exports = EsquemaNoticias;
