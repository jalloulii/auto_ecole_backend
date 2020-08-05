const express = require('express');

//pour indiquer la base de donnée eli bch yekhdm aliha
const mongoose = require('./../db/connect');

// importina leclass car : 


const isAdmin = require('../middlewares/middleware');
const RenderVousConduite = require('../models/rendez_vous_conduite');
const User = require('../models/user');
const Monitor = require('../models/moniteur');
const Car = require('../models/vehicule');
const app = express();
// BEGIN function now date :
var today = new Date();
var dd = today.getDate();

var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}

if (mm < 10) {
    mm = '0' + mm;
}
today = yyyy + '-' + mm + '-' + dd;
// END function now date :
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
        let newConduiteMeets = [];
        let conduiteMeets = await RenderVousConduite.find({ date: { $gte: today } });
        for (var i = 0; i < conduiteMeets.length; i++) {
            let user = await User.findOne({ _id: conduiteMeets[i].userId });
            let monitor = await Monitor.findOne({ _id: conduiteMeets[i].monitorId });
            let car = await Car.findOne({ _id: conduiteMeets[i].carId });
            newConduiteMeets.push({
                _id: conduiteMeets[i]._id,
                date: conduiteMeets[i].date,
                temps: conduiteMeets[i].temps,
                userId: user.firstname + " " + user.lastname,
                monitorId: monitor.firstname + " " + monitor.lastname,
                carId: car.marque

            })
        }
        res.status(200).send(newConduiteMeets);
    } catch{
        res.status(400).send({ message: "ERROR !" });
    }

});
app.get('/all/passed', isAdmin, async (req, res) => {

    try {
        let newConduiteMeetsPASS = [];
        let conduiteMeetsP = await RenderVousConduite.find({ date: { $lt: today } });
        for (var i = 0; i < conduiteMeetsP.length; i++) {
            let user = await User.findOne({ _id: conduiteMeetsP[i].userId });
            let monitor = await Monitor.findOne({ _id: conduiteMeetsP[i].monitorId });
            let car = await Car.findOne({ _id: conduiteMeetsP[i].carId });
            newConduiteMeetsPASS.push({
                _id: conduiteMeetsP[i]._id,
                date: conduiteMeetsP[i].date,
                temps: conduiteMeetsP[i].temps,
                userId: user.firstname + " " + user.lastname,
                monitorId: monitor.firstname + " " + monitor.lastname,
                carId: car.marque

            })
        }
        res.status(200).send(newConduiteMeetsPASS);
    } catch{
        res.status(400).send({ message: "ERROR !" });
    }

});

app.get('/upcomingMeetUsers/:userId', async (req, res) => {

    try {
        let id = req.params.userId;
        let userconduiteIDS = await RenderVousConduite.find({ userId: id, date: { $gte: today } });
        res.status(200).send(userconduiteIDS);
    } catch (error) {
        res.status(400).send(error);
    }



})
app.get('/passedMeetUsers/:userId', async (req, res) => {

    try {
        let id = req.params.userId;
        let userconduiteIDS = await RenderVousConduite.find({ userId: id, date: { $lt: today } });
        res.status(200).send(userconduiteIDS);
    } catch (error) {
        res.status(400).send(error);
    }



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