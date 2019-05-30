require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController');
const app = express()
const PORT = 4000;

const { CONNECTION_STRING, SESSION_SECRET } = process.env;

app.use(express.json());

app.use(
    session({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: false
    })


)

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('db connected');
})
//login
app.post("/auth/register", authCtrl.register);
app.post("/auth/login", authCtrl.login);
app.get("/auth/logout", authCtrl.logout);

//see dragon's treasure
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', treasureCtrl.getUserTreasure);


app.listen(PORT, () => console.log(`Listening on port${PORT}`));