var DDError = {}

DDError.create = function(code, message) {
return {
         "code": code, 
         "meessage": message
       };
}

module.exports = DDError;
