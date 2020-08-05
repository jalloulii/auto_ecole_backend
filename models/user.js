const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
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
        },
        image: {
            type: String,
            default: ""
        }
    }
);
const User = mongoose.model("user", UserSchema); // User : class, 1/ collection(table)  // UserSchema : squelette

module.exports = User; // bch najmo nestaamlouha fi ay blasa okhra 