
function routes(app) {
     app.use('/noticias', require('./routes/noticias.js'));
     app.use('/bandas', require('./routes/bandas.js'));
    return;
}

module.exports = routes;