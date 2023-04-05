const R = require('ramda');
const fs = require('fs');


const monumentToString = R.pipe(
	R.values,
	R.join(' - ')
);

const monumentsToString = R.pipe(
	R.map(monumentToString),
	R.join('\n')
);

const monumentsList = R.pipe(
	fs.readFileSync,
	JSON.parse,
	R.filter(R.prop('nom_carto'))
);

//get a random monument object from the list with ramda
const pickRandom = (list) => {
	const index = Math.floor(Math.random() * R.length(list));
	return R.nth(index, list);
}

const randomMonument = () => {
	const list = monumentsList(__dirname+'/data/monuments.json');
	return pickRandom(list);
}

module.exports = {
	randomMonument,
};