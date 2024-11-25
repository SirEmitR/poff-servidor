import ApiResponse from "./api-response.js";

export default class DatabaseResponse {
  constructor(rows, isArrayOfRows = false, error) {
    this.rows = rows;
    this.isArrayOfRows = isArrayOfRows;
    this.error = error;
    this.metadata = null;
  }

  get data() {
    if(!this.rows || this.rows.length === 0) {
      return new ApiResponse().error(this.error);
    }
    if(this.isArrayOfRows) {
      return new ApiResponse().success(this.rows, '', this.metadata);
    }else{
      return new ApiResponse().success(this.rows[0][0]);
    }
  }

  set setMetadata(value) {
    this.metadata = value;
  }
}