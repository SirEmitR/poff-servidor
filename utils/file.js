import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../connections/firebase.js';
process.loadEnvFile();
export async function uploadFile(buffer, path, metadata = {}){
    const storageRef = ref(storage, `${process.env.STORAGE_PATH}/${path}`);
    const snapshot = await uploadBytes(storageRef, buffer, {
        customMetadata: metadata
    });
    if(snapshot){
        const url = await getDownloadURL(storageRef);
        return url;
    }

    throw new Error('No se pudo subir el archivo');
}