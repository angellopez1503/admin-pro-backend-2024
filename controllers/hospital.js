
const Hospital = require('../models/hospital')

const getHospitales = async (req, res) => {

    try {
        const hospitales = await Hospital.find()
        .populate('usuario','nombre img')

        res.json({
            ok: true,
            hospitales,
            id: req.id
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const crearHospital = async (req, res) => {

    const usuarioId = req.id
    const hospital = new Hospital({
        usuario: usuarioId,
        ...req.body
    })


    try {

        const hospitalDB = await hospital.save()

        res.json({
            ok: true,
            hospital: hospitalDB
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const actualizarHospital = (req, res) => {

    res.json({
        ok: true,
        msg: 'actualizarHospital'
    })
}

const borrarHospital = (req, res) => {

    res.json({
        ok: true,
        msg: 'borrarHospital'
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}