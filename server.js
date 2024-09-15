const express  = require('express');
const  app = express();
require('dotenv').config();
require('./connection/db');
require('./modal/userModel');
const userRoutes = require('./routes/userRoutes');
const body = require('body-parser');
app.use(body.json());
app.use('/api/v1', userRoutes)

app.get("/", (req,res)=>{
 res.send("home page")
})
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // Exit with failure code
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`listening on ${PORT}`)
})