import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Navigation, Phone, Clock, X, Loader, AlertCircle, Hospital } from 'lucide-react';
import hospitalService from '../services/hospitalService';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: -1.9403, // Kigali, Rwanda
  lng: 29.8739,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

function NearbyHospitals() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter(location);
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Showing default location.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  // Fetch hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setIsLoading(true);
        const result = await hospitalService.getAllHospitals();
        // Support both { status, data: [...] } and raw array responses
        const list = Array.isArray(result) ? result : (result?.data || []);
        
        // Transform hospital data to include coordinates
        const hospitalsWithCoords = list.map(hospital => ({
          ...hospital,
          // You'll need to geocode addresses or store lat/lng in the database
          // For now, using mock coordinates around Kigali
          position: {
            lat: -1.9403 + (Math.random() - 0.5) * 0.1,
            lng: 29.8739 + (Math.random() - 0.5) * 0.1,
          },
        }));
        
        setHospitals(hospitalsWithCoords);
        setError(null);
      } catch (err) {
        console.error('Error fetching hospitals:', err);
        setError('Failed to load hospitals. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(1);
  }, []);

  // Get hospitals sorted by distance
  const sortedHospitals = useCallback(() => {
    if (!userLocation) return hospitals;
    
    return [...hospitals].sort((a, b) => {
      const distA = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        a.position.lat,
        a.position.lng
      );
      const distB = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        b.position.lat,
        b.position.lng
      );
      return parseFloat(distA) - parseFloat(distB);
    });
  }, [hospitals, userLocation, calculateDistance]);

  const handleMarkerClick = (hospital) => {
    setSelectedHospital(hospital);
  };

  const handleGetDirections = (hospital) => {
    const destination = `${hospital.position.lat},${hospital.position.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
  };

  const handleCenterOnUser = () => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  };

  if (!user || user.role !== 'donor') {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <div className="relative mx-4 mt-6 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r from-red-700 via-rose-600 to-pink-600">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-10 -left-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Nearby Hospitals</h1>
            </div>
            <p className="text-rose-50/90 text-base md:text-lg">Find blood donation centers and hospitals near you</p>
          </div>
        </div>
      </div>

      {/* Location Error Banner */}
      {locationError && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center space-x-2 text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{locationError}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 gap-4">
        {/* Sidebar - Hospital List */}
        <div className="lg:w-96 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Hospital className="w-5 h-5 text-red-600" />
              <span>Hospitals ({hospitals.length})</span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-red-600 animate-spin" />
              </div>
            ) : error ? (
              <div className="p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-1">Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            ) : hospitals.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Hospital className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No hospitals found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {sortedHospitals().map((hospital) => {
                  const distance = userLocation
                    ? calculateDistance(
                        userLocation.lat,
                        userLocation.lng,
                        hospital.position.lat,
                        hospital.position.lng
                      )
                    : null;

                  return (
                    <div
                      key={hospital.id}
                      className={`p-4 cursor-pointer transition hover:bg-gray-50 ${
                        selectedHospital?.id === hospital.id ? 'bg-red-50' : ''
                      }`}
                      onClick={() => handleMarkerClick(hospital)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {hospital.hospitalName}
                        </h3>
                        {distance && (
                          <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                            {distance} km
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="line-clamp-1">{hospital.address || 'Address not available'}</span>
                        </div>
                        {hospital.phoneNumber && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span>{hospital.phoneNumber}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetDirections(hospital);
                        }}
                        className="mt-3 w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Get Directions</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden relative" style={{ minHeight: '500px' }}>
          {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
           import.meta.env.VITE_GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE' ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-8">
              <div className="text-center max-w-md">
                <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Google Maps API Key Required
                </h3>
                <p className="text-gray-600 mb-4">
                  To use the map feature, you need to add your Google Maps API key to the .env file.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
                  <p className="text-sm font-mono text-gray-700 mb-2">
                    VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
                  </p>
                  <a
                    href="https://console.cloud.google.com/google/maps-apis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Get API Key →
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <LoadScript
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              onLoad={() => setMapLoaded(true)}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={13}
                options={mapOptions}
              >
                {/* User Location Marker */}
                {userLocation && (
                  <Marker
                    position={userLocation}
                    icon={{
                      path: window.google?.maps?.SymbolPath?.CIRCLE,
                      scale: 8,
                      fillColor: '#3B82F6',
                      fillOpacity: 1,
                      strokeColor: '#FFFFFF',
                      strokeWeight: 2,
                    }}
                  />
                )}

                {/* Hospital Markers */}
                {hospitals.map((hospital) => (
                  <Marker
                    key={hospital.id}
                    position={hospital.position}
                    onClick={() => handleMarkerClick(hospital)}
                    icon={{
                      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                          <path d="M2 17l10 5 10-5"/>
                          <path d="M2 12l10 5 10-5"/>
                        </svg>
                      `),
                      scaledSize: new window.google.maps.Size(32, 32),
                    }}
                  />
                ))}

                {/* Info Window */}
                {selectedHospital && (
                  <InfoWindow
                    position={selectedHospital.position}
                    onCloseClick={() => setSelectedHospital(null)}
                  >
                    <div className="p-2 max-w-xs">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {selectedHospital.hospitalName}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{selectedHospital.address || 'Address not available'}</span>
                        </div>
                        {selectedHospital.phoneNumber && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span>{selectedHospital.phoneNumber}</span>
                          </div>
                        )}
                        {userLocation && (
                          <div className="flex items-center space-x-2 text-red-600 font-medium">
                            <Navigation className="w-4 h-4 flex-shrink-0" />
                            <span>
                              {calculateDistance(
                                userLocation.lat,
                                userLocation.lng,
                                selectedHospital.position.lat,
                                selectedHospital.position.lng
                              )} km away
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleGetDirections(selectedHospital)}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Get Directions</span>
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          )}

          {/* Center on User Button */}
          {userLocation && mapLoaded && (
            <button
              onClick={handleCenterOnUser}
              className="absolute bottom-6 right-6 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition border border-gray-200"
              title="Center on my location"
            >
              <Navigation className="w-5 h-5 text-red-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NearbyHospitals;
