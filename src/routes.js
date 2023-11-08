
function routes(app) {
     app.use('/cliente', require('./routes/cliente.js'));
     app.use('/bebida', require('./routes/bebida.js'));
     app.use('/comanda', require('./routes/comanda.js'));
    return;
}

module.exports = routes;