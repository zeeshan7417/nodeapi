const config = require('mongoose');
const conection = async()=>{

    let url =  process.env.MONOGO_CONNECT;
    const dbconfig = {useNewUrlParser:true, useUnifiedTopology:true}
    try{

         await config.connect(url,dbconfig);
         console.log(`database conencted on  ${process.pid}`);
    }
    catch(error){
        console.log(`database Not conected   ${error}`);
        return false;
    }
}

module.exports = conection();