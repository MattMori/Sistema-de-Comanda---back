const mongoose = require('mongoose');
 
const esquema = new mongoose.Schema(
  { 
    nomeDoCliente: {
      type: String,
      required: 'é obrigatório!',
    },
    dataDeNascimento: {
      type: Date,
      required: 'é obrigatório!',
    },
    cpf: {
      type: String,
      required: 'é obrigatório!',
    },
    telefone: {
      type: String,
      required: 'é obrigatório!',
    },
    
    email: {
      type: String,
      unique: true,
      required: 'é obrigatório!',
      lowercase: true,
      index: true
  },
    contagemDeEntrada: {
      type: Number,
      default: 0  
    }
  },
  {
    timestamps: true
  }
);

esquema.index({ contagemDeEntrada: 1 }); 
const EsquemaCliente = mongoose.models.comment || mongoose.model('cliente', esquema);
module.exports = EsquemaCliente;
