const bcrypt = require('bcryptjs');

module.exports = {
    register:  async (req, res, next) => {
        const { username, password, isAdmin } = req.body;
        const db = req.app.get('db');
        //get db instance and use the await keyword to ensure that the promise resolves before the rest of the code executes.
        //will check the db if the username is already taken
        const result = await db.get_user([username])
        //SQL queries come back in an array, set username to the first item in arr [0]
        const existingUser = result[0];
        //if exitsing user already exists 
        if (existingUser) {
            //send a response with a message 'Username taken'
           return res.status(409).send('Username taken')
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const registeredUser = await db.register_user([isAdmin, username, hash])
        //first item in the registered user array will be set to a user var that creates a new user object
        const user = registeredUser[0];
        req.session.user = {
            isAdmin: user.is_admin,
            username: user.username,
            id: user.id
        }
        return res.status(201).send(req.session.user);
    },
    login: async (req, res, next) => {
        const { username, password } = req.body;
        //get the db instance using req.app.get('db) using the get_user SQL file and quuery the db for a username matching
        //the username from req.body. 
        const foundUser = await req.app.get('db').get_user([username])
        //set the first item in found user array to var user
        const user = foundUser[0]
        if (!user) {
            return res.status(401).send('User not found. Please register as a new user before loggin in')
        } 
        //method compares the password entered by the user at login to the has and salted version stored in the db
        const isAuthenticated = bcrypt.compareSync(password, user.hash)
        if (!isAuthenticated) {
            return res.status(403).send('Incorrect Password')
        }
        req.session.user = {
            isAdmin: user.is_admin,
            username: user.username,
            id: user.id
        }
         return res.status(200).send(req.session.user)
    },
    logout: (req, res, next) => {
        req.session.destroy();
        return res.sendStatus(200);
    }
}