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
	const mainLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		minZoom: map.zoom,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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

const onGuessClick = ({map, e}) => {
	let marker;
	map.eachLayer((layer) => {
		if (layer instanceof L.Marker) {
			marker = layer;
		}
	});
	if (marker) {
		console.log(marker.getLatLng());
	}
}

const main = () => {
	const map = initMap();
	map.on('click', (e) => onMapClick({map, e}));
	map.on('keypress', (e) => {
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
	$('#guessbutton').on('click', (e) => onGuessClick({map, e}));
};

main();
