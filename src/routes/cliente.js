const express = require('express');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados.js');
const conectarBancoDados = require('../middlewares/conectarBD.js');
const EsquemaCliente = require('../models/cliente.js');
const EsquemaComanda = require('../models/comanda.js');
const router = express.Router();
const validator = require('validator');



router.post('/criarOuEditar', conectarBancoDados, async (req, res) => {
  try {
    // #swagger.tags = ['Cliente']
    let { nomeDoCliente, dataDeNascimento, cpf, telefone, email } = req.body;

    // Validar e-mail e CPF usando validator
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "Erro",
        statusMensagem: "E-mail inválido."
      });
    }

    if (!validator.isNumeric(cpf) || cpf.length !== 11) {
      return res.status(400).json({
        status: "Erro",
        statusMensagem: "CPF inválido."
      });
    }
    // Criar um novo cliente
    const novoCliente = await EsquemaCliente.create({nomeDoCliente, dataDeNascimento, cpf, telefone, email, contagemDeEntrada: 0 });
    res.status(200).json({
      status: "OK",
      statusMensagem: "cadastro feito com sucesso.",
      resposta: novoCliente
    });
  } catch (error) {
  return tratarErrosEsperados(res, error);
}
});

router.get('/cliente/:cpf', conectarBancoDados, async (req, res) => {
  try {
    // #swagger.tags = ['Cliente']

    const { cpf } = req.params;

    // Encontrar o cliente pelo CPF
    const cliente = await EsquemaCliente.findOne({ cpf: cpf });

    if (!cliente) {
      return res.status(404).json({
        status: 'Erro',
        statusMensagem: 'Cliente não encontrado.'
      });
    }

    res.status(200).json({
      status: 'OK',
      statusMensagem: 'Dados do cliente encontrados com sucesso.',
      resposta: cliente
    });
  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

router.get('/clientePorComanda/:numeroDaComanda', conectarBancoDados, async (req, res) => {
  try {
    // #swagger.tags = ['Cliente']

    const { numeroDaComanda } = req.params;

    // Encontrar a comanda pelo número
    const comanda = await EsquemaComanda.findOne({ numeroDaComanda: numeroDaComanda });

    if (!comanda) {
      return res.status(404).json({
        status: 'Erro',
        statusMensagem: 'Comanda não encontrada.'
      });
    }

    // Encontrar o cliente associado à comanda
    const cliente = await EsquemaCliente.findOne({ cpf: comanda.cliente });

    if (!cliente) {
      return res.status(404).json({
        status: 'Erro',
        statusMensagem: 'Cliente não encontrado para esta comanda.'
      });
    }

    res.status(200).json({
      status: 'OK',
      statusMensagem: 'Dados do cliente encontrados com sucesso.',
      resposta: cliente
    });
  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});


router.get('/obter/clientes', conectarBancoDados, async (req, res) => {
  try {
    // #swagger.tags = ['Cliente']
    // #swagger.description = "Endpoint para obter todos os clientes cadastrados no sistema."
    const respostaBD = await EsquemaCliente.find({});

    res.status(200).json({
      status: "OK",
      statusMensagem: "Clientes listados na respota com sucesso.",
      resposta: respostaBD
    })

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});


router.delete('/deletar/:id', conectarBancoDados, async (req, res) => {
  try {
    // #swagger.tags = ['Cliente']
    const idCliente = req.params.id;

    const checkCliente = await EsquemaCliente.findOne({ _id: idCliente });
    if (!checkCliente) {
      throw new Error("Cliente não encontrado");
    }

    const respostaBD = await EsquemaCliente.deleteOne({ _id: idCliente });
    res.status(200).json({
      status: "OK",
      statusMensagem: "Cliente deletado com sucesso.",
      resposta: respostaBD
    })

  } catch (error) {
    return tratarErrosEsperados(res, error);
  }
});

module.exports = router;
