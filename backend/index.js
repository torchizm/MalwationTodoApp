const env = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const database = require('./config/database')
const app = express();
const router = express.Router();
const apiRoutes = require('./routes/api');

env.config();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  	cookie: { maxAge: 1209600000 }
}));

app.use('/api', apiRoutes);

app.listen(process.env.NODE_DOCKER_PORT || 80, () => {
	console.log("App listening on port " + process.env.NODE_DOCKER_PORT);
});