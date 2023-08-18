/*const express = require('express');
const router = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');


const eschema = mongoose.Schema;

const datosSchema = new eschema({
  ID: String,
  DATE_TIME: String,
  T: String,
  RH: String,
  LUX: String,
});

const DatosModel = mongoose.model('lectures', datosSchema);

// Ruta para obtener todos los datos
router.get('/datos', async (req, res) => {
  try {
    const datos = await DatosModel.find();
    res.json(datos);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

module.exports = router;*/
const express = require('express');
const router = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');

router.use(cors());

const eschema = mongoose.Schema;

const datosSchema = new eschema({
  ID: String,
  DATE_TIME: String,
  T: String,
  RH: String,
  HUM: String,
  LUX: String,
});

const ModeloDatos = mongoose.model('lectures', datosSchema);

// Ruta para obtener todos los datos de la colección usando el router
router.get('/datos', async (req, res) => {
  try {
    const datos = await ModeloDatos.find({}, { _id: 0, DATE_TIME: 1, T: 1, RH: 1, HUM: 1, LUX: 1 });
    res.json(datos);
    console.log(datos);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

module.exports = router;


