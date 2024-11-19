
export default class ApiResponse {
    constructor() {
      this.success = this.success.bind(this);
      this.error = this.error.bind(this)
    }
  
    success(data, message = "", meta = null) {
      return {
        status: "success",
        data: data,
        message: message,
        meta: meta,
      };
    }
  
    error(message) {
      return {
        status: "error",
        message: message,
        error: true,
      };
    }
  }