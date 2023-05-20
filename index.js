const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 4000; // Puedes usar cualquier otro puerto de tu elección
//idp2023*
const connection = mysql.createConnection({
    host: 'localhost', // Cambia esto si tu base de datos está en otro servidor
    user: 'integracion',
    password: 'idp2023*',
    database: 'integracion'
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

//get  

app.get('/registros/:rut', (req, res) => {
  const rut = req.params.rut;
  connection.query('SELECT * FROM persona WHERE rut = ?', [rut], (error, results) => {
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