import database from "../../connections/database.js";
import { uploadFile } from "../../utils/file.js";
import sharp from "sharp";

// Description: Controlador para la gestión de usuarios.
async function verUsuarios(req, res) {
    const query = 'SELECT * FROM vw_Poff_Usuario WHERE activo = 1;';
    try{
        const rows = await database.query(query);
        res.json({
            data: rows,
            status: 'Ok'
        });
    }catch(err){
        res.json({
            data: [],
            status: 'Error',
            error: err
        });
    }
}

async function verUsuario(req, res) {
    const { id } = req.params;
    const query = 'SELECT * FROM vw_Poff_Usuario WHERE id = ? AND activo = 1;';
    try{
        const rows = await database.query(query, [id]);
        if(rows.length === 0){
            res.json({
                data: [],
                status: 'Error',
                error: 'No se encontró el usuario'
            });
            return;
        }
        res.json({
            data: rows[0],
            status: 'Ok'
        });
    }catch(err){
        res.json({
            data: [],
            status: 'Error',
            error: err
        });
    }
}

async function crearUsuario(req, res) {
    const query = `CALL CreateUser(?, ?, ?);`;
    try{
        const { nombre, email, password } = req.body;
        if(!nombre || !email || !password){
            res.json({
                data: [],
                status: 'Error',
                error: 'Todos los campos son requeridos'
            });
            return;
        }
        const outputResult = await database.query(query, [email, nombre, password]);
        if(outputResult[0].length === 0){
            res.json({
                data: [],
                status: 'Error',
                error: 'No se pudo crear el usuario'
            });
            return;
        }
        const {success, message, id} = outputResult[0][0];
        if(!success){
            res.json({
                data: [],
                status: 'Error',
                error: message
            });
            return
        }
        res.send({
            data: id,
            status: success ? 'Ok' : 'Error',
            message: message
        });
    }catch(err){
        res.json({
            data: [],
            status: 'Error',
            error: err
        });
    }
}

async function actualizarUsuario(req, res) {
    const { id } = req.params;
    const field = req.query.field;
    const { data } = req.body;
    let fixedData = data;
    let query = '';
    try{
        if(!field){
            throw new Error('No se especificó el campo a actualizar');
        }
        switch(field){
            case 'nombre':
                query = 'CALL UpdateUserName(?, ?);';
                //Eliminar espacios en blanco al inicio y al final
                fixedData = data.trim();
                break;
            case 'email':
                query = 'CALL UpdateUserEmail(?, ?);';
                break;
            case 'curp': 
                query = 'CALL UpdateUserCURP(?, ?);';
                //Convertir a mayúsculas, eliminar espacios y caracteres especiales
                fixedData = data.toUpperCase().replace(/\s/g, '');
                break;
        }
        const outputResult = await database.query(query, [id, fixedData]);
        if(outputResult[0].length === 0){
            res.json({
                data: [],
                status: 'Error',
                error: 'No se pudo actualizar el usuario'
            });
            return;
        }
        const {success, message} = outputResult[0][0];
        res.send({
            data: [],
            status: success ? 'Ok' : 'Error',
            message: message
        });
    }catch(err){
        res.json({
            data: [],
            status: 'Error',
            error: err.message
        });
    }
}

async function actualizarFoto(req, res) {
    try{
        const {id} = req.params;
        const file = req.file;
        if(!file){
            throw new Error('No se subió ningún archivo');
        }
        const image = await sharp(file.buffer).webp({ quality: 90 }).toBuffer();
        const fileName = file.originalname.replace(/\.[^/.]+$/, '.webp');
        const filePath = `users/${id}/${fileName}`;
        const url = await uploadFile(image, filePath);
        const query = 'CALL UpdateUserPhoto(?, ?);';
        const result = await database.query(query, [id, url]);
        if(result[0].length === 0){
            throw new Error('No se pudo actualizar la foto');
        }
        const {success, message} = result[0][0];
        res.json({
            data: [],
            status: success ? 'Ok' : 'Error',
            message: message
        });
    }catch(err){
        res.json({
            data: [],
            status: 'Error',
            error: err.message
        });
    }
}

async function eliminarUsuario(req, res) {
    const { id } = req.params;
    const query = 'CALL DeleteUser(?);';
    try{
        const response  =  await database.query(query, [id]);
        const {success, message} = response[0][0];
        res.send({
            status: success ? 'Ok' : 'Error',
            message: message
        });
    }catch(err){
        res.json({
            data: [],
            status: 'Error',
            error: err
        });
    }
}

export default { 
    verUsuarios,
    verUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    actualizarFoto
 };