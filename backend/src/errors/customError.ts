class CustomError extends Error {
    public status:number;
    constructor(status:number = 500, message: string){
        super(message);
        this.status = status;
        // Object.setPrototypeOf(this, CustomError.prototype)
    }
}

export default CustomError