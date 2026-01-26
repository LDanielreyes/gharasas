import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Changed to full path
import 'leaflet-routing-machine';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const RedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const GharaIcon = new L.Icon({
    iconUrl: '/media/logo-azul-ghara.svg', // Local logo
    iconSize: [50, 50], // Adjusted size for logo
    iconAnchor: [25, 25],
    popupAnchor: [0, -25],
    className: 'bg-white rounded-full p-1 shadow-lg border-2 border-[#0C4D89]' // Add some styling to the logo icon
});

// Routing Component
const RoutingMachine = ({ userLocation, destination }) => {
    const map = useMap();
    const routingControlRef = React.useRef(null);

    useEffect(() => {
        if (!userLocation || !destination) return;

        // Cleanup existing control if it exists (safety check)
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
            routingControlRef.current = null;
        }

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(userLocation[0], userLocation[1]),
                L.latLng(destination[0], destination[1])
            ],
            routeWhileDragging: false,
            showAlternatives: false,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [{ color: '#0C4D89', weight: 6 }]
            },
            createMarker: function (i, waypoint) {
                // i = 0 is start (User), i = n-1 is end (Ghara)
                if (i === 0) {
                    return L.marker(waypoint.latLng, { icon: RedIcon }).bindPopup("<b>Tu Ubicación</b>");
                }
                return L.marker(waypoint.latLng, { icon: GharaIcon }).bindPopup("<b>Ghara HQ</b>");
            },
            addWaypoints: false,
            draggableWaypoints: false,
            language: 'es', // Localize instructions to Spanish
        });

        routingControl.addTo(map);
        routingControlRef.current = routingControl;

        return () => {
            if (routingControlRef.current) {
                try {
                    map.removeControl(routingControlRef.current);
                } catch (e) {
                    // Ignore errors during cleanup if map is already destroyed
                    console.warn("Error removing routing control:", e);
                }
                routingControlRef.current = null;
            }
        };
    }, [map, userLocation, destination]);

    return null;
};

// Component to handle map center updates
const ChangeView = ({ center }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
};

const LocationMap = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [activeLocation, setActiveLocation] = useState('barranquilla');

    const locations = {
        barranquilla: {
            coords: [10.976843956774486, -74.80834662359939],
            name: "Ghara Barranquilla",
            address: "Cra. 27 #68b-105, Suroccidente, Barranquilla, Atlántico"
        },
        cartagena: {
            coords: [10.3708, -75.4623], // Coords for El Campestre roughly
            name: "Ghara Cartagena",
            address: "Barrio el Campestre, Mz 62 Lt 11 etapa 7, Cartagena, Bolívar"
        }
    };

    const currentLocation = locations[activeLocation];

    const handleGetDirections = () => {
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Set state to trigger the RoutingMachine component
                setUserLocation([latitude, longitude]);
            },
            () => {
                alert("No pudimos obtener tu ubicación. Por favor permite el acceso a la ubicación.");
            }
        );
    };

    return (
        <section className="py-24 bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 relative z-10">
            {/* Custom Styles for Routing Machine text */}
            <style>{`
                .leaflet-routing-container, .leaflet-routing-alt {
                    color: #0C4D89 !important;
                    font-family: 'Outfit', sans-serif;
                }
                .leaflet-routing-container h2, .leaflet-routing-container h3 {
                    color: #0C4D89 !important;
                    font-weight: 700;
                }
                .leaflet-routing-alt tr:hover {
                    background-color: rgba(12, 77, 137, 0.1) !important;
                    cursor: pointer;
                }
            `}</style>
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="pl-0 lg:pl-10 space-y-8"
                    >
                        <div>
                            <h2 className="font-display font-bold text-5xl text-[#0C4D89] mb-4">Visita nuestra sede</h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                                Ven a nuestro centro de operaciones para asesorarte y ver nuestro stock en vivo.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
                            {/* Barranquilla */}
                            <div
                                onClick={() => setActiveLocation('barranquilla')}
                                className={`flex items-start gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors p-4 rounded-xl ${activeLocation === 'barranquilla' ? 'bg-slate-50 dark:bg-slate-800/50 ring-1 ring-[#0C4D89]/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                            >
                                <div className={`p-3 rounded-full transition-colors ${activeLocation === 'barranquilla' ? 'bg-[#0C4D89] text-white shadow-md' : 'bg-[#0C4D89]/10 text-[#0C4D89]'}`}>
                                    <span className="material-symbols-outlined text-3xl">location_on</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                                        Ghara Barranquilla
                                        {activeLocation === 'barranquilla' && <span className="text-xs bg-[#0C4D89] text-white px-2 py-0.5 rounded-full">Activa</span>}
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-400 font-body">Cra. 27 #68b-105, Suroccidente<br />Barranquilla, Atlántico</p>
                                </div>
                            </div>

                            {/* Cartagena */}
                            <div
                                onClick={() => setActiveLocation('cartagena')}
                                className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors ${activeLocation === 'cartagena' ? 'bg-slate-50 dark:bg-slate-800/50 ring-1 ring-[#0C4D89]/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                            >
                                <div className={`p-3 rounded-full transition-colors ${activeLocation === 'cartagena' ? 'bg-[#0C4D89] text-white shadow-md' : 'bg-[#0C4D89]/10 text-[#0C4D89]'}`}>
                                    <span className="material-symbols-outlined text-3xl">location_on</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                                        Ghara Cartagena
                                        {activeLocation === 'cartagena' && <span className="text-xs bg-[#0C4D89] text-white px-2 py-0.5 rounded-full">Activa</span>}
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-400 font-body">Barrio el Campestre<br />Mz 62 Lt 11 etapa 7<br />Cartagena, Bolívar</p>
                                </div>
                            </div>

                            <button
                                onClick={handleGetDirections}
                                className="w-full bg-[#0C4D89] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#2678A4] transition-all shadow-lg hover:shadow-[#0C4D89]/30 flex items-center justify-center gap-3 active:scale-95"
                            >
                                <span className="material-symbols-outlined">near_me</span>
                                Trazar Ruta a {activeLocation === 'barranquilla' ? 'Barranquilla' : 'Cartagena'}
                            </button>
                            <p className="text-xs text-center mt-4 text-slate-400">
                                *Te pediremos acceso a tu ubicación para calcular la ruta
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="h-[500px] w-full bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 relative z-0"
                    >
                        <MapContainer
                            center={currentLocation.coords}
                            zoom={15}
                            scrollWheelZoom={false}
                            style={{ height: "100%", width: "100%", zIndex: 0 }}
                            key={activeLocation} // Added key to force re-render on location change
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* Visual Logic Components */}
                            <ChangeView center={userLocation || currentLocation.coords} />
                            {userLocation && <RoutingMachine userLocation={userLocation} destination={currentLocation.coords} />}

                            <Marker position={currentLocation.coords} icon={GharaIcon}>
                                <Popup>
                                    <div className="text-center">
                                        <b className="text-[#0C4D89]">{currentLocation.name}</b><br />
                                        {activeLocation === 'barranquilla' ? 'Barranquilla' : 'Cartagena'}
                                    </div>
                                </Popup>
                            </Marker>

                            {userLocation && (
                                <Marker position={userLocation} icon={RedIcon}>
                                    <Popup>Tu ubicación actual</Popup>
                                </Marker>
                            )}
                        </MapContainer>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LocationMap;
