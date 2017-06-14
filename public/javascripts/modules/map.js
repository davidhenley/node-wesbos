import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: { lat: 43.2, lng: -79.8 },
  zoom: 8
};

const loadPlaces = (map, lat = 43.2, lng = -79.8) => {
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
    .then(({ data }) => {
      if (!data.length) {
        alert('No places found!');
        return;
      }

      // Create bounds
      const bounds = new google.maps.LatLngBounds();

      // Create info window
      const infoWindow = new google.maps.InfoWindow();

      const markers = data.map(place => {
        const [lng, lat] = place.location.coordinates;
        const position = { lat, lng };
        bounds.extend(position);
        const marker = new google.maps.Marker({
          map,
          position
        });
        marker.place = place;
        return marker;
      });

      // Show details onClick
      markers.forEach(marker => marker.addListener('click', function() {
        const html = `
          <div class="popup">
            <a href="/store/${this.place.slug}">
              <img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}">
              <p>${this.place.name} - ${this.place.location.address}</p>
            </a>
          </div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(map, this);
      }));

      // Zoom and center map to fit markers on bounds
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);
    });
};

const makeMap = (mapDiv) => {
  if (!mapDiv) return;

  // Make our map
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);

  // Make our autocomplete
  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
  });
};

export default makeMap;
