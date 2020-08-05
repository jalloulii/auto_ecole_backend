const express = require('express');

//pour indiquer la base de donnée eli bch yekhdm aliha
const mongoose = require('./../db/connect');

// importina leclass car : 


const isAdmin = require('../middlewares/middleware');
const RenderVous = require('../models/rendez_vous_code');
const User = require('../models/user');

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




app.get('/all/UPCOMING', isAdmin, async (req, res) => {


    try {
        newTabCodeMeetsUP = [];
        let codeMeetsUP = await RenderVous.find({ date: { $gte: today } });
        for (var i = 0; i < codeMeetsUP.length; i++) {
            let user = await User.findOne({ _id: codeMeetsUP[i].userId });
            newTabCodeMeetsUP.push({
                _id: codeMeetsUP[i]._id,
                date: codeMeetsUP[i].date,
                temps: codeMeetsUP[i].temps,
                userId: user.firstname + " " + user.lastname,


            })
        }
        res.status(200).send(newTabCodeMeetsUP);
    } catch (error) {
        res.status(400).send(error);
    }

});
app.get('/all/PASSED', isAdmin, async (req, res) => {


    try {
        newTabCodeMeetsPA = [];
        let codeMeetsPA = await RenderVous.find({ date: { $lt: today } });
        for (var i = 0; i < codeMeetsPA.length; i++) {
            let user = await User.findOne({ _id: codeMeetsPA[i].userId });
            newTabCodeMeetsPA.push({
                _id: codeMeetsPA[i]._id,
                date: codeMeetsPA[i].date,
                temps: codeMeetsPA[i].temps,
                userId: user.firstname + " " + user.lastname,


            })
        }
        res.status(200).send(newTabCodeMeetsPA);
    } catch (error) {
        res.status(400).send(error);
    }

});
app.get('/allmeetUserCodeUPCOMING/:userId', async (req, res) => {

    try {
        let id = req.params.userId;
        let rendez_vous = await RenderVous.find({ userId: id, date: { $gte: today } });
        res.status(200).send(rendez_vous);
    } catch (error) {
        res.status(400).send(error);
    }

});
app.get('/allmeetUserCodePASSED/:userId', async (req, res) => {

    try {
        let id = req.params.userId;
        let rendez_vous = await RenderVous.find({ userId: id, date: { $lt: today } });
        res.status(200).send(rendez_vous);
    } catch (error) {
        res.status(400).send(error);
    }

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
    try {
        let id = req.params.userId;
        RenderVous.find({ userId: id })
        res.status(200).send(meetconduite);
    } catch (error) {
        res.status(400).send(error);

    }

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