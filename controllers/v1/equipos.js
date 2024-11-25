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

async function getFranchises(req, res) {
    // Recoger parámetros del query
    const { search, maxResults, orderBy } = req.query;

    // Construcción dinámica de la consulta
    let query = 'SELECT * FROM Poff_Franquicias WHERE activo = 1';
    const params = [];

    // Filtro de búsqueda (aplica en varios campos)
    if (search) {
        query += ` AND (
            franquicia LIKE ?
            OR franquicia_normalizado LIKE ?
            OR creador LIKE ?
        )`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
    }

    // Ordenar
    if (orderBy) {
        const validColumns = ['franquicia', 'franquicia_normalizado', 'creador', 'fecha_creacion', 'id_tipo_fondo'];
        if (validColumns.includes(orderBy)) {
            query += ` ORDER BY ${orderBy}`;
        } else {
            return res.json(new ApiResponse().error('Invalid orderBy field'));
        }
    }

    // Limitar el número de resultados
    if (maxResults) {
        const limit = parseInt(maxResults, 10);
        if (!isNaN(limit) && limit > 0) {
            query += ' LIMIT ?';
            params.push(limit);
        } else {
            return res.json(new ApiResponse().error('Invalid maxResults value'));
        }
    }

    try {
        // Ejecutar la consulta con parámetros
        const rows = await database.query(query, params);
        res.json(new ApiResponse().success(rows));
    } catch (err) {
        res.json(new ApiResponse().error(err.message));
    }
}


export default {
    getFranchises,
    createFranchise,
    validateFranchiseName
};