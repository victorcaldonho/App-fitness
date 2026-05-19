import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  InfoWindow, 
  Pin, 
  useAdvancedMarkerRef,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import { 
  Compass, 
  MapPin, 
  Dumbbell, 
  Navigation, 
  Star, 
  Clock, 
  Map as MapIcon, 
  Sparkles, 
  Activity, 
  Footprints, 
  Car,
  AlertTriangle,
  Locate
} from 'lucide-react';
import { ScreenType } from '../types';

interface GymLocatorScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Default geolocation fallback (São Paulo, Avenida Paulista)
const DEFAULT_CENTER = { lat: -23.561684, lng: -46.655981 };

// Custom Map Style for VIP dark aesthetic
const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#cbd5e1" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#38bdf8" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#0f2e33" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#30d158" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#1e293b" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#334155" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#64748b" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#1e1b4b" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#312e81" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#a5b4fc" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#020617" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#1e293b" }],
    },
  ],
};

function InnerGymLocator({ 
  userCenter, 
  setUserCenter,
  selectedGym,
  setSelectedGym,
  routeTravelMode,
  setRouteTravelMode,
  routeInfo,
  setRouteInfo
}: {
  userCenter: google.maps.LatLngLiteral;
  setUserCenter: (c: google.maps.LatLngLiteral) => void;
  selectedGym: any | null;
  setSelectedGym: (g: any) => void;
  routeTravelMode: 'WALKING' | 'DRIVING';
  setRouteTravelMode: (m: 'WALKING' | 'DRIVING') => void;
  routeInfo: { distance: string; duration: string } | null;
  setRouteInfo: (i: { distance: string; duration: string } | null) => void;
}) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const routesLib = useMapsLibrary('routes');
  const [gyms, setGyms] = useState<any[]>([]);
  const [loadingGyms, setLoadingGyms] = useState(false);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  // Search Nearby gyms when map or center is ready
  useEffect(() => {
    if (!placesLib || !map || !userCenter) return;

    setLoadingGyms(true);
    // Nearby search requires locationRestriction center & radius
    placesLib.Place.searchNearby({
      locationRestriction: {
        center: userCenter,
        radius: 3500, // 3.5 km radius
      },
      includedTypes: ['gym'],
      fields: ['id', 'displayName', 'location', 'formattedAddress', 'rating', 'userRatingCount'],
      maxResultCount: 15,
    })
      .then(({ places }) => {
        setGyms(places || []);
        setLoadingGyms(false);
      })
      .catch((err) => {
        console.error("Error searching nearby gyms: ", err);
        setLoadingGyms(false);
      });
  }, [placesLib, map, userCenter]);

  // Compute routes dynamically when a gym is selected
  useEffect(() => {
    if (!routesLib || !map || !selectedGym || !userCenter) {
      polylinesRef.current.forEach(p => p.setMap(null));
      return;
    }

    // Clear previous path
    polylinesRef.current.forEach(p => p.setMap(null));

    routesLib.Route.computeRoutes({
      origin: userCenter,
      destination: { lat: selectedGym.location.lat(), lng: selectedGym.location.lng() },
      travelMode: routeTravelMode,
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    })
      .then(({ routes }) => {
        if (routes?.[0]) {
          const newPolylines = routes[0].createPolylines();
          newPolylines.forEach(p => {
            p.setOptions({
              strokeColor: routeTravelMode === 'WALKING' ? '#60a5fa' : '#ef4444',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            });
            p.setMap(map);
          });
          polylinesRef.current = newPolylines;

          // Compute readable distance and duration
          const distanceKM = (routes[0].distanceMeters / 1000).toFixed(1);
          const durationSeconds = parseInt(String(routes[0].durationMillis)) / 1000;
          const durationMin = Math.round(durationSeconds / 60);

          setRouteInfo({
            distance: `${distanceKM} km`,
            duration: `${durationMin} min`
          });

          if (routes[0].viewport) {
            map.fitBounds(routes[0].viewport);
          }
        }
      })
      .catch((err) => {
        console.error("Route computing failed: ", err);
      });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
    };
  }, [routesLib, map, selectedGym, userCenter, routeTravelMode]);

  // Handle locating the user
  const handleRecenter = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCenter(coords);
          map?.panTo(coords);
          map?.setZoom(14);
        },
        () => {
          alert("Não foi possível acessar seu GPS. Mantendo ponto padrão.");
        }
      );
    }
  };

  return (
    <div className="flex flex-col h-[500px] relative w-full border border-slate-800 rounded-2xl overflow-hidden bg-slate-900">
      {/* Search status overlay */}
      {loadingGyms && (
        <div className="absolute top-3 left-3 z-[999] bg-slate-900/90 border border-slate-800 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
          Escaneando academias próximas...
        </div>
      )}

      {/* Locate button overlay */}
      <button
        onClick={handleRecenter}
        title="Usar minha localização GPS"
        className="absolute bottom-4 right-4 z-[99] bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg active:scale-95 transition-all cursor-pointer border border-blue-400/20"
      >
        <Locate className="w-5 h-5" />
      </button>

      {/* The Google Map View */}
      <Map
        defaultCenter={userCenter}
        defaultZoom={14}
        mapId="DEMO_MAP_ID"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        options={mapOptions}
        style={{ width: '100%', height: '100%' }}
      >
        {/* User Current Location Marker */}
        <AdvancedMarker position={userCenter} title="Você está aqui">
          <Pin background="#3b82f6" glyphColor="#ffffff" borderColor="#1e3a8a" scale={1.1} />
        </AdvancedMarker>

        {/* Gyms markers */}
        {gyms.map((gym) => {
          const isSelected = selectedGym?.id === gym.id;
          return (
            <AdvancedMarker 
              key={gym.id} 
              position={{ lat: gym.location.lat(), lng: gym.location.lng() }}
              title={gym.displayName}
              onClick={() => setSelectedGym(gym)}
            >
              <div className={`p-1.5 rounded-full border transition-all ${
                isSelected 
                  ? 'bg-emerald-500 border-white scale-125 z-50' 
                  : 'bg-slate-950/90 border-slate-700 hover:border-emerald-500'
              }`}>
                <Dumbbell className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
              </div>
            </AdvancedMarker>
          );
        })}
      </Map>

      {/* Display brief list of found gyms to scroll directly */}
      <div className="absolute top-3 right-3 z-[99] max-w-[200px] hidden sm:block">
        <div className="bg-slate-950/90 border border-slate-800 backdrop-blur rounded-xl p-2.5 max-h-[220px] overflow-y-auto flex flex-col gap-1.5 shadow-xl scrollbar-thin">
          <p className="text-[10px] font-mono font-bold text-slate-450 uppercase mb-1">Academias ({gyms.length})</p>
          {gyms.map((gym) => (
            <button
              key={gym.id}
              onClick={() => {
                setSelectedGym(gym);
                map?.panTo({ lat: gym.location.lat(), lng: gym.location.lng() });
              }}
              className={`text-left p-1.5 rounded-lg text-xs leading-none transition-all ${
                selectedGym?.id === gym.id 
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                  : 'text-slate-300 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <p className="font-bold truncate">{gym.displayName}</p>
              <div className="flex items-center gap-1 mt-0.5 text-[8px] text-slate-400 flex-wrap">
                <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                <span>{gym.rating || 'S/N'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GymLocatorScreen({ onNavigate }: GymLocatorScreenProps) {
  const [userCenter, setUserCenter] = useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  const [selectedGym, setSelectedGym] = useState<any | null>(null);
  const [routeTravelMode, setRouteTravelMode] = useState<'WALKING' | 'DRIVING'>('WALKING');
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  // Auto detect user coordinates
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (error) => {
          console.warn("Geolocation permission or finding failed, using default: ", error);
        }
      );
    }
  }, []);

  if (!hasValidKey) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 overflow-x-hidden pb-12 px-6 pt-10 text-center max-w-xl mx-auto justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4 animate-pulse" />
          <h2 className="text-white text-lg font-black font-sans uppercase tracking-tight">API Key Google Maps Requerida</h2>
          <p className="text-slate-400 text-xs my-4 leading-relaxed">
            Para ativar o localizador inteligente de academias e calcular rotas instantâneas em tempo real, configure sua chave do Google Maps.
          </p>
          
          <div className="text-left w-full bg-slate-950 p-4 rounded-2xl border border-slate-850 mb-6 text-xs">
            <p className="font-bold text-slate-250 mb-1.5 uppercase tracking-wide">Como configurar de forma simples:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
              <li>Adquira uma chave de API: <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Link do Google Console</a></li>
              <li>Vá em <strong>Configurações</strong> (⚙️ ícone de engrenagem no canto superior direito do chat)</li>
              <li>Acesse a aba <strong>Segurança / Secrets</strong></li>
              <li>Copie a chave e crie o segredo com o nome exato <code>GOOGLE_MAPS_PLATFORM_KEY</code></li>
            </ol>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase cursor-pointer"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const handleSelectGymFromList = (gym: any) => {
    setSelectedGym(gym);
    // Pan to will happen inside the component
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 overflow-x-hidden pb-12">
      {/* BANNER HEADER */}
      <div className="relative h-[22vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop"
          alt="Map Locator Gyms"
          className="w-full h-full object-cover object-center filter brightness-[0.45] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        
        {/* Nav lines */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            id="btn-locator-back"
            className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-white p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer"
          >
            <Compass className="w-5 h-5 rotate-180" />
          </button>
          
          <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black font-mono tracking-widest text-slate-300">EXPLORER RADAR</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-slate-950 rounded-t-[35px] -mt-[40px] px-6 pt-6 flex-1 max-w-xl mx-auto w-full">
        {/* Drag handle decoration */}
        <div className="w-10 h-1 bg-slate-800 rounded-full mx-auto mb-6" />

        {/* BRAN TITLE */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-white text-2xl font-black font-sans tracking-tight">LOCALIZADOR DE ACADEMIAS</h2>
            <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
              Encontre os templos de treinamento mais próximos com base na sua localização atual.
            </p>
          </div>
          <MapIcon className="w-6 h-6 text-emerald-500" />
        </div>

        {/* MAP CONTAINER INTEGRATION Wrapper */}
        <APIProvider apiKey={API_KEY} version="weekly">
          <InnerGymLocator
            userCenter={userCenter}
            setUserCenter={setUserCenter}
            selectedGym={selectedGym}
            setSelectedGym={setSelectedGym}
            routeTravelMode={routeTravelMode}
            setRouteTravelMode={setRouteTravelMode}
            routeInfo={routeInfo}
            setRouteInfo={setRouteInfo}
          />
        </APIProvider>

        {/* DETAILED INFORMATION PANEL OR EMPTY SELECTION BLOCK */}
        <div className="mt-6 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {selectedGym ? (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                key={selectedGym.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl shadow-black/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Dumbbell className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-white text-base font-bold font-sans">{selectedGym.displayName}</h4>
                      <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        {selectedGym.formattedAddress || 'Endereço indisponível'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating score info bar */}
                <div className="flex items-center gap-4 mt-4 py-2 border-y border-slate-850">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-white text-xs font-bold font-mono">{selectedGym.rating || 'S/N'}</span>
                    <span className="text-[10px] text-slate-500 font-medium">({selectedGym.userRatingCount || 0} avaliações)</span>
                  </div>

                  <div className="w-[1px] h-4 bg-slate-800" />

                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Ponto Ativo</span>
                  </div>
                </div>

                {/* Travel route selector header */}
                <div className="mt-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-450 block mb-2.5">Calcular Rota ao Destino</span>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={() => setRouteTravelMode('WALKING')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                        routeTravelMode === 'WALKING'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-850'
                      }`}
                    >
                      <Footprints className="w-4 h-4" />
                      Caminhando
                    </button>

                    <button
                      onClick={() => setRouteTravelMode('DRIVING')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                        routeTravelMode === 'DRIVING'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-850'
                      }`}
                    >
                      <Car className="w-4 h-4" />
                      De Carro
                    </button>
                  </div>

                  {/* Estimated metrics outcome info */}
                  {routeInfo && (
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850 flex items-center justify-around gap-4">
                      <div className="text-center">
                        <span className="text-[9px] font-black uppercase text-slate-500 block">Distância Estimada</span>
                        <span className="text-white text-sm font-black font-mono mt-0.5 block">{routeInfo.distance}</span>
                      </div>
                      <div className="w-[1px] h-6 bg-slate-850" />
                      <div className="text-center">
                        <span className="text-[9px] font-black uppercase text-slate-500 block">Duração Estimada</span>
                        <span className="text-white text-sm font-black font-mono mt-0.5 block">{routeInfo.duration}</span>
                      </div>
                    </div>
                  )}
                </div>

              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center"
              >
                <Navigation className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
                <p className="text-slate-300 font-bold text-sm">Selecione uma academia no mapa</p>
                <p className="text-slate-500 text-[10px] mt-1 max-w-xs leading-relaxed">
                  Toque nos marcadores verdes ou use a lista para obter rotas de caminhada ou direção instantâneas.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
