const R = require('ramda');
const fs = require('fs');

const monumentsInfo = R.pipe(
	R.prop('records'),
	R.map(R.prop('fields')),
	R.map(R.pick(['nom_carto', 'adresse', 'arrondissement', 'geo_point_2d']))
);

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
	monumentsInfo,
	R.filter(R.prop('nom_carto'))
);

//get a random monument object from the list with ramda
const pickRandom = (list) => {
	const index = Math.floor(Math.random() * R.length(list));
	return R.nth(index, list);
}

const randomMonument = R.pipe(
	monumentsList,
	pickRandom
);

//pick images from random monument and add

const main = () => {
	const dataPath = __dirname+'/data/famousParisMonuments.json';
	const monument = monumentsList(dataPath);
	//save the monument to a file
	fs.writeFileSync(__dirname+'/data/monument.json', JSON.stringify(monument));
};

main();
