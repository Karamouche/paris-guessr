const initMap = () => {
	const paris = {lat: 48.856614, lng: 2.3522219};
	const zoom = 12;

	const map = L.map("mapmain").setView([paris.lat, paris.lng], zoom);
	const mainLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		minZoom: zoom,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});
	mainLayer.addTo(map);
	return map;
}

const onMapClick = ({map, e}) => {
	map.eachLayer((layer) => {
		if (layer instanceof L.Marker) {
			map.removeLayer(layer);
		}
	});
	const marker = L.marker(e.latlng).addTo(map);
}

const main = () => {
	const map = initMap();
	map.on('click', (e) => onMapClick({map, e}));
};

main();