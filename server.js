const express = require('express');
const fs = require('fs');
const path = require('path');
const monument = require('./public/js/monumentsBack.js');

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/public", express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
	const indexhtml = fs.readFileSync(__dirname+'/index.html', 'utf8');
	res.send(indexhtml);
});

//recieve post /monument
//send random monument
app.post('/newMonument', (req, res) => {
	res.send(monument.randomMonument());
});

app.listen(PORT, () => {
	console.log("##############")
	console.log("Server hosting locally on localhost:3000");
});

