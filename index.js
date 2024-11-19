import express from 'express';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import cors from 'cors';

process.loadEnvFile();
const app = express();
const PORT = process.env.PORT || 3100;
/*
GET /<ruta>               # Obtener todos los usuarios (con paginación)
POST /<ruta>              # Crear un nuevo usuario
GET /<ruta>/{id}          # Obtener un usuario específico por ID
PUT /<ruta>/{id}          # Actualizar un usuario completo
PATCH /<ruta>/{id}        # Actualizar parcialmente un usuario
DELETE /<ruta>/{id}       # Eliminar un usuario
 */
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000', // Permitir solo este dominio
    methods: 'GET,POST,PUT,PATCH,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type,Authorization', // Encabezados permitidos
    credentials: true // Permitir credenciales
  };
app.use(cors(corsOptions));

// Definir la ruta de la carpeta de rutas
const routesPath = path.resolve('routes');

fs.readdirSync(routesPath).forEach((versionFolder) => {
    const versionPath = path.join(routesPath, versionFolder);

    if (fs.lstatSync(versionPath).isDirectory()) {
        fs.readdirSync(versionPath).forEach((file) => {
            if (file.endsWith('.js')) {
                const route = `/${versionFolder}/${file.replace('.js', '')}`;
                const modulePath = pathToFileURL(path.join(versionPath, file)).href;
                import(modulePath).then((module) => {
                    app.use(route, module.default);
                    console.log(`Ruta cargada: ${route}`);
                }).catch((error) => {
                    console.error(`Error al cargar la ruta ${route}:`, error);
                });
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
