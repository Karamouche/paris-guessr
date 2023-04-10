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
const pickRandomFromList = (list) => {
	const index = Math.floor(Math.random() * R.length(list));
	return R.nth(index, list);
}

const randomMonument = (monumentNElement) => {
	const dataPath = __dirname+'/data/monuments.json';
	const listOfMonuments = monumentsList(dataPath);
	if (monumentNElement > R.length(listOfMonuments)) {
		throw new Error('monumentListLength is greater than the number of monuments');
	}
	//return a list of random monuments of length monumentListLength all unique
	return R.uniqWith(R.equals, R.times(() => pickRandomFromList(listOfMonuments), monumentNElement*2)).slice(0, monumentNElement);
}

module.exports = {
	randomMonument,
};