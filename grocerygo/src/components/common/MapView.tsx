'use client';

import L, { LatLngExpression } from 'leaflet';
// import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false },
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false },
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false },
);



interface MapViewProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}

interface DraggableMarkerProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  icon: L.Icon; 
}

const DraggableMarker: React.FC<DraggableMarkerProps> = ({
  position,
  setPosition,
  icon,
}) => {
    const map=useMap()
   
    useEffect(()=>{
      map.setView(position as LatLngExpression,15,{animate:true})
    },[position,map])
  return (
    <Marker
      position={position as LatLngExpression}
      icon={icon} 
      draggable={true}
      eventHandlers={{
        dragend: (e: L.LeafletEvent) => {
          const marker = e.target as L.Marker;
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
        },
      }}
    >
      {/* <Popup>Location selected</Popup> */}
    </Marker>
  );
};

const MapView = ({ position, setPosition }: MapViewProps) => {
  const [leaflet, setLeaflet] = useState<typeof L | null>(null); //proper type instead of any
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    import('leaflet').then((mod) => {
      setLeaflet(mod.default); //use mod.default for proper typing
    });
  }, []);

  if (!position || !leaflet || !mounted) return null;

  const markerIcon = new leaflet.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  return (
    <MapContainer
      key={position.join(',')}
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}" />
      <DraggableMarker
        position={position}
        setPosition={setPosition}
        icon={markerIcon}
      />
    </MapContainer>
  );
};

export default MapView;