const config = require('mongoose');
const conection = async()=>{

    let url = 'mongodb+srv://kjisu480:djGxiBXVY85GkWss@cluster0.ftqmm.mongodb.net/nodejs?retryWrites=true&w=majority'
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