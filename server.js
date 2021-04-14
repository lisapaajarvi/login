const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const port = 3000;
const app = express();

// Database

const users = [];

app.use(express.json());

app.use(cookieSession({
    name: 'session',
    secret: 'sdkjhfougihiu4hc4562',
    secure: false,
    maxAge: 1000 * 100,
    httpOnly: true
}));

app.post('/api/register', async(req,res) => {
    const { name, password, role } = req.body;

    // check if user exists
    const existingUser = users.find(u => u.name === name);
    if(existingUser) {
        res.status(400).json("Username already exists")
        return
    }

    // hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    const user = {
        name,
        password: hashedPassword,
        role
    }
    users.push(user);
    res.status(201).json()
});

app.post('/api/login', async (req,res) => {
    const { name, password } = req.body;
    const user = users.find(u => u.name === name);

    // check if user or password is incorrect
    if(!user || !await bcrypt.compare(password, user.password)) {
        res.status(401).json("Incorrect password or username");
        return
    }
    // create session
    req.session.username = user.name;
    req.session.role = user.role;

    // send response
    res.status(204).json(null)
});

app.get('/api/users', secureWithRole, (req,res) => {
    res.json(users);
});

app.delete('/api/logout', (req,res) => {
    req.session = null;
    res.status(200).json('Logout successful');
});


// helper middleware for secure endpoints

function secure (req, res, next) {
    if(req.session.username) {
        next()
    }
    else {
        res.status(401).json("You must log in first!")
    }
}

 function secureWithRole(role) {
     return [secure, (req, res, next) => {
         if(req.session.role === role) {
             next()
         }
         else {
             res.status(403).json("You don't have the specific rights to access this route");
         }
     }]
}

//app.use(express.static('public'));

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))