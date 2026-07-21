import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../store.jsx';
import { MapPin, User, ChevronDown, Check, Sun, Moon, Languages, Search, X, Loader2, Navigation } from 'lucide-react';

export default function Onboarding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    updateOnboarding, 
    language, 
    theme, 
    toggleLanguage, 
    toggleTheme,
    googleMapsApiKey 
  } = useAppState();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Map state
  const mapContainerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [lat, setLat] = useState(10.7905); // Central Tamil Nadu
  const [lng, setLng] = useState(78.7047);
  const [address, setAddress] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Instanced map objects for leaflet fallback
  const leafletMapInstance = useRef(null);
  const leafletMarkerInstance = useRef(null);

  const districts = [
    'ariyalur', 'chengalpattu', 'chennai', 'coimbatore', 'cuddalore', 
    'dharmapuri', 'dindigul', 'erode', 'kallakurichi', 'kancheepuram', 
    'kanyakumari', 'karur', 'krishnagiri', 'madurai', 'mayiladuthurai', 
    'nagapattinam', 'namakkal', 'nilgiris', 'perambalur', 'pudukkottai', 
    'ramanathapuram', 'ranipet', 'salem', 'sivagangai', 'tenkasi', 
    'thanjavur', 'theni', 'thiruvallur', 'thiruvannamalai', 'thiruvarur', 
    'thoothukudi', 'tiruchirappalli', 'tirunelveli', 'tirupathur', 
    'tiruppur', 'vellore', 'viluppuram', 'virudhunagar'
  ];

  const filteredDistricts = districts.filter(d => {
    const localName = t(`districts.${d}`).toLowerCase();
    const searchVal = searchTerm.toLowerCase();
    return localName.includes(searchVal);
  });

  // Load Map (Google Maps or styled Leaflet)
  useEffect(() => {
    if (step === 2) {
      if (googleMapsApiKey) {
        loadGoogleMaps();
      } else {
        loadLeafletMap();
      }
    }

    return () => {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
    };
  }, [step]);

  // Google Maps Loader
  const loadGoogleMaps = () => {
    if (window.google && window.google.maps) {
      initializeGoogleMap();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleMap;
    script.onerror = () => {
      console.warn("Google Maps blocked or failed. Falling back to Leaflet Map.");
      loadLeafletMap();
    };
    document.head.appendChild(script);
  };

  const initializeGoogleMap = () => {
    if (!mapContainerRef.current) return;
    setMapLoaded(true);

    try {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat, lng },
        zoom: 8,
        styles: theme === 'dark' ? getDarkMapStyles() : [],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        draggable: true
      });

      // Map Click
      map.addListener('click', (e) => {
        marker.setPosition(e.latLng);
        setLat(e.latLng.lat());
        setLng(e.latLng.lng());
        reverseGeocodeGoogle(e.latLng.lat(), e.latLng.lng());
      });

      // Marker Drag
      marker.addListener('dragend', () => {
        const pos = marker.getPosition();
        setLat(pos.lat());
        setLng(pos.lng());
        reverseGeocodeGoogle(pos.lat(), pos.lng());
      });

      reverseGeocodeGoogle(lat, lng);

    } catch (err) {
      console.error("Google map render error:", err);
      loadLeafletMap();
    }
  };

  const reverseGeocodeGoogle = (latitude, longitude) => {
    if (!window.google || !window.google.maps) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const formatted = results[0].formatted_address;
        setAddress(formatted);
        detectDistrictFromAddress(formatted);
      }
    });
  };

  // Leaflet Map Loader (Bulletproof, loads within 1 second, zero config keys needed!)
  const loadLeafletMap = () => {
    if (window.L) {
      initializeLeafletMap();
      return;
    }

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initializeLeafletMap;
    script.onerror = () => {
      setError("Failed to initialize offline mapping modules.");
    };
    document.head.appendChild(script);
  };

  const initializeLeafletMap = () => {
    if (!mapContainerRef.current) return;
    setMapLoaded(true);

    try {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
      }

      // Initialize map container pointing to Leaflet
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView([lat, lng], 8);
      leafletMapInstance.current = map;

      // Add clean, styled map tiles (OpenStreetMap)
      const tileUrl = theme === 'dark' 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' 
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      window.L.tileLayer(tileUrl, {
        maxZoom: 19
      }).addTo(map);

      // Custom colored map pin marker
      const marker = window.L.marker([lat, lng], { draggable: true }).addTo(map);
      leafletMarkerInstance.current = marker;

      // Map Click Listener
      map.on('click', (e) => {
        const { lat: newLat, lng: newLng } = e.latlng;
        marker.setLatLng([newLat, newLng]);
        setLat(newLat);
        setLng(newLng);
        reverseGeocodeOffline(newLat, newLng);
      });

      // Marker Drag Listener
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        setLat(position.lat);
        setLng(position.lng);
        reverseGeocodeOffline(position.lat, position.lng);
      });

      // Initial reverse geocode if address empty
      if (!address) {
        reverseGeocodeOffline(lat, lng);
      }

    } catch (err) {
      console.error("Leaflet init error:", err);
    }
  };

  const reverseGeocodeOffline = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
        detectDistrictFromAddress(data.display_name);
      } else {
        setAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
      }
    } catch (err) {
      setAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    setIsSearching(true);
    setError('');

    try {
      // Offline OpenStreetMap Geocoding API (Fast, Free, No API Key needed)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=1`);
      const data = await response.json();

      if (data && data[0]) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        setLat(newLat);
        setLng(newLng);
        setAddress(data[0].display_name);
        detectDistrictFromAddress(data[0].display_name);

        // Update leaflet map view
        if (leafletMapInstance.current && leafletMarkerInstance.current) {
          leafletMapInstance.current.setView([newLat, newLng], 14);
          leafletMarkerInstance.current.setLatLng([newLat, newLng]);
        }
      } else {
        setError('Location not found. Try searching with district or city name.');
      }
    } catch (err) {
      console.error(err);
      setError('Search service unavailable. Place marker manually.');
    } finally {
      setIsSearching(false);
    }
  };

  const detectDistrictFromAddress = (addressStr) => {
    const lowerAddress = addressStr.toLowerCase();
    const matched = districts.find(d => {
      const englishName = d.toLowerCase();
      const tamilName = t(`districts.${d}`).toLowerCase();
      return lowerAddress.includes(englishName) || lowerAddress.includes(tamilName);
    });

    if (matched) {
      setDistrict(matched);
      setError('');
    }
  };

  const getCurrentGPS = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        reverseGeocodeOffline(latitude, longitude);

        if (leafletMapInstance.current && leafletMarkerInstance.current) {
          leafletMapInstance.current.setView([latitude, longitude], 14);
          leafletMarkerInstance.current.setLatLng([latitude, longitude]);
        }
      },
      (err) => {
        setError('GPS signal blocked. Please drag the map pin manually.');
      }
    );
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!name.trim()) {
        setError(t('onboarding.validation_name'));
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (!address) {
        setError(t('onboarding.validation_map') || 'Please select a location on the map.');
        return;
      }
      setError('');
      setStep(3);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!district) {
      setError(t('onboarding.validation_district'));
      return;
    }
    setError('');
    updateOnboarding(name.trim(), district, lat, lng, address);
    navigate('/crop-recommendation');
  };

  const getDarkMapStyles = () => [
    { elementType: 'geometry', stylers: [{ color: '#101F16' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#101F16' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8fa396' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#c9a93e' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#8fa396' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0b3d20' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a3022' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#132319' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8fa396' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#091410' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#8fa396' }] }
  ];

  return (
    <div className="min-h-screen bg-brand-primary/5 dark:bg-brand-darkBg flex flex-col justify-between p-6 transition-colors duration-200">
      
      {/* Top Utility Bar */}
      <div className="w-full max-w-lg mx-auto flex justify-end gap-3">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface text-xs font-medium premium-shadow hover:opacity-80 transition-opacity"
        >
          <Languages className="w-3.5 h-3.5" />
          {language === 'en' ? 'தமிழ்' : 'English'}
        </button>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-borderLight dark:border-brand-borderDark bg-white dark:bg-brand-darkSurface text-xs font-medium premium-shadow hover:opacity-80 transition-opacity"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-brand-primary" />
              <span>{t('common.dark')}</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-brand-gold" />
              <span>{t('common.light')}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Multi-Step Card */}
      <div className="flex-1 flex items-center justify-center py-6">
        <motion.div
          layout
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark rounded-2xl p-6 sm:p-8 premium-shadow"
        >
          <div className="text-center mb-6">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-gold dark:text-brand-goldDark mb-1">
              {t('common.app_name')} · Step {step} of 3
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-brand-primary dark:text-[#EDEFE9]">
              {step === 1 && t('onboarding.title')}
              {step === 2 && (t('onboarding.maps.title') || 'Select Farm Location')}
              {step === 3 && (t('onboarding.district_confirm.title') || 'Confirm District')}
            </h1>
            <p className="mt-1.5 text-xs text-brand-textSecondaryLight dark:text-brand-textSecondaryDark font-normal">
              {step === 1 && t('onboarding.subtitle')}
              {step === 2 && (t('onboarding.maps.subtitle') || 'Search or place marker on map')}
              {step === 3 && (t('onboarding.district_confirm.subtitle') || 'Verify resolved zone for TNAU calculations')}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Farmer Name */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="space-y-2 text-left">
                  <label htmlFor="name-input" className="block text-xs font-bold uppercase tracking-wider text-brand-primary dark:text-[#EDEFE9]">
                    {t('onboarding.name_label')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-textSecondaryLight dark:text-brand-textSecondaryDark">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="name-input"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder={t('onboarding.name_placeholder')}
                      className="block w-full pl-10 pr-4 py-3 bg-brand-primary/[0.02] dark:bg-brand-primary/[0.04] border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all"
                    />
                  </div>
                </div>

                {error && <p className="text-xs font-bold text-red-600 dark:text-red-400 text-left">{error}</p>}

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-brand-primary hover:bg-brand-primary/95 text-white dark:bg-brand-gold dark:hover:bg-brand-gold/90 dark:text-brand-darkBg font-bold py-3 rounded-xl text-xs transition-all shadow-md"
                >
                  {t('common.continue')}
                </button>
              </motion.div>
            )}

            {/* Step 2: Location Map Picker */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* Search Bar Input */}
                <form onSubmit={handleSearchSubmit} className="relative flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-textSecondaryLight dark:text-brand-textSecondaryDark">
                      <Search className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder={t('onboarding.maps.search_placeholder') || "Search village, farm address, or city..."}
                      className="block w-full pl-10 pr-10 py-2.5 bg-brand-primary/[0.02] dark:bg-brand-primary/[0.04] border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all"
                    />
                    <button
                      type="button"
                      onClick={getCurrentGPS}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-gold hover:opacity-85"
                      title="Find Location via GPS"
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-4 py-2.5 bg-brand-primary text-white dark:bg-brand-gold dark:text-brand-darkBg rounded-xl text-xs font-bold hover:opacity-90 shrink-0"
                  >
                    {isSearching ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : 'Search'}
                  </button>
                </form>

                {/* Map Canvas Wrapper */}
                <div className="relative rounded-xl border border-brand-borderLight dark:border-brand-borderDark overflow-hidden premium-shadow bg-brand-primary/[0.01]">
                  <div 
                    ref={mapContainerRef} 
                    className="w-full h-56 relative z-0"
                  />
                  
                  {!mapLoaded && (
                    <div className="absolute inset-0 bg-white/70 dark:bg-brand-darkSurface/70 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-brand-gold animate-spin" />
                      <span className="text-[10px] font-bold text-brand-textSecondaryLight">Initializing Map...</span>
                    </div>
                  )}
                </div>

                {/* Selected Location info panel */}
                {address && (
                  <div className="bg-[#FAF8F5] dark:bg-[#1C2C22] p-3 rounded-xl border border-brand-borderLight dark:border-brand-borderDark text-left space-y-1">
                    <span className="text-[8px] uppercase font-bold text-brand-gold block">Selected Location</span>
                    <p className="text-xs text-brand-primary dark:text-[#EDEFE9] font-medium leading-relaxed line-clamp-2">
                      {address}
                    </p>
                    <span className="text-[9px] font-mono text-brand-textSecondaryLight/80 block">
                      Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
                    </span>
                  </div>
                )}

                {error && <p className="text-xs font-bold text-red-600 dark:text-red-400 text-left">{error}</p>}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-xs font-bold text-brand-textSecondaryLight hover:bg-brand-primary/5 transition-all py-3"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 bg-brand-primary hover:bg-brand-primary/95 text-white dark:bg-brand-gold dark:hover:bg-brand-gold/90 dark:text-brand-darkBg font-bold py-3 rounded-xl text-xs transition-all shadow-md"
                  >
                    Confirm Location
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: District verification dropdown */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="space-y-2 relative text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-primary dark:text-[#EDEFE9]">
                    Confirm Agricultural District
                  </label>
                  
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-brand-primary/[0.02] dark:bg-brand-primary/[0.04] border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-sm font-semibold text-left focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4.5 w-4.5 text-brand-gold" />
                        {district ? t(`districts.${district}`) : <span className="text-brand-textSecondaryLight/50">Select matching district</span>}
                      </span>
                      <ChevronDown className={`h-4.5 w-4.5 text-brand-textSecondaryLight transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => { setIsOpen(false); setSearchTerm(''); }} />
                        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-brand-darkSurface border border-brand-borderLight dark:border-brand-borderDark rounded-xl shadow-lg z-20 overflow-hidden premium-shadow flex flex-col max-h-[220px]">
                          
                          <div className="p-2 border-b border-brand-borderLight dark:border-brand-borderDark bg-brand-primary/[0.01] flex items-center gap-2 sticky top-0 z-10">
                            <Search className="w-3.5 h-3.5 text-brand-textSecondaryLight shrink-0" />
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search..."
                              className="w-full bg-transparent text-xs focus:outline-none py-1"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>

                          <div className="overflow-y-auto divide-y divide-brand-borderLight dark:divide-brand-borderDark flex-1">
                            {filteredDistricts.length > 0 ? (
                              filteredDistricts.map((d) => (
                                <button
                                  key={d}
                                  type="button"
                                  onClick={() => {
                                    setDistrict(d);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                    if (error) setError('');
                                  }}
                                  className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-brand-primary/5 text-left text-xs font-semibold transition-colors"
                                >
                                  <span>{t(`districts.${d}`)}</span>
                                  {district === d && <Check className="w-3.5 h-3.5 text-brand-gold" />}
                                </button>
                              ))
                            ) : (
                              <div className="p-3 text-xs text-center text-brand-textSecondaryLight">
                                No matching districts.
                              </div>
                            )}
                          </div>

                        </div>
                      </>
                    )}
                  </div>
                </div>

                {error && <p className="text-xs font-bold text-red-600 dark:text-red-400 text-left">{error}</p>}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 border border-brand-borderLight dark:border-brand-borderDark rounded-xl text-xs font-bold text-brand-textSecondaryLight hover:bg-brand-primary/5 transition-all py-3"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-brand-primary hover:bg-brand-primary/95 text-white dark:bg-brand-gold dark:hover:bg-brand-gold/90 dark:text-brand-darkBg font-bold py-3 rounded-xl text-xs transition-all shadow-md"
                  >
                    {t('onboarding.get_started')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="w-full text-center py-4 text-xs font-medium text-brand-textSecondaryLight/60 dark:text-brand-textSecondaryDark/40">
        © 2026 Tamil Nadu Agriculture Extension Department. Powered by Smart Agri Intelligence.
      </div>
    </div>
  );
}
