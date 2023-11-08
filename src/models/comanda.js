const mongoose = require('mongoose');

const esquemaComanda = new mongoose.Schema({
  cliente: {
    type: String,
  },
  numeroDaComanda: {
    type: String,
    required: true
  },
  bebidas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bebida'
  }],
  status: {
    type: String,
    enum: ['ativa', 'paga'],
    default: 'ativa'
  }
});


const Comanda = mongoose.model('Comanda', esquemaComanda);

module.exports = Comanda;
