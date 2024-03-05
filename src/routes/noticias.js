const express = require('express');
const conectarBancoDados = require('../middlewares/conectarBD.js');
const router = express.Router();
const noticiaModel = require('../models/noticias.js');

router.post('/criar', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Noticias']
        // #swagger.description = 'Endpoint para criar uma notícia.'
        const novaNoticia = await noticiaModel.create({
            titulo: req.body.titulo,
            img: req.body.img,
            texto: req.body.texto,
        })
        return res.status(201).json(novaNoticia);
    } catch (error) {
        return tratarErrosEsperados(res, error);
    }
});

router.get('/noticias', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Noticias']
        // #swagger.description = 'Endpoint para listar todas as notícias.'
        const noticias = await noticiaModel.find({})
        return res.status(200).json(noticias);
    }
    catch (error) {
        return tratarErrosEsperados(res, error);
    }
});

router.get('/noticia/:id', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Noticias']
        // #swagger.description = 'Endpoint para listar uma notícia.'
        const noticia = await noticiaModel.findById(req.params.id)
        return res.status(200).json(noticia);
    }
    catch (error) {
        return tratarErrosEsperados(res, error);
    }
});


router.delete('/deletar/:id', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Noticias']
        // #swagger.description = 'Endpoint para deletar uma notícia.'

        const noticia = await noticiaModel.findByIdAndDelete(req.params.id)
        return res.status(200).json(noticia);
    }
    catch (error) {
        return tratarErrosEsperados(res, error);
    }
});

router.put('/editar/:id', conectarBancoDados, async (req, res) => {
    try {
        // #swagger.tags = ['Noticias']
        // #swagger.description = 'Endpoint para editar uma notícia.'

        let idNoticia = req.params.id;
        let { titulo, img, texto } = req.body;
        const noticia = await noticiaModel.findByIdAndUpdate(idNoticia, {
            titulo,
            img,
            texto,
        }, { new: true });
        return res.status(200).json(noticia);
    }
    catch (error) {
        return tratarErrosEsperados(res, error);
    }
}
);


module.exports = router;
