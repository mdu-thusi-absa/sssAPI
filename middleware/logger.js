function log(req,res,next){
    //console.log('Got request:',req.method)
    next();
}

module.exports = log;