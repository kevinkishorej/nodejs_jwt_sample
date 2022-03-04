const express = require('express');
const app = express();
const cors = require('cors');
const mainapi = require('./routing/main_api');
app.use(express.json({limit: '50mb'}));

app.use(cors());
app.use(express.json({ extended: false })); 
app.use(express.static(__dirname + '/public/images'));


 


///API ROUTING....

 app.use('/',mainapi);



app.listen(3002,()=>{
    console.log("server started 3002")
})
