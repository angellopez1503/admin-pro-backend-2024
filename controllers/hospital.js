
const Hospital = require('../models/hospital')

const getHospitales = async (req, res) => {

    try {
        const hospitales = await Hospital.find()
            .populate('usuario', 'nombre img')

        res.json({
            ok: true,
            hospitales,
            id: req.uid
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const crearHospital = async (req, res) => {
   
    const usuarioId = req.uid
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
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const actualizarHospital = async (req, res) => {

    try {
        const id = req.params.id
        const uid = req.uid

        const hospital = await Hospital.findById(id)

        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            })
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true })

        res.json({
            ok: true,
            hospital: hospitalActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const borrarHospital = async (req, res) => {

    try {

        const id = req.params.id

        const hospital = await Hospital.findById(id)

        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            })
        }

        await Hospital.findByIdAndDelete(id)

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}