const express = require('express');
const database = require('../Database/db');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.get('/1000',async(req,res)=>{
  res.send("hi im kevin")
});


app.post('/Login_api',async(req,res)=>{
    try {
        console.log("/Login_api -hitted");
         console.log(req)
        let payload = req.body['payload'];
        console.log(payload)
        var data = await database.executeQuery('select om_lg_login($1,$2,$3)',[null,payload['user_name'],payload['user_password']])
        console.log(data);
        if(data == 'wrong_combination') throw new Error(data);     
        var token = jwt.sign(data[0],process.env.secret_ket,{ expiresIn: '5h'});
        //  token = token.split(' ')[1];
        var user_details = await jwt.verify( token,process.env.secret_ket)
        console.log('user_details  ' + user_details)
        console.log(token)
        res.send({'token': token});
    } catch (error) {
        console.log(error)
        res.send( error.message);

    }

});


app.post('/create_user',async(req,res)=>{

    try {
        console.log("/create_user -hitted");
        // console.log(req)
        let payload = req.body['payload'];
        var data = await database.executeQuery('select om_account_creation($1,$2,$3,$4)',
        [null,payload['user_name'],payload['user_email'],payload['user_password']]);
        console.log(data)
        console.log("------")
        res.send(data);

    } catch (error) {
        console.log(error)
        res.send(error.message);

    }
})

app.get('/select_all_user',async(req,res)=>{
    try{
        console.log("home");
        console.log(req.body)
        let payload = req.body
        var base64Data = req.body['product_image']
        console.log('date_str')
        var data = await database.executeRawQuery('select * from user_details where delete_flag = false',[])
        data = data['rows']
        console.log(data)
        res.json(data)
    }catch(e){
        console.log(e.message);
        res.json('Error')
    }
});

app.delete('/delete_user/:id',async(req,res)=>{
    try{
        var id = req.params.id;
        console.log(id)
        console.log(id)
       
        console.log("home");
        console.log(req.body)
        let payload = req.body
        var base64Data = req.body['product_image']
        console.log('date_str')
        var data = await database.executeRawQuery('update user_details set  delete_flag = true where _id = $1 returning _id',[id])  
        res.json("Deleted Sucessfull")
    }catch(e){
        console.log(e.message);
        res.json('Error')
    }
});






module.exports = app;
