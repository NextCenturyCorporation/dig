/*
    Mock auth for dev environment
*/
module.exports = function(req, res, next) {       
    if(!req.headers.user) {
        req.headers.user = 'test@test.com';
    }
    next();          
}