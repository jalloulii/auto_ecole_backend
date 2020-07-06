const express = require('express');
//pour indiquer la base de donnée eli bch yekhdm aliha
const mongoose = require('./../db/connect');
const bcrypt = require('bcryptjs');
// importina leclass user : 
const Admin = require('./../models/user');


const app = express();

app.post('/register', (req, res) => {

    let data = req.body;
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(data._password, salt);
    let user = new Admin({
        firstname: data._firstname,
        lastname: data._lastname,
        email: data._email,
        phone: data._phone,
        password: hashedPassword,
        role: "admin",
        etat: true
    });
    user.save()
        .then(() => {
            res.status(200).send({ message: "admin registred succefully !" });
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR admin register !" });
        });
});


module.exports = app;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZmM1YjYxZTdjNjM0MzMzODc3ZDg1NiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTU5MzU5Nzc2MX0.jdfHbfhQdamo6durss8gOI0nz7hkASxYd_VqZx4Nd1k