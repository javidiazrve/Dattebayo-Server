//=======================
//  PUERTO
//=======================

process.env.PORT = process.env.PORT || '3000';

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=======================
// BASE DE DATOS
//=======================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/anime4u';
}else{
    urlDB = 'mongodb+srv://javidiazrve:11019356Ja@anime4u.s5hmm.mongodb.net/anime4u?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB;
