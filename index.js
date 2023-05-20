const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000; // Puedes usar cualquier otro puerto de tu elección
//idp2023*
const connection = mysql.createConnection({
    host: 'localhost', // Cambia esto si tu base de datos está en otro servidor
    user: 'integracion',
    password: 'idp2023',
    database: 'integracion'
  });
  
connection.connect((error) => {
    if (error) {
      console.error('Error al conectar a la base de datos: ', error);
    } else {
      console.log('Conexión exitosa a la base de datos');
    }
  });

//get  

app.get('/registros', (req, res) => {
    connection.query('SELECT * FROM tabla', (error, results) => {
      if (error) {
        console.error('Error al obtener los registros: ', error);
        res.status(500).send('Error en el servidor');
      } else {
        res.json(results);
      }
    });
});