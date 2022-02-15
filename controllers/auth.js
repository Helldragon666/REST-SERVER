const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos'
            });
        }

        //verificar si el usuario esta activo en la bd
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos - estado'
            });
        }

        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'usuario o Contraseña incorrectos'
            });
        }

        //generar el JWT (JSON Web Token)
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });


    } catch (error) {

        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });

    }

}


const googleSingin = async (req, res) => {

    const { id_token } = req.body;

    try {

        const { correo, img, nombre } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //generar el JWT (JSON Web Token)
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Token de google no es valido'
        });
    }



}



module.exports = {
    login,
    googleSingin
}