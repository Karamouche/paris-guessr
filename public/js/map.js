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
	window.sessionStorage.setItem('index', '-1');
	window.sessionStorage.setItem('score', '0');
	newRound();
}

const newRound = () => {
	//use jose to crypt data
	const index = Number(window.sessionStorage.getItem('index')) + 1;
	window.sessionStorage.setItem('index', index.toString());
	const monumentsList = JSON.parse(window.sessionStorage.getItem('monuments'));
	$('#sliderimage').attr('src', monumentsList[index]['pics'][0]);
}

const saveDataInWindow = (data) => {
	window.sessionStorage.setItem('monuments', JSON.stringify(data));
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
			console.log(marker.getLatLng());
			map.removeLayer(marker);
			$.post('/guess', {lat: marker.getLatLng().lat, lng: marker.getLatLng().lng}, (data) => {
				console.log(data);
				if (data) {
					console.log("The monument location is correct");
					newRound();
				}else{
					console.log("The monument location is incorrect");
				}
			});
			console.log("Remove marker and next monument");
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

main();
