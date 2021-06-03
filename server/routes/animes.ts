import * as express from 'express'
import { Anime, animeSchema } from '../models/anime';

const app = express();

//==========================
//          GETS
//==========================

app.get('/animes', (req, res) => {

    Anime.find({"status" : true}).exec((err, animes) => {
        if (err) throw err;

        res.json({
            ok: true,
            animes
        })
    })
})

app.get('/animes/:id', (req, res) => {

    const id = req.params.id;

    Anime.findById(id, (err, anime) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!anime) {
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

app.get('/animes/temporada/:id',(req,res)=>{
    
    let tempId = req.params.id;
    
    Anime.findOne({ temporadas: { $elemMatch: {_id: tempId}}}, (err,resp: any) => {

        if(err){
            return res.json({
                ok: false,
                err
            })
        }

        const temporada = resp.temporadas.find(temp => temp._id.toString() === tempId);

        res.json({
            ok: true,
            temporada
        })
        
    })
})

app.get('/animes/episodio/:id',(req,res)=>{
    
    let episodioId = req.params.id;
    
    Anime.findOne({ temporadas: { $elemMatch: { episodios: { $elemMatch: {_id: episodioId}}}}}, (err,resp: any) => {

        if(err){
            return res.json({
                ok: false,
                err
            })
        }

        let episodio: any;

        const temporada = resp.temporadas.find(temp => {

            const index = temp.episodios.findIndex(e => e._id.toString() === episodioId);

            if(index >= 0){
                episodio = temp.episodios[index];
            }
        });

        res.json({
            ok: true,
            episodio
        })
        
    })
})

//==========================
//         AGREGAR
//==========================

app.post('/animes', (req, res) => {

    console.log('hizo post');

    let body = req.body;

    let anime = new Anime({
        ...body,
        temporadas: [],
    })

    anime.save((err, animeDB) => {
        if (err) {
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

app.post('/animes/temporada', (req, resp) => {

    let id = req.body.id;

    Anime.findById(id, (err, res: any) => {

        if(err){
            return resp.json({
                ok: false,
                err
            })
        };

        //chequear si la ultima temporada esta disponible, si no, no se puede agregar otra
        if (res.temporadas[res.temporadas.length - 1] && !res.temporadas[res.temporadas.length - 1].status) {
            return resp.json({
                ok: false,
                message: 'Tienes temporadas por terminar'
            })
        }

        let nuevatemporada = {
            temporada: (res.temporadas.length + 1).toString(),
            status: false,
            episodios: []
        }

        res.temporadas.push(nuevatemporada);

        res.save((err, animeDB) => {
            resp.json({
                ok: true,
                anime: animeDB
            })
        })

    })

})

app.post('/animes/episodio',(req,res)=>{

    let body = req.body;

    Anime.findOne({ temporadas: { $elemMatch: {_id: body.tempId}}}, (err, resp:any) =>{
        
        if(err){
            return res.json({
                ok: false,
                err
            })
        };

        let a = [];
        
        
        resp.temporadas.find(t => t._id.toString() === body.tempId).episodios.push(body.episodio);
        
        resp.save((err,animeDB)=>{
            res.json({
                ok: true,
                temp: animeDB.temporadas.find(temp => temp._id.toString() === body.tempId)
            })
        });
    })

})

//==========================
//       ACTUALIZAR
//==========================

app.put('/animes', (req, res) => {

    let anime = req.body.anime;

    Anime.findById(anime._id, (err, resp) => {

        if(err){
            return res.json({
                ok: false,
                err
            })
        };

        resp.updateOne(anime, (err, db) => {
            
            if(err){
                return res.json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true
            })
        })

    })

})

app.put('/animes/episodio',(req,res)=>{

    let body = req.body;

    Anime.findOne({ temporadas: { $elemMatch: { episodios: { $elemMatch: {_id: body.episodio._id}}}}}, (err,resp: any) => {

        if(err){
            return res.json({
                ok: false,
                err
            })
        }

        const indexTemp = parseInt(body.episodio.temporada) - 1;

        const indexEp = resp.temporadas[indexTemp].episodios.findIndex(ep => ep._id.toString() === body.episodio._id);
        
        resp.temporadas[indexTemp].episodios.set(indexEp, body.episodio);

        resp.save((err, animeDB)=>{

            if(err){
                return res.json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                episodio: animeDB.temporadas[indexTemp].episodios[indexEp]
            })
        })
    })

})

app.put('/animes/temporada',(req,res)=>{
    let body = req.body;
    
    Anime.findOne({ temporadas: { $elemMatch: {_id: body.temporada._id}}}, (err,resp: any) => {

        if(err){
            return res.json({
                ok: false,
                err
            })
        }

        const index = resp.temporadas.findIndex(temp => temp._id.toString() === body.temporada._id.toString());

        resp.temporadas.set(index, body.temporada);

        resp.save((err, animeDB)=>{

            if(err){
                return res.json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                animeDB
            })
        })
    })
})

//==========================
//         ELIMINAR
//==========================

app.delete('/animes/anime/:id',(req,res)=>{
    const id = req.params.id;

    Anime.findByIdAndDelete(id,(err, resp)=>{

        if(err){
            res.json({
                ok: false,
                err
            })
        }

        if(!resp){
            res.json({
                ok: false,
                message: 'Este id no coincide con ningun elemento'
            })
        }

        res.json({
            ok: true,
            resp
        })

    })
})

app.delete('/animes/temporada/:id',(req,res)=>{

    const id = req.params.id;

    Anime.findOne({ temporadas: { $elemMatch: {_id: id}}}, (err, resp:any)=>{

        if(err){
            res.json({
                ok:false,
                err
            })
        }

        const index = resp.temporadas.findIndex(e => e._id.toString() === id);
        resp.temporadas.splice(index,1);

        resp.save((err, animeDB) => {

            if(err){
                res.json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                animeDB
            })

        })

    })

})

app.delete('/animes/episodio/:id',(req,res)=>{

    const id = req.params.id;

    Anime.findOne({ temporadas: { $elemMatch: {episodios: { $elemMatch: {_id: id}}}}}, (err, resp:any)=>{

        if(err){
            res.json({
                ok:false,
                err
            })
        }

        let indexEp;
        
        const index = resp.temporadas.findIndex(e => {
            const index = e.episodios.findIndex(ep => ep._id.toString() === id);
            if(index >= 0){
                indexEp = index;
                return true;
            } 
            else return false
        });

        resp.temporadas[index].episodios.splice(indexEp,1);

        resp.save((err, animeDB) => {

            if(err){
                res.json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                temporada: animeDB.temporadas[index]
            })

        })

    })

})

module.exports = app;