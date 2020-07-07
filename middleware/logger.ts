function log(req:any,res:any,next:any){
    //console.log('Got request:',req.method)
    next();
}

module.exports = log;