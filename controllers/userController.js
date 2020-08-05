const express = require('express');
const jwk = require('jsonwebtoken');
//pour indiquer la base de donnée eli bch yekhdm aliha
const mongoose = require('./../db/connect');
const bcrypt = require('bcryptjs');
// importina leclass user : 
const User = require('./../models/user');
const isAdmin = require('../middlewares/middleware');



const app = express();


//POST
app.post('/register', (req, res) => {
    //1 - nekhou les données
    let data = req.body;
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(data._password, salt);
    //2 - creation d'un object <= data
    let user = new User({
        firstname: data._firstname,
        lastname: data._lastname,
        email: data._email,
        phone: data._phone,
        password: hashedPassword,
        role: "user",
        etat: false
    });
    console.log(user);
    user.save()
        .then(() => {
            res.status(200).send({ message: "User registred succefully !" });
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR User register !" });
        });
});
app.post('/login', (req, res) => {
    let email = req.body._email;
    let password = req.body._password;
    console.log(email, password);
    User.findOne({ email: email }).then((admin) => {
        if (!admin) {
            res.status(404).send({ message: "email incorrect" });

        } else {
            let compare = bcrypt.compareSync(password, admin.password);
            if (!compare) {
                res.status(404).send({ message: "password incorrect" });
            } else {
                if (!admin.etat) {
                    res.status(400).send({ message: "compte desactiver" })
                } else {
                    //JSON WEB TOKEN - jsonwebtoken 
                    let obj = {
                        id: admin._id,
                        role: admin.role,
                        etat: admin.etat,
                        firstname: admin.firstname + " " + admin.lastname,
                    }

                    let myToken = jwk.sign(obj, "MyPrivateKey");

                    res.status(200).send({ token: myToken });
                }

            }

        }
    }).catch(() => {
        res.status(400).send({ message: "ERROR admin login !" });
    });
})
//GET



app.get('/all', async (req, res) => {

    try {
        let users = await User.find({ role: "user" });
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({ message: "ERROR !" });
    }

});



app.get('/one/:idUser', isAdmin, async (req, res) => {
    // params w idUser ???????

    try {
        let id = req.params.idUser;
        User.findOne({ role: "user", _id: id })
        if (!user) {
            res.status(404).send({ message: "User not found" });
        } else {
            res.status(200).send(user);
        }
    } catch{
        res.status(400).send({ message: "ERROR !" });
    }

})


app.get('/profile/:idUser', async (req, res) => {
    // params w idUser ???????

    try {
        let id = req.params.idUser;
        let user = await User.findOne({ _id: id })
        if (!user) {
            res.status(404).send({ message: "User not found" });
        } else {
            res.status(200).send(user);
        }
    } catch (e) {
        res.status(400).send(e);
    }

})


//DELETE
app.delete('/delete/:idUser', isAdmin, (req, res) => {
    let id = req.params.idUser;

    User.findOneAndDelete({ role: "user", _id: id }).then((user) => {
        if (!user) {
            res.status(404).send({ message: "User not found" });
        } else {
            res.status(200).send(user);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})
//PATCH 
app.patch('/update-state/:idUser', isAdmin, (req, res) => {
    let id = req.params.idUser;

    User.findOne({ role: "user", _id: id }).then((user) => {
        if (!user) {
            res.status(404).send({ message: "User not found" });
        } else {
            user.etat = !user.etat;
            user.save();
            res.status(200).send({ message: "User Account state updated !! " });
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})

app.patch('/update-form/:idUser', isAdmin, (req, res) => {
    let id = req.params.idUser;
    let data = req.body;

    // creation dun objet :
    let userUpdate = new User({
        firstname: data._firstname,
        lastname: data._lastname,
        phone: data._phone,
        email: data._email,


    });
    User.findOne({ _id: id })
        .then((user) => {
            if (!user) {
                res.status(400).send({ message: "user not found" })
            } else {
                user.firstname = userUpdate.firstname;
                user.lastname = userUpdate.lastname;
                user.phone = userUpdate.phone;
                user.email = userUpdate.email;
                user.save();
                res.status(200).send({ message: "user updated successfully" });
            }
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR" });
        })

})





module.exports = app;