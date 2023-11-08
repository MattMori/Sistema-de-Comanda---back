const express = require('express');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados.js');
const conectarBancoDados = require('../middlewares/conectarBD.js');
const EsquemaComanda = require('../models/comanda.js');
const EsquemaBebida = require('../models/bebida.js');
const EsquemaCliente = require('../models/cliente.js');

const router = express.Router();

router.post('/criarComanda', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Comanda']

        const { cpf, numeroDaComanda } = req.body;
        console.log('CPF recebido na requisição:', cpf);

        // Verificar se já existe uma comanda associada a esse cliente
        const comandaExistente = await EsquemaComanda.findOne({ cliente: cpf });

        if (comandaExistente) {
            return res.status(400).json({
                status: 'Erro',
                statusMensagem: 'Já existe uma comanda associada a esse cliente.'
            });
        }

        // Verificar se o cliente existe
        const cliente = await EsquemaCliente.findOne({ cpf: cpf });

        if (!cliente) {
            return res.status(400).json({
                status: 'Erro',
                statusMensagem: 'Cliente não encontrado com o CPF fornecido.'
            });
        }

        // Criar a nova comanda e associar ao cliente
        const novaComanda = await EsquemaComanda.create({ cliente: cpf, numeroDaComanda });

        // Aumentar a contagem de entrada do cliente
        const clienteAtualizado = await aumentarContagemDeEntradaCliente(cpf);

        res.status(201).json({
            status: 'OK',
            statusMensagem: 'Comanda criada, número da comanda associado ao cliente e contagem de entrada atualizada com sucesso.',
            resposta: novaComanda,
            cliente: clienteAtualizado
        });
    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});



router.post('/comanda/:numeroDaComanda/adicionarBebida', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Comanda']

        const { codigoDaBebida } = req.body;
        const { numeroDaComanda } = req.params;

        // Verificar se a comanda existe com o código fornecido
        const comanda = await EsquemaComanda.findOne({ numeroDaComanda: numeroDaComanda });
        if (!comanda) {
            return res.status(404).json({
                status: 'Erro',
                statusMensagem: 'Comanda não encontrada.'
            });
        }

        // Verificar se a bebida com o código fornecido existe
        const bebida = await EsquemaBebida.findOne({ codigoDaBebida: codigoDaBebida });
        if (!bebida) {
            return res.status(404).json({
                status: 'Erro',
                statusMensagem: 'Bebida não encontrada.'
            });
        }

        // Adicionar a bebida à lista de bebidas da comanda
        comanda.bebidas.push(bebida._id);
        await comanda.save();

        res.status(200).json({
            status: 'OK',
            statusMensagem: 'Bebida adicionada à comanda com sucesso.',
            resposta: comanda
        });
    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});

router.get('/comanda/:numeroDaComanda/listarBebidas', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Comanda']

        const { numeroDaComanda } = req.params;

        // Verificar se a comanda existe com o código fornecido
        const comanda = await EsquemaComanda.findOne({ numeroDaComanda: numeroDaComanda }).populate('bebidas');

        if (!comanda) {
            return res.status(404).json({
                status: 'Erro',
                statusMensagem: 'Comanda não encontrada.'
            });
        }

        res.status(200).json({
            status: 'OK',
            statusMensagem: 'Lista de bebidas na comanda recuperada com sucesso.',
            resposta: comanda.bebidas,
            respotaCliente: comanda.cliente
        });
    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});

router.get('/comanda/:numeroDaComanda/total', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Comanda']

        const { numeroDaComanda } = req.params;

        // Encontrar a comanda com base no número fornecido
        const comanda = await EsquemaComanda.findOne({ numeroDaComanda: numeroDaComanda }).populate('bebidas');

        if (!comanda) {
            return res.status(404).json({
                status: 'Erro',
                statusMensagem: 'Comanda não encontrada.'
            });
        }

        // Calcular o valor total da comanda somando os preços das bebidas
        const valorTotal = comanda.bebidas.reduce((total, bebida) => total + bebida.valorDaBebida, 0);
        const valorTotalFormatado = valorTotal.toFixed(2);
        res.status(200).json({
            status: 'OK',
            statusMensagem: 'Valor total da comanda calculado com sucesso.',
            resposta: { valorTotal: valorTotalFormatado }
        });
    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});

router.delete('/comanda/:numeroDaComanda/removerBebida/:idDaBebida', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Comanda']

        const { numeroDaComanda, idDaBebida } = req.params;

        // Verificar se a comanda existe com o código fornecido
        const comanda = await EsquemaComanda.findOne({ numeroDaComanda: numeroDaComanda });

        if (!comanda) {
            return res.status(404).json({
                status: 'Erro',
                statusMensagem: 'Comanda não encontrada.'
            });
        }

        // Encontrar a posição da bebida na lista de bebidas da comanda pelo ID
        const index = comanda.bebidas.findIndex(bebida => bebida._id.toString() === idDaBebida);

        if (index === -1) {
            return res.status(404).json({
                status: 'Erro',
                statusMensagem: 'Bebida não encontrada na comanda.'
            });
        }

        // Remover a bebida da lista de bebidas da comanda localmente
        comanda.bebidas.splice(index, 1);

        // Atualizar a comanda no banco de dados
        const resultado = await EsquemaComanda.findByIdAndUpdate(comanda._id, { bebidas: comanda.bebidas }, { new: true });

        res.status(200).json({
            status: 'OK',
            statusMensagem: 'Bebida removida com sucesso da comanda.',
            resposta: resultado
        });

    } catch (error) {
        return tratarErrosEsperados(res, error);
    }


});


router.delete('/cliente/:cpf/removerNumeroComanda', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Comanda']

        const { cpf } = req.params;

        // Encontrar o cliente pelo CPF
        const cliente = await EsquemaCliente.findOne({ cpf: cpf });
        if (!cliente) {
            return res.status(404).json({
                status: 'Erro',
                statusMensagem: 'Cliente não encontrado.'
            });
        }

        // Remover o número da comanda do cliente
        cliente.numeroDaComanda = '';
        await cliente.save();

        // Encontrar a comanda associada a esse cliente
        const comanda = await EsquemaComanda.findOne({ cliente: cliente.cpf });

        // Verificar se a comanda existe antes de excluí-la
        if (comanda) {
            await EsquemaComanda.findOneAndDelete({ cliente: cliente.cpf });
        }

        res.status(200).json({
            status: 'OK',
            statusMensagem: 'Número da comanda removido do cliente e comanda excluída com sucesso.'
        });
    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});


async function aumentarContagemDeEntradaCliente(cpf) {
    try {
        const clienteExistente = await EsquemaCliente.findOne({ cpf: cpf });

        if (clienteExistente) {
            clienteExistente.contagemDeEntrada = clienteExistente.contagemDeEntrada + 1;
            await clienteExistente.save();

            return clienteExistente;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}


module.exports = router;