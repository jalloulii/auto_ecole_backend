const express = require('express');
const cors = require('cors');

//pour assurer que les données eli bch yjiw raw fi forat mou3ayna
const bodyParser = require('body-parser');

const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const carController = require('./controllers/carController');
const moniteur = require('./controllers/moniteur');
const rendezVousCode = require('./controllers/rendez_vous_code');
const rendezVousConduite = require('./controllers/rendez_vous_conduite');



const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/user', userController);
app.use('/admin', adminController);
app.use('/car', carController);
app.use('/moniteur', moniteur);
app.use('/rendezvousCode', rendezVousCode);
app.use('/rendezvousConduite', rendezVousConduite);

app.get('/', (req, res) => {
    res.status(200).send({ message: "Welcome to the server !" });   // -- path ta web service (route) 
    //req : nmanipuliw bih les donner eli jeyin ml front 
    //res : nmanipuliw bih les donner eli nhebo nabathouhom lel front
});
let port = process.env.PORT || 3000
app.listen(port, () => console.log("server started")) // creation dun serveur local -- 3000 port serv -- ()=> function