
export default class ApiResponse {
    constructor(status = "success", data = null, message = "", meta = null) {
      this.status = status; // 'success' o 'error'
      this.message = message; // Mensaje principal
      this.data = data; // Datos opcionales
      this.meta = meta; // Metadatos opcionales
    }
    toJSON() {
      const response = {
        status: this.status,
        message: this.message,
      };
  
      if (this.data !== null) response.data = this.data;
      if (this.meta !== null) response.meta = this.meta;
  
      return response;
    }
  }