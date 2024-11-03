const express = require('express');
const path = require('path')

const app = express();

const port = process.env.port || 3030

// Set view engine and static folder
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/signup', (req, res) => {
    res.render("signup");
});

app.get('/about', (req, res) => {
    res.render("about");
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});