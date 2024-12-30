import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const MapComponent = ({ location }) => {

  // יבוא האייקון של המרקר
  // נעזרתי מעט בגיפיטי

  const customIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // פונקציה לעדכון מרכז המפה
  // נעזרתי מעט בגיפיטי
  const UpdateMapCenter = ({ location }) => {
    const map = useMap(); // גישה למפה
    useEffect(() => {
      if (location) {
        map.setView([location.latitude, location.longitude], 13); // עדכון המרכז והזום
      }
    }, [location, map]);
    return null;
  };

  return (
    <div>
      {location && (
        <MapContainer
        // קאורדינציות
          center={[location.latitude, location.longitude]}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          <Marker
            icon={customIcon}
            position={[location.latitude, location.longitude]}
          >
            <Popup>!זהו המיקום</Popup>
          </Marker>
          <UpdateMapCenter location={location} />
        </MapContainer>
      )}
    </div>
  );
};

export default MapComponent;
