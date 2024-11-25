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
    const { search, maxResults = 10, orderBy, page = 1 } = req.query;

    // Construcción dinámica de las consultas
    let query = 'SELECT * FROM Poff_Franquicias WHERE activo = 1';
    let totalQuery = 'SELECT COUNT(*) as total FROM Poff_Franquicias WHERE activo = 1';
    const params = [];
    const totalParams = []; // Parámetros separados para totalQuery

    // Filtro de búsqueda (aplica en varios campos)
    if (search) {
        query += ` AND (
            franquicia LIKE ?
            OR creador LIKE ?
        )`;

        totalQuery += ` AND (
            franquicia LIKE ?
            OR creador LIKE ?
        )`;

        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern);
        totalParams.push(searchPattern, searchPattern); // Asegurarse de usar parámetros separados
    }

    // Ordenar
    if (orderBy) {
        const validColumns = ['franquicia', 'creador', 'fecha_creacion'];
        if (validColumns.includes(orderBy)) {
            query += ` ORDER BY ${orderBy}`;
        } else {
            return res.json(new ApiResponse('error', null, 'Invalid orderBy value'));
        }
    }

    // Paginación
    const limit = parseInt(maxResults, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    if (!isNaN(limit) && limit > 0) {
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);
    } else {
        return res.json(new ApiResponse('error', null, 'Invalid maxResults or page value'));
    }

    try {
        // Ejecutar la consulta principal con paginación
        const rows = await database.query(query, params);

        // Ejecutar la consulta para el total de registros (sin paginación)
        const [{ total }] = await database.query(totalQuery, totalParams);
        const totalRecords = Number(total);

        // Calcular metadatos
        const hasMore = totalRecords > (parseInt(page, 10) * limit);
        const meta = {
            total: totalRecords,
            hasMore,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: parseInt(page, 10),
        };

        // Respuesta final
        res.json(new ApiResponse('success', rows, 'Franchises found', meta));
    } catch (err) {
        res.json(new ApiResponse('error', null, err.message));
    }
}



export default {
    getFranchises,
    createFranchise,
    validateFranchiseName
};