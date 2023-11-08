const express = require('express');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados.js');
const conectarBancoDados = require('../middlewares/conectarBD.js');
const EsquemaBebida = require('../models/bebida.js');
const router = express.Router();

router.post('/criarBebida', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Bebida']

        let { nomeDaBebida, valorDaBebida, codigoDaBebida, Ingredientes } = req.body;
        const bebidaSalva = await EsquemaBebida.create({ nomeDaBebida, valorDaBebida, codigoDaBebida, Ingredientes });

        res.status(201).json({
            status: 'OK',
            statusMensagem: 'Bebida criada com sucesso.',
            resposta: bebidaSalva
        });
    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});

router.get('/listarBebidas', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Bebida']

        const bebidas = await EsquemaBebida.find();

        res.status(200).json({
            status: 'OK',
            statusMensagem: 'Lista de bebidas recuperada com sucesso.',
            resposta: bebidas
        });
    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});

router.get('/bebida/:codigo', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Bebida']

        const { codigo } = req.params;

        // Encontrar a bebida pelo código
        const bebida = await EsquemaBebida.findOne({ codigoDaBebida: codigo });

        if (!bebida) {
            return res.status(404).json({
                status: 'Erro',
                statusMensagem: 'Bebida não encontrada.'
            });
        }

        res.status(200).json({
            status: 'OK',
            statusMensagem: 'Dados da bebida encontrados com sucesso.',
            resposta: bebida
        });
    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});


router.delete('/deletarBebida/:codigo', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Bebida']

        const codigoDaBebida = req.params.codigo;
        const bebidaDeletada = await EsquemaBebida.findOneAndDelete({ codigoDaBebida });

        if (bebidaDeletada) {
            res.status(200).json({
                status: 'OK',
                statusMensagem: 'Bebida deletada com sucesso.',
                resposta: bebidaDeletada
            });
        } else {
            res.status(404).json({
                status: 'Erro',
                statusMensagem: 'Bebida não encontrada com o código fornecido.'
            });
        }
    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});

module.exports = router;
