const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const port = 3000;
const app = express();

// Database

const users = [{
    name: 'Lisa',
    password: 'marsvinstok123'
}];

app.use(express.json());

app.use(cookieSession({
    name: 'session',
    secret: 'sdkjhfougihiu4hc4562',
    secure: false,
    maxAge: 1000 * 100,
    httpOnly: true
}));

app.post('/api/register', async(req,res) => {
    const { name, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    const user = {
        name,
        password: hashedPassword
    }
    users.push(user);

    res.status(201).json()
});

app.post('/api/login', async (req,res) => {
    const { name, password} = req.body;
    const user = users.find(u => u.name === name);

    // check if user or password is incorrect
    if(!user || !await bcrypt.compare(password, user.password)) {
        res.status(401).json("Incorrect password or username");
        return
    }
    // create session
    req.session.username = user.name;

    // send response
    res.status(204).json(null)
});

app.get('/api/users', secure, (req,res) => {
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


app.use(express.static('public'));

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))