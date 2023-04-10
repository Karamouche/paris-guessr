const initMap = () => {
	const map = L.map("mapmain");
	map.center = [48.856614, 2.3522219]; //Paris center location
	map.zoom = 12;
	map.setView(map.center, map.zoom);
	//set max bound of map to paris area only with a margin
	map.setMaxBounds([
		[48.75, 2.15],
		[48.95, 2.55]
	]);

	//Differents map layers
	const mainLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		minZoom: map.zoom,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});
	const CartoDB_VoyagerNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		minZoom: map.zoom
	});
	const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri',
		mineZoom: map.zoom
	});


	mainLayer.addTo(map);

	const mapContainer = $('#mapcontainer');

	//observer to detect map container resize
	const resizeObserver = new ResizeObserver(() => {
		map.invalidateSize();
	});
	resizeObserver.observe(mapContainer[0]);

	return map;
}

const onMapClick = ({map, e}) => {
	map.eachLayer((layer) => {
		if (layer instanceof L.Marker) {
			map.removeLayer(layer);
		}
	});
	L.marker(e.latlng).addTo(map);
}


const newGame = () => {
	$.post('/newgame', (data) => {
		$('#sliderimage').attr('src', data[0]['pics'][0]);
		saveDataInWindow(data);
	});
	window.sessionStorage.setItem('index', '0');
	window.sessionStorage.setItem('score', '0');
}

const newRound = () => {
	//TODO use jose to crypt data
	const index = Number(window.sessionStorage.getItem('index')) + 1;
	if (index === 10){
		//TODO send score to server
		//TODO show score
		//TODO show end game screen
		alert('Fin de la partie ! Votre score est de ' + window.sessionStorage.getItem('score') + '/1000 points !');
		$('#mapmain').hide();
		$('#mapcontainer').removeClass('hoverenabled');
		$('#guessbutton').text('Play');
	}else {
		window.sessionStorage.setItem('index', index.toString());
		const monumentsList = JSON.parse(window.sessionStorage.getItem('monuments'));
		$('#sliderimage').attr('src', monumentsList[index]['pics'][0]);
	}
}

const saveDataInWindow = (data) => {
	window.sessionStorage.setItem('monuments', JSON.stringify(data));
}

function calculateScore(distance) {
	if (distance <= 500) {
		return 100;
	}else if (distance >= 5000) {
		return 0;
	}else{
		return 100 - (distance - 500) / 45;
	}
}

const onGuessClick = ({map, e}) => {
	if(e.target.innerText === 'Play'){
		//show map
		$('#mapmain').show();
		//change text of button
		e.target.innerText = 'Guess';
		$('#mapcontainer').addClass('hoverenabled');
		//send POST to server to get random monument
		newGame();

	}else {
		let marker;
		map.eachLayer((layer) => {
			if (layer instanceof L.Marker) {
				marker = layer;
			}
		});
		if (marker) {
			const markerCoords = marker.getLatLng();
			map.removeLayer(marker);
			const monumentsList = JSON.parse(window.sessionStorage.getItem('monuments'));
			const index = window.sessionStorage.getItem('index');
			const monument = monumentsList[index];
			const monumentCoords = monument['geo_point_2d'];
			const monumentName = monument['nom_carto'];

			const distance = Math.round(markerCoords.distanceTo(monumentCoords));
			const scoreMake = Math.round(calculateScore(distance));
			if (scoreMake === 0) {
				alert('You are too far from the monument.\n' +
					'The monument was '+monumentName+'\n'+
					'You make 0 points');
			}else{
				alert(`You are ${distance} meters from the monument.\nThe monument was ${monumentName}.\nYou make ${scoreMake} points`);
			}
			const score = Number(window.sessionStorage.getItem('score')) + scoreMake;
			window.sessionStorage.setItem('score', score.toString());
			newRound();
		}
	}
}

const main = () => {
	const map = initMap();
	map.on('click', (e) => onMapClick({map, e}));
	map.on('keypress', (e) => { //reset map view when press 'r'
		if (e.originalEvent.key === 'r') {
			map.eachLayer((layer) => {
				if (layer instanceof L.Marker) {
					map.setView(layer.getLatLng());
				}else{
					map.setView(map.center);
				}
			});
		}
	});
	const guessButton = $('#guessbutton');
	const mapContainer = $('#mapcontainer');
	guessButton.on('click', (e) => onGuessClick({map, e}));
	guessButton.text('Play');
	$('#mapmain').hide();
	window.onbeforeunload = () => {
		window.sessionStorage.clear();
	}
};

