class Express404Error extends Error{
    constructor(message, status){
        super();
        this.message=message
        this.status=status
        console.error(this.stack)
    }
}

class MissingDataError extends Error{
    constructor(message, status){
        super();
        this.message=message
        this.status=status
        console.error(this.stack)
    }
}

module.exports={
    Express404Error,
    MissingDataError
}