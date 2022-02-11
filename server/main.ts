import { Mongoose } from "mongoose";
import * as http from 'http';

require('./config/config');
const express = require('express');
const bodyparser = require('body-parser');
const mongoose: Mongoose = require('mongoose');
const app = express();    
const cors = require('cors');
const server = http.createServer(app);


app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(require('./routes/animes'));

mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if(err) throw err;
    console.log('conectado');
})

server.listen(process.env.PORT, () => {
    console.log("escuchando puerto: ",process.env.PORT);  
})



