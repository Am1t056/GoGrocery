'use client';

import { LatLngExpression } from 'leaflet';
import { ILocation } from '../deliveryBoy/DeliveryBoy';
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

const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false,
});

const Polyline= dynamic(() => import('react-leaflet').then((mod) => mod.Polyline), {
  ssr: false,
});


interface LiveMapProps {
  userLocation: ILocation;
  deliveryBoyLocation: ILocation;
}

function Recenter({positions}:{positions: [number,number]}){
  const map=useMap()

  useEffect(()=>{
    if(positions[0]!==0 && positions[1]!==0){
      map.setView(positions as LatLngExpression, map.getZoom(),{
        animate:true
      })
    }

  },[positions,map])
  return null;
}

const LiveMap = ({ userLocation, deliveryBoyLocation }: LiveMapProps) => {
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  if (!L) return <div>Loading map...</div>;
  const deliveryBoyIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/9561/9561688.png',
    iconSize: [45, 45],
  });

  const userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/4821/4821951.png',
    iconSize: [45, 45],
  });

  const linePositions = [
    deliveryBoyLocation && userLocation
      ? [
          [userLocation.latitude, userLocation.longitude],
          [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        ]
      : [],
  ];

  const center = [userLocation.latitude, userLocation.longitude];
  return (
    <div className="w-full h-125 rounded-xl overflow-hidden shadow relative z-10">
      <MapContainer
        center={center as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <Recenter positions={center as [number,number]}/>
        <TileLayer url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}" />

        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userIcon}
        >
          <Popup>Delivery Address</Popup>
        </Marker>

        {deliveryBoyLocation && (
          <Marker
            position={[
              deliveryBoyLocation.latitude,
              deliveryBoyLocation.longitude,
            ]}
            icon={deliveryBoyIcon}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}
        <Polyline positions={linePositions as any} color='green' />
      </MapContainer>
    </div>
  );
};

export default LiveMap;
