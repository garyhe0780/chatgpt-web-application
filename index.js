const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use('/', express.static(__dirname + '/client')); // Serves resources from client folder


// setup routes
require('./routes')(app)

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));
