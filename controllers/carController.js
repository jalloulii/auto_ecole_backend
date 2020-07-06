const express = require('express');

//pour indiquer la base de donnée eli bch yekhdm aliha
const mongoose = require('./../db/connect');

// importina leclass car : 


const Car = require('../models/vehicule');
const isAdmin = require('../middlewares/middleware');

const app = express();

app.get('/one/:idCar', isAdmin, (req, res) => {
    let id = req.params.idCar; // params w idUser ???????

    Car.findOne({ _id: id }).then((car) => {
        if (!car) {
            res.status(404).send({ message: "car not found" });
        } else {
            res.status(200).send(car);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})
app.post('/add', (req, res) => {

    let data = req.body;


    let car = new Car({
        matricule: data._matricule,
        marque: data._marque,
        couleur: data._couleur,

    });

    car.save()
        .then(() => {
            res.status(200).send({ message: "car added succefully !" });
        })
        .catch(() => {
            res.status(400).send({ message: "car unsuccessfully added :) !" });
        });
})
app.get('/get-all', (req, res) => {
    Car.find().then(cars => {
        res.status(200).send(cars);
    }).catch(() => {
        res.status(400).send({ message: "erroor" })
    })
})
//DELETE
app.delete('/delete/:idCar', isAdmin, (req, res) => {
    let id = req.params.idCar;

    Car.findOneAndDelete({ _id: id }).then((car) => {
        if (!car) {
            res.status(404).send({ message: "car not found" });
        } else {
            res.status(200).send(car);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})
app.patch('/update-form/:idCar', isAdmin, (req, res) => {
    let id = req.params.idCar;
    let data = req.body;

    // creation dun objet :
    let carUpdate = new Car({
        matricule: data._matricule,
        marque: data._marque,
        couleur: data._couleur,



    });
    Car.findOne({ _id: id })
        .then((car) => {
            if (!car) {
                res.status(400).send({ message: "car not found" })
            } else {
                car.matricule = carUpdate.matricule;
                car.marque = carUpdate.marque;
                car.couleur = carUpdate.couleur;

                car.save();
                res.status(200).send({ message: "car updated successfully" });
            }
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR" });
        })

})
module.exports = app;
// 5ef9edc42df0e8387058f52f