const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const validarJWT = (req, res, next) => {
  //Leer token
  const token = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la peticion',
    })
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    req.uid = id
    next()
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no valido',
    })
  }
}

const validarADMIN_ROLE = (req, res, next) => {
  const uid = req.uid

  try {
    const usuarioDB = Usuario.findById(uid)

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no existe',
      })
    }

    if (usuarioDB.role !== 'ADMIN_ROLE') {
      return res.status(403).json({
        ok: false,
        msg: 'No tiene privilegios para hacer eso',
      })
    }

    next()
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const validarADMIN_ROLE_O_MISMO_USUARIO = (req, res, next) => {
    const uid = req.uid
    console.log(uid);
    const id= req.params.id
    console.log(id);
  
    try {
      const usuarioDB = Usuario.findById(uid)
  
      if (!usuarioDB) {
        return res.status(404).json({
          ok: false,
          msg: 'Usuario no existe',
        })
      }
  
      if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
       next()
      }else{
        return res.status(403).json({
            ok: false,
            msg: 'No tiene privilegios para hacer eso',
          })
      }
  
     
    } catch (error) {
      console.log(error)
      res.status(500).json({
        ok: false,
        msg: 'Hable con el administrador',
      })
    }
  }

module.exports = {
  validarJWT,
  validarADMIN_ROLE,
  validarADMIN_ROLE_O_MISMO_USUARIO
}
