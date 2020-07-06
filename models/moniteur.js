const mongoose = require('mongoose');

const MoniteurSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true

        },
        phone: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,  //bch nfarkiw bin les util li f site ( admin / moniteurs / elibch yetaalem ..)

        },
        etat: {
            type: Boolean
        }
    }
);
const Moniteur = mongoose.model("moniteurs", MoniteurSchema); // User : class, 1/ collection(table)  // UserSchema : squelette

module.exports = Moniteur; // bch najmo nestaamlouha fi ay blasa okhra 