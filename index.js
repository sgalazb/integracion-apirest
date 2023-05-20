const express = require('express');
const mysql = require('mysql2');
const app = express();
// Importar variables de otro archivo
const { port,port_db,urlbd,pwd,db } = require('./conf');
const {obtieneDatosRut} = require('./querys');

// Importar y configurar Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const connection = mysql.createConnection({
    host: urlbd, // Cambia esto si tu base de datos está en otro servidor
    port: port_db,
    user: 'root',
    password: pwd,
    database: db,
    authPlugins: {
      mysql_clear_password: () => () => Buffer.from(password + '\0')
    }
  });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  
connection.connect((error) => {
    if (error) {
      console.error('Error al conectar a la base de datos: ', error);
    } else {
      console.log('Conexión exitosa a la base de datos');
    }
  });

  const options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Documentación de mi API REST',
      },
    },
    apis: ['index.js'], // Reemplaza 'index.js' por el nombre de tu archivo principal de la API o los archivos donde tengas las anotaciones Swagger
  };

const specs = swaggerJsDoc(options);  


app.use('/apis', swaggerUi.serve, swaggerUi.setup(specs));
/**
 * @swagger
 * tags:
 *   name: Registros
 *   description: API para operaciones de registros
 */
/**
 * @swagger
 * /registros/{rut}:
 *   get:
 *     summary: Obtener registros por RUT
 *     description: Obtener registros filtrados por el RUT proporcionado
 *     operationId: obtenerRegistrosPorRUT
 *     tags: [Registros]
 *     parameters:
 *       - in: path
 *         name: rut
 *         schema:
 *           type: string
 *         required: true
 *         description: RUT para filtrar los registros
 *     responses:
 *       '200':
 *         description: OK
 *       '500':
 *         description: Error en el servidor
 */


//datos personas

app.get('/registros/:rut', (req, res) => {
  const rut = req.params.rut;
  connection.query(obtieneDatosRut, [rut], (error, results) => {
    if (error) {
      console.error('Error al obtener los registros: ', error);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /regiones:
 *   get:
 *     summary: Obtener regiones
 *     description: Obtener la lista de regiones
 *     tags: [Regiones]
 *     responses:
 *       '200':
 *         description: OK
 *       '500':
 *         description: Error en el servidor
 */

//regiones
app.get('/regiones', (req, res) => {
  connection.query('SELECT * FROM regiones', (error, results) => {
    if (error) {
      console.error('Error al obtener los registros: ', error);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /provincias/{id_region}:
 *   get:
 *     summary: obtener provincias por region
 *     description: obtener provincias por region
 *     tags: [Regiones]
 *     parameters:
 *       - in: path
 *         name: id_region
 *         schema:
 *           type: integer
 *         required: true
 *         description: obtener provincias
 *     responses:
 *       '200':
 *         description: OK
 *       '500':
 *         description: Error en el servidor
 */

app.get('/provincias/:id_region', (req, res) => {
  const id_region = req.params.id_region;
  connection.query('SELECT * FROM provincias WHERE id_region = ?', [id_region],(error, results) => {
    if (error) {
      console.error('Error al obtener los registros: ', error);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});


app.listen(port, () => {
  console.log(`Servidor API escuchando en el puerto ${port}`);
});