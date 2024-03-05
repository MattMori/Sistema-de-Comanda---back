const express = require('express');
const tratarErrosEsperados = require('../functions/tratarErrosEsperados.js');
const conectarBancoDados = require('../middlewares/conectarBD.js');
const router = express.Router();
const bandaModel = require('../models/bandas.js');

router.post('/criar', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Bandas']
        // #swagger.description = 'Endpoint para criar uma Banda.'
        const novaBanda = await bandaModel.create({
            nome: req.body.nome,
            img: req.body.img,
            resumo: req.body.resumo,
            texto: req.body.texto,
            integrantes: req.body.integrantes,
            urlPlaylist: req.body.urlPlaylist,
            instagram: req.body.instagram,
            facebook: req.body.facebook,
            wikipedia: req.body.wikipedia,
            spotify: req.body.spotify,
        })
        return res.status(201).json(novaBanda);
    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});

router.get('/bandas', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Bandas']
        // #swagger.description = 'Endpoint para listar todas as Bandas.'
        const Bandas = await bandaModel.find({})
        return res.status(200).json(Bandas);
    }
    catch (error) {
        return tratarErrosEsperados(res, error);
    }
});

router.get('/banda/:id', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Bandas']
        // #swagger.description = 'Endpoint para listar uma banda.'
        const banda = await bandaModel.findById(req.params.id)
        return res.status(200).json(banda);
    }
    catch (error) {
        return tratarErrosEsperados(res, error);
    }
});
router.delete('/deletar/:id', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Bandas']
        // #swagger.description = 'Endpoint para deletar uma Banda.'

        const Banda = await bandaModel.findByIdAndDelete(req.params.id)
        return res.status(200).json(Banda);
    }
    catch (error) {
        return tratarErrosEsperados(res, error);
    }
});

router.put('/editar/:id', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Bandas']
        // #swagger.description = 'Endpoint para editar uma Banda.'

        let idBanda = req.params.id;
        let { nome, img, resumo, texto } = req.body;
        const Banda = await bandaModel.findByIdAndUpdate(idBanda, {
            nome,
            img,
            texto,
            resumo,
        }, { new: true });
        return res.status(200).json(Banda);
    }
    catch (error) {
        return tratarErrosEsperados(res, error);
    }
}
);

module.exports = router;
