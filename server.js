const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = 3000;

app.use("/public", express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
	const indexhtml = fs.readFileSync(__dirname+'/index.html', 'utf8');
	res.send(indexhtml);
});


app.listen(PORT, () => {
	console.log("##############")
	console.log("Server hosting locally on localhost:3000");
});

