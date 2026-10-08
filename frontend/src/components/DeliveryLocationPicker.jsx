import { useEffect } from "react";
import {
  useMap,
  useMapEvents,
  MapContainer,
  Marker,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultCenter = [11.5936, 37.3908];

const deliveryPinIcon = new L.Icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapClickHandler = ({ onSelect }) => {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
};

const MapViewUpdater = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.latitude, position.longitude], 16);
    }
  }, [map, position]);

  return null;
};

const DeliveryLocationPicker = ({ position, onSelect, label }) => (
  <div className="mt-3">
    <p className="mb-2 text-sm font-medium">{label}</p>
    <MapContainer
      center={position ? [position.latitude, position.longitude] : defaultCenter}
      zoom={13}
      scrollWheelZoom
      className="z-0 h-72 w-full rounded-xl border border-gray-300"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <MapViewUpdater position={position} />
      <MapClickHandler onSelect={onSelect} />
      {position && (
        <Marker
          position={[position.latitude, position.longitude]}
          icon={deliveryPinIcon}
        />
      )}
    </MapContainer>
  </div>
);

export default DeliveryLocationPicker;
