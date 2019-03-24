const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const login = require('./controllers/login.js');
const signup = require('./controllers/signup.js');
const card = require('./controllers/card.js');
const account = require('./controllers/account.js');

const db = knex({
	client:'pg',
	connection: {
        host : process.env.DATABASE_URL,
        ssl: true,
	}
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

db.select('*').from('card').then(data => {
    console.log(data);
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('this is working');
})

app.post('/update_profile', (req, res) =>{account.handleUpdateProfile(req, res, db)});
app.post('/get_user_cards', (req, res) =>{card.handleGetUserCard(req, res, db)});
app.post('/get_cheapest_cards', (req, res) =>{card.handleGetCheapestCards(req, res, db)});
app.post('/get_cards_by_menu', (req, res) =>{card.handleGetCardsByTheMenu(req, res, db)});
app.post('/get_cards_by_name', (req, res) =>{card.handleGetCardsByName(req, res, db)});
app.post('/login', (req, res) =>{login.handleLogin(req, res, db, bcrypt)});
app.post('/signup', (req, res) =>{signup.handleSignup(req, res, db, bcrypt)});
app.post('/addcard', (req, res) => {card.handleAddcard(req, res, db)});
app.put('/updatecard', (req, res) => {card.handleUpdatecard(req, res, db)});
app.delete('/deletecard', (req,res) => {card.handleDeletecard(req, res, db)});

app.listen(process.env.PORT || 3001, () => {
    console.log('app is running on port 3001')
})