const express = require('express');
const mysql = require('mysql2');
const app = express();
// Importar variables de otro archivo
const { port,port_db,urlbd,pwd,db } = require('./conf');
const {obtieneDatosRut,  obtieneRegion,  obtieneProvincia,  obtieneCiudad,  obtieneComuna,  actualizaDatosxRut,  deleteDatos} = require('./querys');

// Importar y configurar Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const bodyParser = require('body-parser');

// Configurar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log('Received request:', req.method, req.url, req.body);
  next();
});

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
/*
/**
 * swagger
 * /registros/{rut}:
 *   put:
 *     summary: Actualizar un registro por su rut
 *     description: Actualiza un registro en la base de datos basado en el rut proporcionado.
 *     tags: [Registros]
 *     parameters:
 *       - name: rut
 *         in: path
 *         description: Rut del registro a actualizar
 *         required: true
 *         schema:
 *           type: string
 *       - name: body
 *         in: body
 *         description: Datos del registro a actualizar
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             primer_nombre:
 *               type: string
 *             ape_pat:
 *               type: string
 *             ape_mat:
 *               type: string
 *             telefono:
 *               type: string
 *             direccion:
 *               type: string
 *     responses:
 *       200:
 *         description: Registro actualizado exitosamente
 *       400:
 *         description: Faltan datos en el cuerpo de la solicitud
 *       500:
 *         description: Error al actualizar el registro
 */
/*
app.put('/registros/:rut', (req, res) => {
  const rut = req.params.rut;
  const { primer_nombre, ape_pat, ape_mat, telefono, direccion } = req.body;
  if (!primer_nombre || !ape_pat || !ape_mat || !telefono || !direccion) {
   res.status(400).send('Faltan datos en el cuerpo de la solicitud');
   console.log(req.body)
   return;
  }
  res.set('Content-Type', 'application/json');
  // Consulta SQL para actualizar el registro en la base de datos
  const val = [primer_nombre, ape_pat, ape_mat, telefono, direccion, rut];
  connection.query(actualizaDatosxRut, val, (error, results) => {
    //connection.query(actualizaDatosxRut, primer_nombre, ape_pat, ape_mat, telefono, direccion, rut, (error, results) => {
    if (error) {
      console.error('Error al actualizar el registro:', error);
      res.status(500).send('Error al actualizar el registro');
      console.log(req.body)
    } else {
      res.send('Registro actualizado exitosamente');
      console.log(req.body)
    }
  });
});
*/

/**
 * @swagger
 * /registros/{rut}:
 *   delete:
 *     summary: Eliminar un registro por su rut
 *     description: Elimina un registro de la base de datos basado en el rut proporcionado.
 *     tags: [Registros]
 *     parameters:
 *       - name: rut
 *         in: path
 *         description: Rut del registro a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro eliminado exitosamente
 *       500:
 *         description: Error al eliminar el registro
 */

app.delete('/registros/:rut', (req, res) => {
  const rut = req.params.rut;
  // Ejecutar la consulta SQL
  connection.query(deleteDatos, [rut], (error, results) => {
  //db.query(deleteDatos, [rut], (error, result) => {
    if (error) {
      // Manejar el error de la consulta
      console.error('Error al eliminar el registro:', error);
      res.status(500).send('Error al eliminar el registro');
    } else {
      // Envía la respuesta
      res.send('Registro eliminado exitosamente');
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
  connection.query(obtieneRegion, (error, results) => {
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
  connection.query(obtieneProvincia, [id_region],(error, results) => {
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