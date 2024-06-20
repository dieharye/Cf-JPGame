import CustomError from "./customError"

const NotFoundError = new CustomError(404, "Not Found")

export default NotFoundError