export default function normalize(text, toUpperCase = false) {
    // Normalizar el texto para eliminar caracteres no deseados
    let normalizedText = text
        .normalize('NFD') // Descompone caracteres con diacríticos (á -> á)
        .replace(/[\u0300-\u036f]/g, '') // Elimina los diacríticos
        .replace(/[^a-zA-Z0-9]/g, '_') // Reemplaza caracteres no alfanuméricos por guiones bajos
        .replace(/_+/g, '_') // Reemplaza múltiples guiones bajos consecutivos por uno solo
        .replace(/^_|_$/g, ''); // Elimina guiones bajos al principio o al final

    // Convertir a minúsculas o mayúsculas según el parámetro
    return toUpperCase ? normalizedText.toUpperCase() : normalizedText.toLowerCase();
}