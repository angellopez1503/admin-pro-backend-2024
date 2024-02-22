const Medico = require('../models/medico')
const Hospital = require('../models/hospital')

const getMedicos = async (req, res) => {

    try {

        const medicos = await Medico.find()
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img')

        res.json({
            ok: true,
            medicos,
            id: req.id
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const crearMedico = async (req, res) => {

    try {
        const usuarioId = req.id

        const hospital = await Hospital.findOne({ _id: req.body.hospital })
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                msg: 'El hospital no existe'
            })
        }
        const medico = new Medico({
            ...req.body,
            usuario: usuarioId

        })

        const medicoDB = await medico.save()

        res.json({
            ok: true,
            medico: medicoDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const actualizarMedico = (req, res) => {

    res.json({
        ok: true,
        msg: 'actualizarMedico'
    })
}

const borrarMedico = (req, res) => {

    res.json({
        ok: true,
        msg: 'borrarMedico'
    })
}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}