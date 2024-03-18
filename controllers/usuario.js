const { generarJWT } = require('../helpers/jwt')
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs')

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0
  const limit = Number(req.query.limit) || 5

  // const usuarios = await Usuario
  //                     .find({}, 'nombre email role google')
  //                     .skip(desde)
  //                     .limit(5)

  // const total  = await Usuario.countDocuments()

  const [usuarios, total] = await Promise.all([
    Usuario.find({}, 'nombre email role google img').skip(desde).limit(limit),

    Usuario.countDocuments(),
  ])

  res.json({
    ok: true,
    usuarios,
    total,
    id: req.uid,
  })
}

const crearUsuario = async (req, res) => {
  const { email, password } = req.body

  try {
    const existeEmail = await Usuario.findOne({ email })

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya esta registrado',
      })
    }

    const usuario = new Usuario(req.body)

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)

    await usuario.save()

    const token = await generarJWT(usuario.id)

    res.json({
      ok: true,
      usuario,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error',
    })
  }
}

const actualizarUsuario = async (req, res) => {
  const id = req.params.id

  try {
    const usuarioDB = await Usuario.findById(id)

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario por ese id',
      })
    }

    const { password, google, email, ...campos } = req.body

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email })
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'Ya existe un usuario con ese email',
        })
      }
    }

    if (!usuarioDB.google) {
      campos.email = email
    }else if(usuarioDB.email!==email){
        return res.status(400).json({
            ok:false,
            msg:'Usuario de google no pude cambiar su correo'
        })
    }
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, campos, {
      new: true,
    })

    res.json({
      ok: true,
      usuario: usuarioActualizado,
      id: req.id,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    })
  }
}

const borrarUsuario = async (req, res) => {
  const id = req.params.id

  try {
    const usuarioDB = await Usuario.findById(id)

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario por ese id',
      })
    }

    await Usuario.findByIdAndDelete(id)

    res.json({
      ok: true,
      msg: 'Usuario eliminado',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
}
