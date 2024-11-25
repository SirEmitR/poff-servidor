import database from "../../connections/database.js";
import ApiResponse from "../../models/api-response.js";
import DatabaseResponse from "../../models/database-response.js";
import normalize from "../../utils/normalize.js";

async function createFranchise(req, res){
    const { franquicia, logo, tipoFondo, fondo, creador } = req.body;
    try{
        if(!franquicia || !tipoFondo || !fondo || !creador){
            throw new Error('Todos los campos son requeridos');
        }
        const normalized = normalize(franquicia);
        const query = 'CALL CreateFranchise(?, ?, ?, ?, ?, ?);';
        const ress = await database.query(query, [franquicia, normalized,creador,tipoFondo,fondo, logo]);
        const data = new DatabaseResponse(ress, false, 'No se pudo crear la franquicia').data;
        res.json(data);
    }catch(err){
        res.json(new ApiResponse().error(err.message));
    }
}

async function validateFranchiseName(req, res){
    const { nombre } = req.body;
    try{
        if(!nombre){
            throw new Error('El nombre de la franquicia es requerido');
        }
        const normalized = normalize(nombre);
        const query = 'CALL ValidateFranchiseName(?);';
        const ress = await database.query(query, [normalized])
        const data = new DatabaseResponse(ress, false, 'El nombre de la franquicia ya existe').data;
        res.json(data);
    }catch(err){
        res.json(new ApiResponse().error(err.message));
    }
}

export default {
    createFranchise,
    validateFranchiseName
};