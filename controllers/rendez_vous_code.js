const express = require('express');

//pour indiquer la base de donnée eli bch yekhdm aliha
const mongoose = require('./../db/connect');

// importina leclass car : 


const isAdmin = require('../middlewares/middleware');
const RenderVous = require('../models/rendez_vous_code');
const User = require('../models/user');

const app = express();
app.post('/add', (req, res) => {

    let data = req.body;


    let rendez = new RenderVous({

        date: data._date,
        temps: data._temps,
        userId: data._userId,

    });

    rendez.save()
        .then(() => {
            res.status(200).send({ message: "rendez vouz added succefully !" });
        })
        .catch((e) => {
            res.status(400).send({ message: "rendez vouz unsuccessfully added :) !" });
        });
})
app.get('/all', isAdmin, (req, res) => {
    RenderVous.find().then((rendez_vous) => {
        res.status(200).send(rendez_vous);
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
});

app.get('/allmeetUserCode/:userId', (req, res) => {
    let id = req.params.userId;
    RenderVous.find({ userId: id }).then((rendez_vous) => {
        res.status(200).send(rendez_vous);
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
});

app.get('/allmeetMonitorCode/:monitorId', (req, res) => {
    let id = req.params.monitorId;
    RenderVous.find({ monitorId: id }).then((rendez_vous) => {
        res.status(200).send(rendez_vous);
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
});


app.get('/allmeetconduite/:userId', (req, res) => {
    let id = req.params.userId;
    RenderVous.find({ userId: id }).then((meetconduite) => {
        res.status(200).send(meetconduite);
    }).catch(
        () => {
            res.status(400).send({ message: "error" });
        }
    );
})

app.get('/one/:idRendezvous', isAdmin, (req, res) => {
    let id = req.params.idRendezvous; // params w idUser ???????

    RenderVous.findOne({ _id: id }).then((rendezVous) => {
        if (!rendezVous) {
            res.status(404).send({ message: "rendezVous not found" });
        } else {
            res.status(200).send(rendezVous);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})
//DELETE
app.delete('/delete/:idRendezVous', isAdmin, (req, res) => {
    let id = req.params.idRendezVous;

    RenderVous.findOneAndDelete({ _id: id }).then((rendezVous) => {
        if (!rendezVous) {
            res.status(404).send({ message: "rendezVous not found" });
        } else {
            res.status(200).send(rendezVous);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})
app.patch('/update-form/:idRendezVous', isAdmin, (req, res) => {
    let id = req.params.idRendezVous;
    let data = req.body;

    // creation dun objet :
    let rendezVous = new RenderVous({
        date: data._date,
        temps: data._temps,
        userId: data._userId,



    });
    RenderVous.findOne({ _id: id })
        .then((rendez_vous) => {
            if (!rendez_vous) {
                res.status(400).send({ message: "rendez_vous not found" })
            } else {
                rendez_vous.date = rendezVous.date;
                rendez_vous.temps = rendezVous.temps;
                rendez_vous.userId = rendezVous.userId;

                rendez_vous.save();
                res.status(200).send({ message: "rendez_vous updated successfully" });
            }
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR" });
        })

})
module.exports = app;