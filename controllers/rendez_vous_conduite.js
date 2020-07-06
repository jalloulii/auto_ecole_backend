const express = require('express');

//pour indiquer la base de donnée eli bch yekhdm aliha
const mongoose = require('./../db/connect');

// importina leclass car : 


const isAdmin = require('../middlewares/middleware');
const RenderVousConduite = require('../models/rendez_vous_conduite');
const app = express();

app.post('/add', (req, res) => {

    let data = req.body;


    let rendez = new RenderVousConduite({

        date: data._date,
        temps: data._temps,
        userId: data._userId,
        monitorId: data._monitorId,
        carId: data._carId

    });

    rendez.save()
        .then(() => {
            res.status(200).send({ message: "rendez vouz conduite added succefully !" });
        })
        .catch((e) => {
            res.status(400).send(e);
        });
})
app.get('/all', isAdmin, async (req, res) => {

    try {
        let conduiteMeets = await RenderVousConduite.find()
    } catch{
        res.status(400).send({ message: "ERROR !" });
    }

});
app.get('/allUserConduitebyID/:userId', (req, res) => {
    let id = req.params.userId;
    RenderVousConduite.find({ userId: id }).then((userconduiteIDS) => {
        res.status(200).send(userconduiteIDS);
    }).catch(() => {
        res.status(400).send({ message: "error" });
    })

})
app.get('/allMonitorConduitebyID/:monitorId', (req, res) => {

    let id = req.params.monitorId;
    RenderVousConduite.find({ monitorId: id }).then((userconduiteIDS) => {
        res.status(200).send(userconduiteIDS);
    }).catch(() => {
        res.status(400).send({ message: "error" });
    })

})
app.get('/one/:idRendezvousConduite', isAdmin, (req, res) => {
    let id = req.params.idRendezvousConduite; // params w idUser ???????

    RenderVousConduite.findOne({ _id: id }).then((rendezVous) => {
        if (!rendezVous) {
            res.status(404).send({ message: "rendezVous conduite not found" });
        } else {
            res.status(200).send(rendezVous);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})
//DELETE
app.delete('/delete/:idRendezVousConduite', isAdmin, (req, res) => {
    let id = req.params.idRendezVousConduite;

    RenderVousConduite.findOneAndDelete({ _id: id }).then((rendezVous) => {
        if (!rendezVous) {
            res.status(404).send({ message: "rendezVous Conduite not found" });
        } else {
            res.status(200).send(rendezVous);
        }
    })
        .catch(() => {
            res.status(400).send({ message: "ERROR !" });
        });
})
app.patch('/update-form/:idRendezVousConduite', isAdmin, (req, res) => {
    let id = req.params.idRendezVousConduite;
    let data = req.body;

    // creation dun objet :
    let rendezVous = new RenderVousConduite({
        date: data._date,
        temps: data._temps,
        userId: data._userId,
        monitorId: data._monitorId,
        carId: data._carId,



    });
    RenderVousConduite.findOne({ _id: id })
        .then((rendez_vous) => {
            if (!rendez_vous) {
                res.status(400).send({ message: "rendez vous conduite not found" })
            } else {
                rendez_vous.date = rendezVous.date;
                rendez_vous.temps = rendezVous.temps;
                rendez_vous.userId = rendezVous.userId;
                rendez_vous.monitorId = rendezVous.monitorId;
                rendez_vous.carId = rendezVous.carId;
                rendez_vous.save();
                res.status(200).send({ message: "rendez vous conduite updated successfully" });
            }
        })
        .catch(() => {
            res.status(400).send({ message: "ERROR" });
        })

})
module.exports = app;