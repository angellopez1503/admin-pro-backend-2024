const { googleVerify } = require("../helpers/google-verify");
const { generarJWT } = require("../helpers/jwt");
const { getMenuFrontEnd } = require("../helpers/menu-frontend");
const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs')

const login = async (req, res) => {

    const { email, password } = req.body

    try {

        //Verificar email

        const usuarioDB = await Usuario.findOne({ email })

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            })
        }

        //Generar el TOKEN - JWT

        const token = await generarJWT(usuarioDB.id)

        res.json({
            ok: true,
            token,
            menu:getMenuFrontEnd(usuarioDB.role)
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const googleSignIn = async (req, res) => {

    try {

        const { email, name, picture } = await googleVerify(req.body.token)

        const usuarioDB = await Usuario.findOne({ email })
        let usuario

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDB
            usuario.google = true
        }

        //Guardar usuario
        await usuario.save()

        //Generar el TOKEN -JWT
        const token = await generarJWT(usuario.id)

        res.json({
            ok: true,
            email,
            name,
            picture,
            token,
            menu:getMenuFrontEnd(usuario.role)
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const renewToken = async (req, res) => {

    try {

        const uid = req.uid
        const token = await generarJWT(uid)

        //Obtener el usuario por uid
        const usuario = await Usuario.findById(uid)

        res.json({
            ok: true,
            token,
            usuario,
            menu:getMenuFrontEnd(usuario.role)

        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


module.exports = {
    login,
    googleSignIn,
    renewToken
}