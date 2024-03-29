require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { dbConnection } = require('./database/config')

//Crear el servidor de express
const app = express()

//Configurar CORS
app.use(cors())

//Carpeta publica
app.use(express.static('public'))

// Lectura y parseo del body
app.use(express.json())

// Base de datos
dbConnection()

// //Rutas

app.use('/api/usuarios',require('./routes/usuario'))
app.use('/api/hospitales',require('./routes/hospital'))
app.use('/api/medicos',require('./routes/medico'))
app.use('/api/todo',require('./routes/busqueda'))
app.use('/api/upload',require('./routes/upload'))
app.use('/api/login',require('./routes/auth'))



app.listen(process.env.PORT,()=>{
    console.log("Servidor corriendo en puerto "+process.env.PORT);
})

// root
// l5iR7TSagytvXGvV