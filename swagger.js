const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentación de mi API REST',
    },
  },
  apis: ['index.js'], // Reemplaza 'index.js' por el nombre de tu archivo principal de la API
};

const specs = swaggerJsDoc(options);