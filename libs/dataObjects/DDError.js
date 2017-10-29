var DDError = function(code, message) {
    this.code = code;
    this.message = message;
    this.toJSON = function () {
        return {
                "code": code, 
                "meessage": message
               };
    }
}

DDError.ERRORCODE_VALIDATE = "E0001";
DDError.ERRORCODE_SYSTEM = "E9999";

module.exports = DDError;
