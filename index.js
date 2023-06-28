const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const { WebpayPlus } = require('transbank-sdk');
// Importar variables de otro archivo
const { port,port_db,urlbd,pwd,db } = require('./conf');
const {obtieneDatosRut,  obtieneRegion,  obtieneProvincia,  actualizaDatosxRut,  deleteDatos, obtieneDatos, insertDatos, obtieneComuna,validaLogin, obtieneProductosNombre, obtieneProductos, obtieneProductosCod} = require('./querys');
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
    //port: port_db,
    user: 'integracion',
    password: pwd,
    database: db,
    authPlugins: {
      mysql_clear_password: () => () => Buffer.from(password + '\0')
    }
  });

 /*const connection = mysql.createConnection({
    host: 'localhost', // Cambia esto si tu base de datos está en otro servidor
    user: 'integracion',
    password: 'idp2023',
    database: 'integracion'
  });*/

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
 *               correo:
 *                 type: string
 *               region_id:
 *                 type: integer
 *               provincia_id:
 *                 type: integer
 *               comuna_id:
 *                 type: integer
 *               rol_id:
 *                 type: integer
 *               funcionario:
 *                 type: integer              
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
  const correo = req.body.correo;
  const region_id = req.body.region_id;
  const provincia_id = req.body.provincia_id;
  const comuna_id = req.body.comuna_id;
  const rol_id = req.body.rol_id;
  const funcionario = req.body.funcionario;

  console.log (primer_nombre, ape_pat, ape_mat, celular, direccion, correo, region_id, provincia_id, comuna_id, rol_id, funcionario);
  if (!primer_nombre || !ape_pat || !ape_mat || !celular || !direccion || !correo || !region_id || !provincia_id || !comuna_id || !rol_id || !funcionario) {
    res.status(400).send('Faltan datos en el cuerpo de la solicitud');
    return;
  }
  const values = [primer_nombre, ape_pat, ape_mat, celular, direccion, correo, region_id, provincia_id, comuna_id, rol_id, funcionario,rut];
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
 *               correo:
 *                 type: string
 *               region_id:
 *                 type: integer
 *               provincia_id:
 *                 type: integer
 *               comuna_id:
 *                 type: integer
 *               rol_id:
 *                 type: integer
 *               funcionario:
 *                 type: integer
 *                
 *             required:
 *               - rut
 *               - dv_rut
 *               - primer_nombre
 *               - ape_pat
 *               - fecha_nac
 *               - sexo
 *               - celular
 *               - direccion
 *               - correo
 *               - region_id
 *               - provincia_id
 *               - comuna_id
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
    correo,
    region_id,
    provincia_id,
    comuna_id,
    rol_id,
    funcionario
  } = req.body;

  // Validar que todos los campos requeridos estén presentes
  if (!rut || !dv_rut || !primer_nombre || !ape_pat || !fecha_nac || !sexo || !celular || !direccion || !correo || !region_id || !provincia_id || !comuna_id || !rol_id || !funcionario) {
  //if (!rut || !dv_rut || !primer_nombre || !ape_pat || !fecha_nac || !sexo || !celular || !direccion || !correo) {
    res.status(400).send('Faltan datos en el cuerpo de la solicitud');
    return;
  }

  // Consulta SQL para insertar el registro en la base de datos
  const values = [rut, dv_rut, primer_nombre, segundo_nombre, ape_pat, ape_mat, fecha_nac, sexo, celular, direccion, correo, region_id, provincia_id, comuna_id, rol_id, funcionario];

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
 * /provincias/{region_id}:
 *   get:
 *     summary: obtener provincias por region
 *     description: obtener provincias por region
 *     tags: [Regiones]
 *     parameters:
 *       - in: path
 *         name: region_id
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

