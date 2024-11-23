import ApiResponse from "./api-response.js";

export default class DatabaseResponse {
  constructor(rows, isArrayOfRows = false, error) {
    this.rows = rows;
    this.isArrayOfRows = isArrayOfRows;
    this.error = error;
  }

  get data() {
    if(!this.rows || this.rows.length === 0) {
      return new ApiResponse().error(this.error);
    }
    if(this.isArrayOfRows) {
      return new ApiResponse().success(this.rows, { total: this.rows.length });
    }else{
      return new ApiResponse().success(this.rows[0][0]);
    }
  }
}