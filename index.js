const express = require('express');
const cors = require('cors');
const fs = require('fs');
//pour assurer que les données eli bch yjiw raw fi forat mou3ayna
const bodyParser = require('body-parser');
const User = require('./models/user');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const carController = require('./controllers/carController');
const moniteur = require('./controllers/moniteur');
const rendezVousCode = require('./controllers/rendez_vous_code');
const rendezVousConduite = require('./controllers/rendez_vous_conduite');

//connect-multiparty OU multer
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './public' });

const app = express();
//make public DIR accessible
app.use(express.static('public'));
//Accept Files
app.use(bodyParser.urlencoded({ extended: true }));


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


app.patch('/update-formPROFILE/:idUser', multipartMiddleware, (req, res) => {
    let data = JSON.parse(req.body.data);
    let id = req.params.idUser;
    if (req.files) {
        let path = req.files.image.path;
        const ext = path.substr(path.indexOf('.'));
        const newName = id;
        fs.renameSync(path, "public/" + newName + ext);

        // creation dun objet :
        let userUpdate = new User({
            firstname: data._firstname,
            lastname: data._lastname,
            phone: data._phone,
            email: data._email,
            image: newName + ext

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
                    user.image = userUpdate.image;
                    user.save();
                    res.status(200).send({ message: "user updated successfully" });
                }
            })
            .catch((e) => {
                res.status(400).send(e);
            })
    } else {
        res.status(400).send({ message: "ERROR" });
    }



})

let port = process.env.PORT || 3000
app.listen(port, () => console.log("server started")) // creation dun serveur local -- 3000 port serv -- ()=> function