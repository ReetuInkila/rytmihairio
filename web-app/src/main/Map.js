import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Map(props) {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      {props.gpx.length > 0 && (
        <MapContainer center={props.gpx[0]} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Polyline positions={props.gpx} color="blue" weight={5} />
        </MapContainer>
      )}
    </div>
  );
}

export default Map;