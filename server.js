const express = require('express');
const cookieSession = require('cookie-session');
const port = 3000;
const app = express();

app.post('/api/register', (req,res) => {});
app.post('/api/login', (req,res) => {});
app.get('/api/users', (req,res) => {});
app.delete('/api/logout', (req,res) => {});


app.use(express.static('public'));

app.use(express.json());

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`))