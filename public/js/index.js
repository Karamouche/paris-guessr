const R = require('ramda');
const fs = require('fs');

const getMonumentsInfo = R.pipe(
	R.prop('records'),
	R.map(R.prop('fields')),
	R.map(R.pick(['nom_carto', 'adresse', 'arrondissement', 'geo_point_2d']))
);

const getMonumentToString = R.pipe(
	R.values,
	R.join(' - ')
);

const getMonumentsToString = R.pipe(
	R.map(getMonumentToString),
	R.join('\n')
);

const main = () => {
	const famousParisMonumentsData = fs.readFileSync(__dirname+'/data/famousParisMonuments.json');
	const famousParisMonuments = getMonumentsInfo(JSON.parse(famousParisMonumentsData.toString()));
	console.log(getMonumentsToString(famousParisMonuments));
};

main();
