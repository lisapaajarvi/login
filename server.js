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
    maxAge: 1000 * 10,
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

app.post('/api/login', (req,res) => {});
app.get('/api/users', (req,res) => {
    res.json(users);
});
app.delete('/api/logout', (req,res) => {});


app.use(express.static('public'));

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))