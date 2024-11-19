# POFF Server

## Introduccion

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
    "data": null,
    "code": 0,
    "message": ""
}
```
