"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Fix untuk ikon marker default
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const mapContainerStyle = {
    height: "400px",
    width: "100%",
    borderRadius: "0.5rem",
    marginTop: "1rem",
};

const defaultCenter = { lat: -2.548926, lng: 118.0148634 };

// Komponen untuk mengubah view peta secara dinamis
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function LocationMarker({ onLocationChange, setPosition }) {
    useMapEvents({
        click(e) {
            const newPos = e.latlng;
            setPosition(newPos);
            
            fetch(`/geocode/reverse?lat=${newPos.lat}&lon=${newPos.lng}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error);
                    onLocationChange({ ...newPos, address: data.display_name || 'Alamat tidak ditemukan' });
                })
                .catch(error => {
                    console.error("Error fetching address: ", error);
                    onLocationChange({ ...newPos, address: 'Gagal mendapatkan alamat' });
                });
        },
    });
    return null; // Komponen ini tidak me-render apapun, hanya event handler
}

const MapPicker = ({ onLocationChange, initialPosition, isEditable = true }) => {
    const [position, setPosition] = useState(initialPosition);
    const [center, setCenter] = useState(initialPosition || defaultCenter);
    const [zoom, setZoom] = useState(initialPosition ? 13 : 5);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;
        setIsLoading(true);
        try {
            const response = await fetch(`/geocode/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setSearchResults(data);
        } catch (error) {
            console.error("Gagal mencari lokasi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectResult = (result) => {
        const newPos = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
        setPosition(newPos);
        setCenter(newPos);
        setZoom(13);
        setSearchResults([]);
        setSearchQuery(result.display_name);
        onLocationChange({ ...newPos, address: result.display_name });
    };

    if (!isClient) {
        return <div>Memuat peta...</div>;
    }
    
    return (
        <div>
            {isEditable && (
                <>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(e); }}
                            placeholder="Cari nama jalan, kota, atau tempat..."
                        />
                        <Button type="button" onClick={handleSearch} disabled={isLoading}>
                            {isLoading ? 'Mencari...' : 'Cari'}
                        </Button>
                    </div>

                    {searchResults.length > 0 && (
                        <ul className="border rounded-md mt-2 max-h-40 overflow-y-auto">
                            {searchResults.map(result => (
                                <li key={result.place_id} onClick={() => handleSelectResult(result)} className="p-2 cursor-pointer hover:bg-muted">
                                    {result.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}

            <MapContainer center={center} zoom={zoom} style={mapContainerStyle}>
                <ChangeView center={center} zoom={zoom} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {isEditable && <LocationMarker onLocationChange={onLocationChange} setPosition={setPosition} />}
                {position && <Marker position={position} />}
            </MapContainer>
        </div>
    );
};

export default MapPicker; 