var DDError = {}

DDError.ERRORCODE_VALIDATE = "E0001";
DDError.ERRORCODE_SYSTEM = "E9999";

DDError.create = function(code, message) {
return {
         "code": code, 
         "meessage": message
       };
}
module.exports = DDError;
