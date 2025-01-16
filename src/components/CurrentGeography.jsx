import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Solución para el problema de iconos por defecto en Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [lastPosition, setLastPosition] = useState(null);

  // Fetch para obtener datos de longitud y latitud
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_URL_DATA_ESP ?? "http://localhost:6421/esp/data"); // Cambia por tu endpoint real
        if (!response.ok) throw new Error("Error al obtener las ubicaciones");
        const data = await response.json();

        setLocations(data); // Guarda todas las ubicaciones
        setLastPosition(data[data.length - 1]); // Selecciona la última posición
      } catch (error) {
        console.error("Error al cargar las ubicaciones:", error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div>
      {lastPosition ? (
        <MapContainer
          center={[lastPosition.latitude, lastPosition.longitude]} // Última posición
          zoom={15} // Nivel de zoom ajustado para detalles
          style={{ height: "680px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((loc, index) => (
            <Marker key={index} position={[loc.latitude, loc.longitude]}>
              <Popup>
                <div>
                  <strong>Ubicación:</strong> {loc.latitude}, {loc.longitude}
                  <br />
                  <strong>Fecha:</strong> {new Date(loc.registrationDate).toLocaleString()}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>Cargando mapa...</p>
      )}
    </div>
  );
};

export default MapComponent;
