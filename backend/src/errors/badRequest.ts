import CustomError from "./customError"

const BadRequest = new CustomError(400, "Bad Request")

export default BadRequest