app.get('/provincias/:region_id', (req, res) => {
  const region_id = req.params.region_id;
  connection.query(obtieneProvincia, [region_id],(error, results) => {
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
 * /comunas/{provincia_id}:
 *   get:
 *     summary: obtener comunas por provincia
 *     description: obtener comunas por provincia
 *     tags: [Regiones]
 *     parameters:
 *       - in: path
 *         name: provincia_id
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

app.get('/comunas/:provincia_id', (req, res) => {
  const provincia_id = req.params.provincia_id;
  connection.query(obtieneComuna, [provincia_id],(error, results) => {
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
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               clave:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario autenticado con éxito
 *       401:
 *         description: Credenciales inválidas
 */

app.post('/login', (req, res) => {
  const { correo, clave } = req.body;

  // Realiza la consulta en la base de datos para validar las credenciales
  connection.query(validaLogin, [correo, clave], (err, results) => {
    if (err) {
      console.error('Error al realizar la consulta:', err);
      res.status(500).json({ message: 'Error al autenticar al usuario' });
      return;
    }

    if (results.length > 0) {
      const usuario = results[0]; // Obtiene el primer resultado de la consulta

      res.status(200).json({
        message: 'Usuario autenticado con éxito',
        correo: usuario.CORREO,
        rolId: usuario.ROL_ID,
        rolDescripcion: usuario.ROL_DESCRIPCION,
        abreviatura: usuario.ABREVIATURA
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  });
});

/**
 * @swagger
 * /productos/{producto}:
 *   get:
 *     summary: obtener detalle de producto
 *     description: obtener detalle de producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: producto
 *         schema:
 *           type: string
 *         required: true
 *         description: obtener producto
 *     responses:
 *       '200':
 *         description: OK
 *       '500':
 *         description: Error en el servidor
 */

app.get('/productos/:producto', (req, res) => {
  let producto = req.params.producto;
  producto = decodeURI(producto); // Decodificar la URL
  producto = normalizeText(producto.toLowerCase());
  const searchTerm = `%${producto}%`;

  connection.query(obtieneProductosNombre, [searchTerm], (error, results) => {
    if (error) {
      console.error('Error al obtener los registros: ', error);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});

function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}


/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener productos
 *     description: Obtener la lista de productos
 *     tags: [Productos]
 *     responses:
 *       '200':
 *         description: OK
 *       '500':
 *         description: Error en el servidor
 */

app.get('/productos/', (req, res) => {
  connection.query(obtieneProductos, (error, results) => {
    if (error) {
      console.error('Error al obtener los registros: ', error);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});

// Función para normalizar el texto (eliminar tildes y caracteres especiales)

/**
 * @swagger
 * /prod/{id}:
 *   get:
 *     summary: obtener productos por id
 *     description: obtener productos por id
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: obtener producto
 *     responses:
 *       '200':
 *         description: OK
 *       '500':
 *         description: Error en el servidor
 */

app.get('/prod/:id', (req, res) => {
  const id = req.params.id;
  connection.query(obtieneProductosCod, [id],(error, results) => {
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
 * /api/transbank/transaction:
 *   post:
 *     summary: Crear una transacción en Transbank
 *     tags: [Transbank]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buyOrder:
 *                 type: string
 *               sessionId:
 *                 type: string
 *               amount:
 *                 type: number
 *               returnUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transacción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionId:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

app.post('/api/transbank/transaction', async (req, res) => {
  const { buyOrder, sessionId, amount, returnUrl } = req.body;

  try {
    const createResponse = await (new WebpayPlus.Transaction()).create(
      buyOrder, 
      sessionId, 
      amount, 
      returnUrl
    );

    // Devolver la respuesta de la llamada a la API de Transbank
    res.json(createResponse);
  } catch (error) {
    // Manejar cualquier error y devolver una respuesta de error adecuada
    res.status(500).json({ error: 'Error al crear la transacción' });
  }
});


/**
 * @swagger
 * /api/transbank/confirmacion:
 *   post:
 *     summary: confirmar una transacción en Transbank
 *     tags: [Transbank]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token_ws:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transacción creada exitosamente
 *       400:
 *         description: Parámetros inválidos
 */

app.post('/api/transbank/confirmacion', async (req, res) => {
  //const { ws_token } = req.body;

  let token = req.body.token_ws;

  try {
    const commitResponse = await (new WebpayPlus.Transaction()).commit(token);
    res.json(commitResponse);
  } catch (error) {
    // Manejar cualquier error y devolver una respuesta de error adecuada
    res.status(500).json({ error: 'Error al crear la transacción' });
  }
});

app.listen(port, () => {
  console.log(`Servidor API escuchando en el puerto ${port}`);
});
