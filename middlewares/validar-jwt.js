
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req, res, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'token no valido - no existe'
            });
        }

        //verificar si el uid no tiene estado en true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'token no valido - estado false'
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {

        console.log(error);
        return res.status(401).json({
            msg: 'token no valido'
        });
    }

    //console.log(token);

}


module.exports = {
    validarJWT
}