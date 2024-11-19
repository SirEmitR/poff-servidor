export default class ApiResponse {
    constructor() {
      this.status = null;
      this.data = null;
      this.meta = null;
      this.message = null;
      this.error = null;
    }
  
    success(data, message = "", meta = null) {
      this.status = "success";
      this.data = data;
      this.meta = meta;
      this.message = message;
      this.error = false;
    }
  
    failure(message) {
      this.status = "error";
      this.message = message;
      this.error = true;
    }
  }