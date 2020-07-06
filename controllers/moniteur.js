const express = require('express');
const jwk = require('jsonwebtoken');
//pour indiquer la base de donnée eli bch yekhdm aliha
const mongoose = require('./../db/connect');
const bcrypt = require('bcryptjs');
// importina leclass user : 
const Moniteur = require('./../models/moniteur');
const isAdmin = require('../middlewares/middleware');


const app = express();

//POST
/* 
app.post('/add',  (req, res) => {
    //1 - nekhou les données
    let data = req.body;
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(data._password, salt);
    //2 - creation d'un object <= data
    let moniteur = new Moniteur({
        firstname: data._firstname,
        lastname: data._lastname,
        email: data._email,
        phone: data._phone,
        password: hashedPassword,
        role: "moniteur",
        etat: false
    });
    console.log(moniteur);
    moniteur.save()
        .then(() => {
            res.status(200).send({ message: "moniteur registred succefully !" });
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR moniteur register !" });
        });
});
*/

app.post('/register', (req, res) => {
    //1 - nekhou les données
    let data = req.body;

    let salt = bcrypt.genSaltSync(10);
    let hashedpassword = bcrypt.hashSync(data._password, salt);

    //2 - creation d'un object <= data
    let moniteur = new Moniteur({
        firstname: data._firstname,
        lastname: data._lastname,
        email: data._email,
        phone: data._phone,
        password: hashedpassword,
        role: "monitor",
        etat: false
    });
    console.log(moniteur);
    moniteur.save()
        .then(() => {
            res.status(200).send({ message: "moniteur registred succefully !" });
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});



app.post('/login', (req, res) => {
    let email = req.body._email;
    let password = req.body._password;
    console.log(email, password);
    Moniteur.findOne({ email: email }).then((admin) => {
        if (!admin) {
            res.status(404).send({ message: "email incorrect" });

        } else {
            let compare = bcrypt.compareSync(password, admin.password);
            if (!compare) {
                res.status(404).send({ message: "password incorrect" });
            } else {
                //JSON WEB TOKEN - jsonwebtoken 
                let obj = {
                    id: admin._id,
                    role: admin.role,
                }
                let myToken = jwk.sign(obj, "MyPrivateKey");
                res.status(200).send({ token: myToken });
            }
        }
    }).catch(() => {
        res.status(400).send({ message: "ERROR admin login !" });
    });
})
//GET


app.get('/all', isAdmin, (req, res) => {
    Moniteur.find({ role: "monitor" }).then((moniteurs) => {
        res.status(200).send(moniteurs);
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
});

app.get('/one/:idUser', isAdmin, (req, res) => {
    let id = req.params.idUser; // params w idUser ???????

    Moniteur.findOne({ role: "monitor", _id: id }).then((moniteur) => {
        if (!moniteur) {
            res.status(404).send({ message: "moniteur not found" });
        } else {
            res.status(200).send(moniteur);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})

//DELETE
app.delete('/delete/:idmoniteur', isAdmin, (req, res) => {
    let id = req.params.idmoniteur;

    Moniteur.findOneAndDelete({ role: "monitor", _id: id }).then((moniteur) => {
        if (!moniteur) {
            res.status(404).send({ message: "moniteur not found" });
        } else {
            res.status(200).send(moniteur);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})
//PATCH 
app.patch('/update-state/:idmoniteur', isAdmin, (req, res) => {
    let id = req.params.idmoniteur;

    Moniteur.findOne({ role: "monitor", _id: id }).then((moniteur) => {
        if (!moniteur) {
            res.status(404).send({ message: "moniteur not found" });
        } else {
            moniteur.etat = !moniteur.etat;
            moniteur.save();
            res.status(200).send({ message: "moniteur Account state updated !! " });
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})
app.patch('/update-form/:idMonitor', isAdmin, (req, res) => {
    let id = req.params.idMonitor;
    let data = req.body;

    // creation dun objet :
    let monitorUpdate = new Moniteur({
        firstname: data._firstname,
        lastname: data._lastname,
        phone: data._phone,
        email: data._email,


    });
    Moniteur.findOne({ _id: id })
        .then((monitor) => {
            if (!monitor) {
                res.status(400).send({ message: "monitor not found" })
            } else {
                monitor.firstname = monitorUpdate.firstname;
                monitor.lastname = monitorUpdate.lastname;
                monitor.phone = monitorUpdate.phone;
                monitor.email = monitorUpdate.email;
                monitor.save();
                res.status(200).send({ message: "monitor updated successfully" });
            }
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR" });
        })

})
module.exports = app;