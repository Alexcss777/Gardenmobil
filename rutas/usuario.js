const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
app.use(cors());




const mongoose = require('mongoose')
const eschema = mongoose.Schema

const eschemausuario = new eschema({
    nombre: String,
    apellido:String,
    username:String,
    direccion:String,
    email: String,
    telefono: String,
    password:String,
    idusuario:String,
    role:String
})

const ModeloUsuario = mongoose.model('usuarios', eschemausuario)
module.exports = router


// Resto del código de las rutas del usuario
router.post('/login', cors(), (req, res) => {
  const { email, password } = req.body;

  ModeloUsuario.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = jwt.sign({ email: user.email }, 'jwt-secret-key', {
              expiresIn: '1d',
            });
            res.cookie('token', token, {
              httpOnly: true,
              sameSite: 'none',
              secure: true,
            });
            return res.status(200).json({ Status: 'Success', email: user.email, role: user.role, token: token });
          } else {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ Status: 'Fail', message: 'The password is incorrect' });
          }
        });
      } else {
        console.log('Usuario no encontrado');
        return res.status(404).json({ message: 'No record existed' });
      }
    });
    
});

router.get('/verifyToken', cors(), (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(200).json({ email: decoded.email });
  });
});

router.post('/logout', cors(), (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'none', secure: true });
  return res.status(200).json({ message: 'Logout successful' });
});
//revisar lo del role en mi base de datos
/*
router.post('/login', cors(),(req, res) => {
  const {email, password} = req.body;
  ModeloUsuario.findOne({email: email})
  .then(user => {
      if(user) {
          bcrypt.compare(password, user.password, (err, response) => {
              if(response) {
                const token = jwt.sign({email: user.email, role: user.role},
                      "jwt-secret-key", {expiresIn: '1d'})  
                  res.cookie('token', token)
                  console.log('Role:', user.role); 
                  return res.json({ Status: "Success", user: user });

              }else {
                  
                  return res.json("The password is incorrect")
              }
          })
      } else {
          return res.json("No record existed")
      }
  })
});*/







router.get('/obtenerusuarios', async (req, res) => {
  try {
    const usuarios = await ModeloUsuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});




router.post('/agregarusuario', async (req, res) => {
  const { 
    nombre, apellido, username, direccion, email, telefono, password, idusuario 
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevousuario = new ModeloUsuario({
      nombre,
      apellido,
      username,
      direccion,
      email,
      telefono,
      password: hashedPassword,
      idusuario,
    });

    await nuevousuario.save();
    res.send('Usuario agregado correctamente');
  } catch (error) {
    res.send(error);
    console.error("Error al agregar usuario:", error);
  res.status(500).send("Error al agregar usuario.");
  }
});


router.put('/update', async (req, res) => {
  const { email, nombre, apellido, username, telefono, direccion } = req.body;
  try {
      const updatedUser = await ModeloUsuario.findOneAndUpdate(
          { email: email },
          {
              nombre: nombre,
              apellido: apellido,
              username: username,
              telefono: telefono,
              direccion: direccion
          },
          { new: true }  // esto retornará el documento actualizado
      );
      if (updatedUser) {
          res.status(200).json(updatedUser);
      } else {
          res.status(404).json({ message: 'Usuario no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el usuario', error });
  }
});


router.delete('/delete', async (req, res) => {
  const { email, fields } = req.body;
  try {
      let updateObj = {};
      fields.forEach(field => {
          updateObj[field] = '';  // Establece el campo en una cadena vacía o cualquier valor predeterminado que desees.
      });
      const updatedUser = await ModeloUsuario.findOneAndUpdate(
          { email: email },
          updateObj,
          { new: true }
      );
      if (updatedUser) {
          res.status(200).json(updatedUser);
      } else {
          res.status(404).json({ message: 'Usuario no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error al eliminar campos', error });
  }
});


router.get('/usuario/:email', async (req, res) => {
  try {
    const usuario = await ModeloUsuario.findOne({ email: req.params.email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});