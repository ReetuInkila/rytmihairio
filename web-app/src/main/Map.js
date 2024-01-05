import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Component to return react leaflet map where route is drawn
 * @param {} gpx list of gpx pairs stored in lists
 * @returns Leaflet map
 */
function Map({gpx}) {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      {gpx.length > 0 && (
        <MapContainer center={gpx[0]} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Polyline positions={gpx} color="blue" weight={5} />
        </MapContainer>
      )}
    </div>
  );
}

export default Map;