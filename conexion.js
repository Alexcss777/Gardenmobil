const mongoose = require('mongoose');

const user = "Luis"; 
const pwd = "0123456789"; 
const db = "greencastle";
// Configurar la conexión a MongoDB Atlas
const uri =  `mongodb+srv://Luis:0123456789@clus.yi5exca.mongodb.net/greencastle`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
  })
  .catch((error) => {
    console.log('Error al conectar a MongoDB Atlas', error);
  });

const objetobd = mongoose.connection;

objetobd.on('connected', () => {
  console.log('Conexion correcta a MongoDB');
});

objetobd.on('error', () => {
  console.log('Error en la conexion con MongoDB');
});

// Cerrar la conexión cuando la aplicación se detenga
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Conexión cerrada con MongoDB');
    process.exit(0);
  });
});


/*
const mongoose = require("mongoose");

const user = "Luis"; 
const pwd = "0123456789"; 
const db = "greencastle";
const uri = `mongodb+srv://${user}:${pwd}@clus.yi5exca.mongodb.net/${db}?retryWrites=true&w=majority`;

const conectarDB = async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("BD conectada profe!");
    } catch (error) {
        console.log(error);
        process.exit(1); // Detiene la app si hay un error
    }
};

module.exports = conectarDB;*/







/*
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/garden')

const objetobd = mongoose.connection

objetobd.on('connected', ()=>{console.log('Conexion correcta a MongoDB')})
objetobd.on('erro', ()=>{console.log('erro en la conexion con MongoDB')})

module,exports = mongoose*/