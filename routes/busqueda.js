//Ruta : api/todo/

const { Router } = require('express')
const { validarJWT } = require('../middlewares/validar-jwt')
const { getTodo, getDocumenetosColeccion } = require('../controllers/busqueda')


const router = Router()

router.get('/:busqueda',validarJWT,getTodo)
router.get('/coleccion/:tabla/:busqueda',validarJWT,getDocumenetosColeccion)



module.exports = router