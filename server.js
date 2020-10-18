const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { reset } = require('nodemon');

const PORT = process.env.PORT | 3000;
app.use(express.static(__dirname+'/public'));


//CORS
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,Content-Type,Authorization,x-id,Content-Length,X-Requested-With");
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});

    }    
    next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.post('/login',(req,res,next)=>{
    
    const username=req.body.username;
    const password = req.body.password;
    res.cookie(username,password,{sameSite:'Strict'});
    //res.cookie(username,passwrd,{sameSite:'Lax'});
    res.send("ok");

});

app.get('/',(req,res,next)=>{
    
    res.sendFile(path.join(__dirname,'/public/index.html'));
    
});

app.get('/img',(req,res,next)=>{
    
    // Si el request a /img es desde el mismo dominio (http://localhost), el browser permite enviar las cookies que tiene
    // guardadas en cookies.
    // Y como pregunto si el que hace el request envía cookies, entonces muestro imagen
    if(req.headers.cookie){
        res.sendFile(path.join(__dirname,'/img/cookie.png'));
        console.log(req.headers.cookie);
    }

    // Si el request a /img lo hago desde otro dominio (cross-domain), el browser decide no enviar las cookies 
    // en el request (si es que la cookie está seteada como 'restrict').
    // Y por lo tanto no muestro imagen
    else if(!req.headers.cookie){
        console.log(req.headers.cookie);
        res.sendStatus(403);
        res.end();
    }
});

app.listen(PORT,()=>{
    console.log("Conectado al puerto ",PORT);
});