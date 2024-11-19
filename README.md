# POFF Server

## Instalación

### Prerequisitos

- **Node.js**: Asegúrate de tener Node.js >= 22.x instalado.
- **Base de datos**: MariaDB
- **Firebase**: Firestore, Storage
- **Dependencias**: Todas las dependencias necesarias están listadas en el archivo `package.json`

### Instrucciones

1. Clona el repositorio:

    ```bash
    git clone https://github.com/SirEmitR/poff-servidor.git
    cd poff-servidor
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

3. Inicia el servidor

    ```bash
        #Development
        node --watch index.js

        #Production
        node index.js
    ```

### Conectate a Firebase

Crea una cuenta en [Firebase](https://console.firebase.google.com/)

#### Agrega los servicios

- Firebase Firestore
- Firebase Storage

#### Mensajeria

Si deseas agregar el servicio de mensajeria sera necesario que incluyas la extension [Trigger Email from Firestore](https://extensions.dev/extensions/firebase/firestore-send-email), para ello necesitaras actualizar la cuenta a prepago Blaze

### Respuesta exitosa

#### Estructura basica de exito para un elemento

```json
{
    "status": "success",
    "data": {},
    "meta":{},
    "message": ""
}
```

#### Estructura basica de exito para varios elementos

```json
{
    "status": "success",
    "data": [],
    "meta":{
        "total": 1,
        "currentPage":1,
        "totalPages": 1,
        "itemsPerPage": 10
    },
    "message": ""
}
```

### Respuesta base de error

```json
{
    "status": "error",
    "error": true,
    "message": ""
}
```
