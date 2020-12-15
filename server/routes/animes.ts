import * as express from 'express'
import { Anime } from '../models/anime';

const app = express();

app.get('/animes', (req,res)=>{

    console.log('hizo get');

    Anime.find({}).exec((err, animes) =>{
        if(err) throw err;
  
        res.json({
            ok: true,
            animes
        })
    })
})

app.get('/animes/:id', (req,res)=>{

    const id = req.params.id;

    console.log('hizo get id');
    

    Anime.findById(id, (err, anime) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!anime){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe ese id'
                }
            })
        }

        res.json({
            ok: true,
            anime
        })
    });
})

app.post('/animes', (req,res) => {

    console.log('hizo post');

    let body = req.body;

    let anime = new Anime({
        nombre: body.nombre,
        descripcion: body.descripcion,
        fechaEstreno: body.fechaEstreno,
        poster: body.poster,
        status: false,
        temporadas: []
    })   

    anime.save( (err,animeDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            anime: animeDB
        })
    });

});

app.put('/animes/episodio', (req,res)=>{

    let data = req.body;

    Anime.findById(data.id, (err, res)=>{
        if(err) throw err;
        
        res.updateOne({$push: { episodios: data.episodio}}).then(res => {
            res.json({
                ok:true,
                res
            });
        })    
    })
    

})

app.put('/animes', (req,res) => {

    let data = req.body;

    Anime.findById(data.id, (err,res)=>{

        if(err) throw err;

        res.updateOne(data, (err,res)=>{
            res.json({
                ok:true,
                res
            })
        })

    })

})

module.exports = app;