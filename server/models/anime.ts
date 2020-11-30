import * as mongoose from 'mongoose';

let Schema = mongoose.Schema;

export let animeSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
        required: true
    },
    fechaEstreno: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    episodios: [
        {
            temporada: {
                type: String
            },
            numero: {
                type: String
            },
            nombre: {
                type:String
            },
            sinopsis: {
                type: String
            },
            duracion: {
                type: String
            },
            poster: {
                type: String
            },
            url: {
                type: String
            }
        }
    ]
});

export const Anime = mongoose.model('Anime', animeSchema);
