"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Location } from '@/types';

interface ParkingMapProps {
  locations: Location[];
  selectedLocation: Location | null;
  onSelectLocation: (location: Location) => void;
}

export default function ParkingMap({ locations, selectedLocation, onSelectLocation }: ParkingMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  // Set default map center to KL city center
  const mapCenter: [number, number] = [3.1390, 101.6869];
  const defaultZoom = 14;

  // Initialize map when component mounts
  useEffect(() => {
    // Add Leaflet CSS
    const link = document.createElement('link');
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Create custom icons
    const parkingIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    const selectedIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Only create the map if it doesn't exist and we have a container
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(mapCenter, defaultZoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
      
      // Add markers for each location
      locations.forEach(location => {
        if (location.latitude && location.longitude) {
          const isSelected = selectedLocation?.id === location.id;
          const marker = L.marker(
            [location.latitude, location.longitude], 
            { icon: isSelected ? selectedIcon : parkingIcon }
          );
          
          const popupContent = document.createElement('div');
          popupContent.innerHTML = `
            <div>
              <h3 style="font-weight: bold; margin-bottom: 5px;">${location.name}</h3>
              <p style="font-size: 12px; margin: 0;">${location.address}</p>
              <p style="font-size: 12px; margin: 5px 0;">Rate: RM${location.hourlyRate.toFixed(2)}/hr</p>
              <p style="font-size: 12px; margin-bottom: 10px;">Available: ${location.availableSpots} spots</p>
              <button 
                style="width:100%; background:#2563EB; color:white; padding:5px; border:none; border-radius:4px; cursor:pointer; font-size:12px;"
                class="select-location-btn"
                data-location-id="${location.id}"
              >
                Select
              </button>
            </div>
          `;
          
          // Add event listener to the select button
          popupContent.querySelector('.select-location-btn')?.addEventListener('click', () => {
            onSelectLocation(location);
          });
          
          marker.bindPopup(popupContent);
          marker.on('click', () => {
            // Event for clicking on the marker itself
            if (location !== selectedLocation) {
              marker.openPopup();
            }
          });
          
          marker.addTo(mapRef.current!);
          markersRef.current.push(marker);
        }
      });
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
      
      // Don't remove the CSS as it might be used by other components
    };
  }, []); // Empty dependency array means this runs once on mount

  // Update markers when selectedLocation changes
  useEffect(() => {
    if (mapRef.current && selectedLocation?.latitude && selectedLocation?.longitude) {
      // Pan to selected location
      mapRef.current.flyTo(
        [selectedLocation.latitude, selectedLocation.longitude],
        16, // zoom level
        {
          animate: true,
          duration: 1.5 // seconds
        }
      );
    }
  }, [selectedLocation]);

  return (
    <div
      ref={mapContainerRef}
      className="h-full w-full"
    />
  );
} 