
import database from "../../connections/database.js";
import ApiResponse from "../../models/api-response.js";
import DatabaseResponse from "../../models/database-response.js";
import generateCode from "../../utils/code.js";

async function valiateCode(req, res){
    const { codigo } = req.body;
    try{
        if(!codigo){
            throw new Error('El código es requerido');
        }
        const query = 'CALL ValidateCode(?);';
        const dbres = await database.query(query, [codigo]);
        const response = new DatabaseResponse(dbres, false, 'El código no es válido').data;
        res.json(response);
    }catch(err){
        res.json(new ApiResponse().error(err.message));
    }
}

async function createCodeType(req, res){
    const { tipo } = req.body;
    try{
        if(!tipo){
            throw new Error('El tipo de código es requerido');
        }
        const query = 'CALL CreateCodeType(?);';
        const dbres = await database.query(query, [tipo]);
        const response = new DatabaseResponse(dbres, false, 'El tipo de código ya existe').data;
        res.json(response);
    }catch(err){
        res.json(new ApiResponse().error(err.message));
    }
}

async function createCode(req, res){
    const { dias, tipo } = req.body;
    try{
        if(!tipo){
            throw new Error('El tipo de código es requerido');
        }
        if(!dias){
            throw new Error('Los días son requeridos');
        }

        if(isNaN(dias)){
            throw new Error('Los días deben ser un número');
        }

        const codigo = generateCode();
        const query = 'CALL CreateCode(?, ?, ?);';
        const dbres = await database.query(query, [codigo, dias, tipo]);
        const response = new DatabaseResponse(dbres, false, 'Ocurrio un error al general el codigo').data;
        res.json(response);
    }catch(err){
        res.json(new ApiResponse().error(err.message));
    }
}

export default {
    valiateCode,
    createCodeType,
    createCode
};