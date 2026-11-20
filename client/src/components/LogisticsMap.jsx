import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  Truck
} from 'lucide-react';

export default function LogisticsMap({ 
  shipments = [], 
  selectedShipment = null, 
  optimizedRoute = null,
  onSelectShipment 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [17.4200, 78.4480],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Free OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors • FoodRescue AI'
      }).addTo(map);

      layersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Layers when shipments or selectedShipment or optimizedRoute changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layersGroupRef.current;
    if (!map || !layerGroup) return;

    // Clear previous markers & polylines
    layerGroup.clearLayers();

    const bounds = L.latLngBounds([]);

    // Custom HTML DivIcons
    const createPickupIcon = (label) => L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="background: #059669; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(5,150,105,0.4);">
            🍲
          </div>
          <span style="background: rgba(15, 23, 42, 0.85); color: #ecfdf5; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; margin-top: 3px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            ${label}
          </span>
        </div>
      `,
      iconSize: [36, 50],
      iconAnchor: [18, 30]
    });

    const createDeliveryIcon = (label) => L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="background: #2563eb; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(37,99,235,0.4);">
            🏠
          </div>
          <span style="background: rgba(15, 23, 42, 0.85); color: #eff6ff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; margin-top: 3px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            ${label}
          </span>
        </div>
      `,
      iconSize: [36, 50],
      iconAnchor: [18, 30]
    });

    const createTruckIcon = () => L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="background: #7c3aed; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; border: 2.5px solid white; box-shadow: 0 0 0 5px rgba(124,58,237,0.3);">
            🚚
          </div>
          <span style="background: #581c87; color: #f5f3ff; font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 4px; margin-top: 2px;">
            DRIVER
          </span>
        </div>
      `,
      iconSize: [36, 48],
      iconAnchor: [18, 25]
    });

    // If an Optimized Multi-Stop Route is provided, render sequential path!
    if (optimizedRoute && optimizedRoute.optimizedSequence && optimizedRoute.optimizedSequence.length > 0) {
      const latLngs = [];

      optimizedRoute.optimizedSequence.forEach((stop, idx) => {
        const pt = [stop.lat, stop.lon];
        latLngs.push(pt);
        bounds.extend(pt);

        const stopIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
              <div style="background: ${stop.type === 'pickup' ? '#059669' : '#2563eb'}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; border: 2.5px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
                ${idx + 1}
              </div>
              <span style="background: rgba(15, 23, 42, 0.9); color: white; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-top: 2px; white-space: nowrap;">
                Stop ${idx + 1}: ${stop.type === 'pickup' ? 'Pickup' : 'Dropoff'}
              </span>
            </div>
          `,
          iconSize: [32, 46],
          iconAnchor: [16, 26]
        });

        const marker = L.marker(pt, { icon: stopIcon });
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 180px;">
            <div style="font-weight: 800; color: #0f172a; margin-bottom: 2px;">
              Stop ${idx + 1}: ${stop.name}
            </div>
            <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">
              📍 ${stop.address}
            </div>
            <div style="background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; color: #334155;">
              📦 ${stop.food || 'Surplus Food'}
            </div>
            <div style="margin-top: 6px; font-size: 10px; color: #059669; font-weight: bold;">
              Cumulative: ~${stop.cumulativeKm} km (${stop.estimatedDurationMins} mins)
            </div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });

      // Sequential Polyline
      const polyline = L.polyline(latLngs, {
        color: '#7c3aed',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8'
      });
      layerGroup.addLayer(polyline);

      map.fitBounds(bounds, { padding: [50, 50] });
      return;
    }

    // Standard Shipments Display
    const listToRender = selectedShipment ? [selectedShipment] : shipments;

    listToRender.forEach((ship) => {
      const pLat = ship.provider?.coordinates?.lat || 17.4156;
      const pLon = ship.provider?.coordinates?.lon || 78.4357;
      const dLat = ship.recipient?.coordinates?.lat || 17.4062;
      const dLon = ship.recipient?.coordinates?.lon || 78.4691;

      const pPoint = [pLat, pLon];
      const dPoint = [dLat, dLon];

      bounds.extend(pPoint);
      bounds.extend(dPoint);

      // Color coding by urgency
      let routeColor = '#2563eb';
      if (ship.urgency === 'CRITICAL') routeColor = '#e11d48';
      else if (ship.urgency === 'URGENT') routeColor = '#d97706';

      // 1. Pickup Marker
      const pMarker = L.marker(pPoint, {
        icon: createPickupIcon(ship.provider?.name?.slice(0, 16) || 'Pickup')
      });

      pMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 200px;">
          <div style="font-size: 10px; font-weight: bold; color: #059669; text-transform: uppercase;">
            1. Origin (Donor Kitchen)
          </div>
          <div style="font-weight: 800; color: #0f172a; font-size: 13px; margin: 2px 0;">
            ${ship.provider?.name}
          </div>
          <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">
            📍 ${ship.provider?.address}
          </div>
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 6px; border-radius: 8px; font-size: 11px; margin-bottom: 6px;">
            <strong>Surplus:</strong> ${ship.quantity} ${ship.unit} of ${ship.foodName}
            <br />
            <strong>Requirement:</strong> ${ship.storageRequirement || 'Thermally Stored'}
          </div>
          <a href="https://www.google.com/maps/search/?api=1&query=${pLat},${pLon}" target="_blank" style="color: #059669; font-weight: bold; text-decoration: none; font-size: 11px;">
            Open in Navigation ↗
          </a>
        </div>
      `);
      layerGroup.addLayer(pMarker);

      // 2. Delivery Marker
      const dMarker = L.marker(dPoint, {
        icon: createDeliveryIcon(ship.recipient?.name?.slice(0, 16) || 'Dropoff')
      });

      dMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 200px;">
          <div style="font-size: 10px; font-weight: bold; color: #2563eb; text-transform: uppercase;">
            2. Destination (Charity / Shelter)
          </div>
          <div style="font-weight: 800; color: #0f172a; font-size: 13px; margin: 2px 0;">
            ${ship.recipient?.name}
          </div>
          <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">
            📍 ${ship.recipient?.address}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            📞 <strong>Contact:</strong> ${ship.recipient?.contact || 'Warden Desk'}
          </div>
          <a href="https://www.google.com/maps/search/?api=1&query=${dLat},${dLon}" target="_blank" style="color: #2563eb; font-weight: bold; text-decoration: none; font-size: 11px;">
            Open in Navigation ↗
          </a>
        </div>
      `);
      layerGroup.addLayer(dMarker);

      // 3. Polyline Route
      const polyline = L.polyline([pPoint, dPoint], {
        color: routeColor,
        weight: selectedShipment?._id === ship._id ? 5 : 3.5,
        opacity: 0.85,
        dashArray: '6, 8'
      });

      polyline.on('click', () => {
        if (onSelectShipment) onSelectShipment(ship);
      });
      layerGroup.addLayer(polyline);

      // 4. Live Vehicle Pin if In Transit
      if (ship.status === 'In Transit') {
        const midLat = (pLat + dLat) / 2 + 0.002;
        const midLon = (pLon + dLon) / 2 - 0.002;
        const tMarker = L.marker([midLat, midLon], { icon: createTruckIcon() });
        tMarker.bindPopup(`
          <div style="font-family: inherit; font-size: 11px;">
            <strong>🚚 ${ship.assignedDriver?.name || 'Driver'}</strong>
            <br />
            Status: <em>In Transit (${ship.foodName})</em>
            <br />
            ETA to Dropoff: ~${Math.round(ship.estimatedMinutes / 2)} mins
          </div>
        `);
        layerGroup.addLayer(tMarker);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [shipments, selectedShipment, optimizedRoute]);

  return (
    <div className="relative w-full h-[460px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-inner bg-slate-100">
      
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Floating Legend */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200/80 shadow-md text-xs space-y-1.5 pointer-events-auto">
        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
          Live Fleet Legend
        </span>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shrink-0" />
          <span className="font-semibold text-[11px]">Food Provider (Pickup)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block shrink-0" />
          <span className="font-semibold text-[11px]">Charity Shelter (Delivery)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3 h-3 rounded-full bg-purple-600 inline-block shrink-0" />
          <span className="font-semibold text-[11px]">Driver Van (Live GPS)</span>
        </div>
        <div className="flex items-center gap-2 text-rose-600">
          <span className="w-4 h-0.5 border-t-2 border-rose-600 border-dashed inline-block shrink-0" />
          <span className="font-semibold text-[11px]">Critical Shelf-Life Path</span>
        </div>
      </div>

      {/* Tile Watermark / Attribution pill */}
      <div className="absolute bottom-2 left-2 z-[1000] bg-slate-900/75 text-white text-[10px] px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5">
        <Navigation className="w-3 h-3 text-emerald-400" />
        <span>OpenStreetMap Tiles • Leaflet Engine</span>
      </div>

    </div>
  );
}
