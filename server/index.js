require('dotenv').config({path: '/Users/Stelou/PROJETS JS/REACT/sav-connect-server/.env'});
const express = require ('express');
const session = require ('express-session');
const bodyParser = require('body-parser');
const router = require ('./routes/router');
const cors = require ('cors');

//Initialize express
const app = express();


const corsMiddleware = require('./middlewares/corsMiddleware');
app.use(corsMiddleware);
app.use(express.json());


// initialize session with express
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: true, 
    saveUninitialized: true, 
    cookie: { 
    secure: false,
    maxAge: (1000*60*60*24*30*12)
  }
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// USE ROUTER IMPORT
app.use(router);

app.use((req, res) => {
  return res.send({"404": "Not Found"});
})

const PORT = process.env.PORT || 9090;


app.listen(9090, () => {
    console.log(`Serveur started on http://localhost:${PORT}`);
});