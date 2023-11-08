const mongooseToSwagger = require('mongoose-to-swagger');
const EsquemaCliente = require('../src/models/cliente.js');
const EsquemaBebida = require('../src/models/bebida.js');
const EsquemaComanda = require('../src/models/comanda.js');
const swaggerAutogen = require('swagger-autogen')({
    openapi: '3.0.0',
    language: 'pt-BR',
});

let outputFile = './swagger_output.json';
let endpointsFiles = ['../index.js', '../src/routes.js'];


if (String(process.env.OS).toLocaleLowerCase().includes("windows")) {
    outputFile = './swagger/swagger_output.json';
    endpointsFiles = ['./index.js', './src/routes.js'];
}


let doc = {
    info: {
        version: "1.0.0",
        title: "API do sistema de comanda",
        description: "Documentação da API do sistema de comanda."
    },
    servers: [
        {
            url: "http://localhost:3500/",
            description: "Servidor localhost."
        },
        {
            url: "",
            description: "Servidor de produção."
        }
        
    ],
    consumes: ['application/json'],
    produces: ['application/json'],
    components: {
        schemas: {
            Cliente: mongooseToSwagger(EsquemaCliente),
            Bebida: mongooseToSwagger(EsquemaBebida),
            Comanda: mongooseToSwagger(EsquemaComanda)
        }
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log("Documentação do Swagger gerada encontra-se no arquivo em: " + outputFile);
    if (process.env.NODE_ENV !== 'production') {
        require("../index.js");
    }
})
