// ruta: /api/usuarios

const { Router } = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validat-campos')
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuario')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()

router.get('/', validarJWT, getUsuarios)
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no tiene el formato correcto').isEmail(),
    validarCampos
], crearUsuario)
router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El email no tiene el formato correcto').isEmail(),
        check('role', 'El rol es obligatorio').not().isEmpty(),
        validarCampos,
    ]
    , actualizarUsuario)
router.delete('/:id', validarJWT, borrarUsuario)


module.exports = router