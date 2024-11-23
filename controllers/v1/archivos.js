import sharp from "sharp";
import ApiResponse from "../../models/api-response.js";
import { uploadFile } from "../../utils/file.js";

async function upload(req, res){
    try{
        const path = req.body.path;
        let file = req.file;
        let uploadPath = `${path}`;
        //Si no existe el path o el file, lanzar un error
        if(!path){
            throw new Error('El path es requerido');
        }
        //Si no existe el file, lanzar un error
        if(!file){
            throw new Error('No se subió ningún archivo');
        }
        //Confirmar si es imagen basado en el mimetype del archivo
        if(file.mimetype.includes('image')){
            // Convertir la imagen a webp y guardarla en el buffer
            const image = await sharp(file.buffer).webp({ quality: 90 }).toBuffer();
            // Cambiar la extensión del archivo a webp
            const fileName = file.originalname.replace(/\.[^/.]+$/, '.webp');
            // Remplazar el archivo original por el archivo webp
            file = {
                ...file,
                originalname: fileName,
                buffer: image,
                mimetype: 'image/webp',
                size : image.length
            }
        }
        // Agregar el nombre del archivo al path
        uploadPath += `/${file.originalname}`;
        // Guardar el archivo en el path especificado
        const url = await uploadFile(file.buffer, uploadPath, {
            contentType: file.mimetype,
            size: file.size
        });
        // Responder con la URL del archivo subido
        res.json(new ApiResponse().success({url},'Archivo subido correctamente'));
    }catch(err){
        res.json(new ApiResponse().error(err.message));
    }
}

export default {
    upload
};