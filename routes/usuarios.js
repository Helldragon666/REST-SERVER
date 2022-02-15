const { Router } = require('express');
const { check } = require('express-validator');


const { usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch } = require('../controllers/usuarios');

//const { validarCampos } = require('../middlewares/validar-campos');
//const { validarJWT } = require('../middlewares/validar-jwt');
//const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const { validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole } = require('../middlewares');

const { esRoleValido, emailExiste, exiteUsuarioPorId } = require('../helpers/db-validators');


const router = Router();

router.get('/', usuariosGet);



router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(exiteUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);



router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('password', 'La contraseña debe deser de mas de 6 caracteres').isLength({ min: 6 }),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);



router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(exiteUsuarioPorId),
    validarCampos
], usuariosDelete);


router.patch('/', usuariosPatch);


module.exports = router;