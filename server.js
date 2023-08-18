const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
app.use(cookieParser());




//Importar conexion mongodb
const archivoBD = require('./conexion')


app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  next();
});


const cors = require('cors');
app.use(
  cors({
    origin: 'http://localhost:19006', // Cambia esto con la URL correcta de tu cliente React
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

//importar el archivo de rutas y modelo usuario
const rutausuario = require('./rutas/usuario')
const loginusuario = require('./rutas/usuario')
const rutaDatos = require('./rutas/datos');


//importar body parser
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:'true'}))

app.use('/api/usuario', rutausuario)
app.use('/api/users', loginusuario)
//app.use('/api/token', rutausuario)
app.use('/api/datos', rutaDatos);

app.get('/', (rq, res) =>{
    res.end('Bienvenidos al backedn de Node.js')
})

//configurar server basico
app.listen(5000, function(){
    console.log('El servidor esta node corriendo')
})