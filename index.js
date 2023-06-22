const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
// Importar variables de otro archivo
const { port,port_db,urlbd,pwd,db } = require('./conf');
const {obtieneDatosRut,  obtieneRegion,  obtieneProvincia,  actualizaDatosxRut,  deleteDatos, obtieneDatos, insertDatos} = require('./querys');
// Importar y configurar Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
// Configurar body-parser
//app.use(bodyParser.urlencoded({ extended: true }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

  app.use((req, res, next) => {
    console.log('Received request:', req.method, req.url, req.body);
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
 * /registros:
 *   get:
 *     summary: Obtener registros de Personas
 *     description: Obtener registros
 *     operationId: obtenerRegistros
 *     tags: [Registros]
 *     responses:
 *       '200':
 *         description: OK
 *       '500':
 *         description: Error en el servidor
 */


//datos personas
app.get('/registros', (req, res) => {
  connection.query(obtieneDatos, (error, results) => {
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
 * /registros/{rut}:
 *   post:
 *     summary: Actualizar un registro
 *     tags: [Registros]
 *     parameters:
 *       - name: rut
 *         in: path
 *         required: true
 *         description: RUT del registro a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               primer_nombre:
 *                 type: string
 *               ape_pat:
 *                 type: string
 *               ape_mat:
 *                 type: string
 *               celular:
 *                 type: integer
 *               direccion:
 *                 type: string
 *             required:
 *               - primer_nombre
 *               - ape_pat
 *               - ape_mat
 *               - celular
 *               - direccion
 *     responses:
 *       200:
 *         description: Registro actualizado exitosamente
 *       400:
 *         description: Faltan datos en el cuerpo de la solicitud
 *       500:
 *         description: Error al actualizar el registro
 */
app.use(express.json());

app.post('/registros/:rut', (req, res) => {
  const rut = req.params.rut;
  const primer_nombre = req.body.primer_nombre;
  const ape_pat = req.body.ape_pat;
  const ape_mat = req.body.ape_mat;
  const celular = req.body.celular;
  const direccion = req.body.direccion;
  console.log (primer_nombre, ape_pat, ape_mat, celular, direccion);
  if (!primer_nombre || !ape_pat || !ape_mat || !celular || !direccion) {
    res.status(400).send('Faltan datos en el cuerpo de la solicitud');
    return;
  }
  const values = [primer_nombre, ape_pat, ape_mat, celular, direccion, rut];
  connection.query(actualizaDatosxRut, values, (error) => {
    if (error) {
      console.error('Error al actualizar el registro:', error);
      res.status(500).send('Error al actualizar el registro');
    } else {
      res.send('Registro actualizado exitosamente');
    }
  });
});

/**
 * @swagger
 * /registros:
 *   post:
 *     summary: Insertar un registro
 *     tags: [Registros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rut:
 *                 type: integer
 *               dv_rut:
 *                 type: string
 *               primer_nombre:
 *                 type: string
 *               segundo_nombre:
 *                 type: string
 *               ape_pat:
 *                 type: string
 *               ape_mat:
 *                 type: string
 *               fecha_nac:
 *                 type: string
 *                 format: date
 *               sexo:
 *                 type: string
 *               celular:
 *                 type: integer
 *               direccion:
 *                 type: string
 *               cod_region:
 *                 type: integer
 *               cod_ciudad:
 *                 type: integer
 *               cod_provincia:
 *                 type: integer
 *               cod_comuna:
 *                 type: integer
 *               correo:
 *                 type: string
 *             required:
 *               - rut
 *               - dv_rut
 *               - primer_nombre
 *               - ape_pat
 *               - fecha_nac
 *               - sexo
 *               - celular
 *               - direccion
 *               - cod_region
 *               - cod_ciudad
 *               - cod_provincia
 *               - cod_comuna
 *               - correo
 *     responses:
 *       200:
 *         description: Registro insertado exitosamente
 *       400:
 *         description: Faltan datos en el cuerpo de la solicitud
 *       500:
 *         description: Error al insertar el registro
 */

app.post('/registros', (req, res) => {
  const {
    rut,
    dv_rut,
    primer_nombre,
    segundo_nombre,
    ape_pat,
    ape_mat,
    fecha_nac,
    sexo,
    celular,
    direccion,
    cod_region,
    cod_ciudad,
    cod_provincia,
    cod_comuna,
    correo
  } = req.body;

  // Validar que todos los campos requeridos estén presentes
  if (!rut || !dv_rut || !primer_nombre || !ape_pat || !fecha_nac || !sexo || !celular || !direccion || !cod_region || !cod_ciudad || !cod_provincia || !cod_comuna || !correo) {
  //if (!rut || !dv_rut || !primer_nombre || !ape_pat || !fecha_nac || !sexo || !celular || !direccion || !correo) {
    res.status(400).send('Faltan datos en el cuerpo de la solicitud');
    return;
  }

  // Consulta SQL para insertar el registro en la base de datos
  const values = [rut, dv_rut, primer_nombre, segundo_nombre, ape_pat, ape_mat, fecha_nac, sexo, celular, direccion, cod_region, cod_ciudad, cod_provincia, cod_comuna, correo];

  connection.query(insertDatos, values, (error, results) => {
    if (error) {
      console.error('Error al insertar el registro:', error);
      res.status(500).send('Error al insertar el registro');
    } else {
      res.send('Registro insertado exitosamente');
    }
  });
});



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
  connection.query(deleteDatos, [rut], (error) => {
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