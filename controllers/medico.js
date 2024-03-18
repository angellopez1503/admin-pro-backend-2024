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
      id: req.id,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const crearMedico = async (req, res) => {
  try {
    const usuarioId = req.uid

    const hospital = await Hospital.findOne({ _id: req.body.hospital })
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        msg: 'El hospital no existe',
      })
    }
    const medico = new Medico({
      ...req.body,
      usuario: usuarioId,
    })

    const medicoDB = await medico.save()

    res.json({
      ok: true,
      medico: medicoDB,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const actualizarMedico = async (req, res) => {
  try {
    const id = req.params.id
    const uid = req.uid

    const medico = await Medico.findById(id)

    if (!medico) {
      return res.status(404).json({
        ok: false,
        msg: 'Medico no encontrado',
      })
    }
    const cambiosMedico = {
      ...req.body,
      usuario: uid,
    }

    const medicoActualizado = await Medico.findByIdAndUpdate(
      id,
      cambiosMedico,
      { new: true },
    )

    res.json({
      ok: true,
      medico: medicoActualizado,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const borrarMedico = async (req, res) => {
  try {
    const id = req.params.id

    const medico = await Medico.findById(id)

    if (!medico) {
      return res.status(404).json({
        ok: false,
        msg: 'Medico no encontrado',
      })
    }

    await Medico.findByIdAndDelete(id)

    res.json({
      ok: true,
      msg: 'Medico eliminado',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const getMedicoById = async (req, res) => {
  const id = req.params.id

  try {
    const medico = await Medico.findById(id)
      .populate('usuario', 'nombre img')
      .populate('hospital', 'nombre img')

    res.json({
      ok: true,
      medico,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
  getMedicoById
}
