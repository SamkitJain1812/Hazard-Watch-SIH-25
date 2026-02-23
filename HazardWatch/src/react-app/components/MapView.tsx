import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Report, HAZARD_TYPE_LABELS, SEVERITY_LABELS, SEVERITY_COLORS, HAZARD_TYPE_COLORS } from '@/shared/types';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  reports: Report[];
  highlightMode?: 'none' | 'high-priority' | 'verified';
}

const getMarkerColor = (hazardType: string, severity: number) => {
  const baseColor = HAZARD_TYPE_COLORS[hazardType as keyof typeof HAZARD_TYPE_COLORS] || HAZARD_TYPE_COLORS.other;
  const severityColor = SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS];
  
  // Use severity color for border, hazard type color for background
  return { 
    color: baseColor, 
    borderColor: severityColor,
    opacity: Math.max(0.8, severity / 5) 
  };
};

export default function MapView({ reports, highlightMode = 'none' }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map focused on India
    const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
    mapInstanceRef.current = map;

    // Add light tile layer for better visibility
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const mapInstance = mapInstanceRef.current;

    // Clear existing markers
    mapInstance.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.removeLayer(layer);
      }
    });

    // Sample threat data for coastal cities in India if no reports exist
    const sampleThreats = reports.length === 0 ? [
      {
        id: 1,
        user_id: 'sample',
        latitude: 19.0760,
        longitude: 72.8777,
        title: "Monsoon Flooding Alert",
        description: "Heavy rainfall causing street flooding in coastal areas",
        hazard_type: "flooding" as const,
        severity: 4 as const,
        location_name: "Mumbai, Maharashtra",
        media_urls: null,
        status: "verified" as const,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        user_id: 'sample',
        latitude: 13.0827,
        longitude: 80.2707,
        title: "Cyclone Warning",
        description: "Tropical cyclone approaching coast",
        hazard_type: "hurricane" as const,
        severity: 5 as const,
        location_name: "Chennai, Tamil Nadu",
        media_urls: null,
        status: "verified" as const,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        user_id: 'sample',
        latitude: 22.5726,
        longitude: 88.3639,
        title: "Storm Surge Warning",
        description: "Dangerous storm surge affecting port areas",
        hazard_type: "severe_weather" as const,
        severity: 4 as const,
        location_name: "Kolkata, West Bengal",
        media_urls: null,
        status: "pending" as const,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        user_id: 'sample',
        latitude: 15.2993,
        longitude: 74.1240,
        title: "Coastal Erosion Alert",
        description: "Rapid erosion threatening coastal infrastructure",
        hazard_type: "other" as const,
        severity: 3 as const,
        location_name: "Goa",
        media_urls: null,
        status: "pending" as const,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        user_id: 'sample',
        latitude: 9.9312,
        longitude: 76.2673,
        title: "Tsunami Risk",
        description: "Undersea earthquake detected, monitoring for tsunami",
        hazard_type: "tsunami" as const,
        severity: 5 as const,
        location_name: "Kochi, Kerala",
        media_urls: null,
        status: "verified" as const,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ] : [];

    const allReports = reports.length > 0 ? reports : sampleThreats;

    // Clear existing markers
    mapInstance.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        mapInstance.removeLayer(layer);
      }
    });

    // Filter reports based on highlight mode
    let reportsToShow = allReports;
    if (highlightMode === 'high-priority') {
      reportsToShow = allReports.filter(r => r.severity >= 4);
    } else if (highlightMode === 'verified') {
      reportsToShow = allReports.filter(r => r.is_verified);
    }

    // Add markers for reports
    const markers: L.Marker[] = [];
    const locationCounts = new Map<string, number>();
    
    // Count reports per location for ping display
    reportsToShow.forEach((report) => {
      const locationKey = `${report.latitude},${report.longitude}`;
      locationCounts.set(locationKey, (locationCounts.get(locationKey) || 0) + 1);
    });
    
    reportsToShow.forEach((report) => {
      const { color, borderColor, opacity } = getMarkerColor(report.hazard_type, report.severity);
      const locationKey = `${report.latitude},${report.longitude}`;
      const pingCount = locationCounts.get(locationKey) || 1;
      
      // Determine if marker should be highlighted based on mode
      const isHighlighted = highlightMode !== 'none' && (
        (highlightMode === 'high-priority' && report.severity >= 4) ||
        (highlightMode === 'verified' && report.is_verified)
      );
      
      // Create custom icon based on hazard type and severity
      const markerSize = isHighlighted ? 36 : 24;
      const innerSize = isHighlighted ? 14 : 10;
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            opacity: ${opacity};
            width: ${markerSize}px;
            height: ${markerSize}px;
            border-radius: 50%;
            border: 3px solid ${borderColor};
            box-shadow: 0 3px 8px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            ${isHighlighted ? 'animation: pulse 2s infinite;' : ''}
          ">
            <div style="
              background-color: white;
              width: ${innerSize}px;
              height: ${innerSize}px;
              border-radius: 50%;
            "></div>
            ${pingCount > 1 ? `
              <div style="
                position: absolute;
                top: -8px;
                right: -8px;
                background-color: #ef4444;
                color: white;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: bold;
                border: 2px solid white;
              ">${pingCount}</div>
            ` : ''}
          </div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
          </style>
        `,
        iconSize: [markerSize + 6, markerSize + 6],
        iconAnchor: [(markerSize + 6) / 2, (markerSize + 6) / 2],
      });

      const marker = L.marker([report.latitude, report.longitude], { icon })
        .bindPopup(`
          <div style="max-width: 250px; background: white; color: #1f2937; padding: 16px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); border: 2px solid #3b82f6;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #3b82f6;">
              ${report.title}
            </h3>
            <div style="margin-bottom: 8px;">
              <span style="
                background-color: ${color};
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              ">
                ${HAZARD_TYPE_LABELS[report.hazard_type as keyof typeof HAZARD_TYPE_LABELS]}
              </span>
              <span style="
                background-color: #f3f4f6;
                color: #6b7280;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                margin-left: 4px;
              ">
                ${SEVERITY_LABELS[report.severity as keyof typeof SEVERITY_LABELS]}
              </span>
            </div>
            ${report.description ? `
              <p style="margin: 8px 0; color: #4b5563; font-size: 14px;">
                ${report.description}
              </p>
            ` : ''}
            ${report.location_name ? `
              <p style="margin: 4px 0; color: #6b7280; font-size: 12px;">
                📍 ${report.location_name}
              </p>
            ` : ''}
            ${pingCount > 1 ? `
              <p style="margin: 4px 0; color: #ef4444; font-size: 12px; font-weight: bold;">
                📊 ${pingCount} reports from this location
              </p>
            ` : ''}
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">
              ${new Date(report.created_at).toLocaleString()}
              ${report.is_verified ? ' • ✅ Verified' : ''}
            </p>
          </div>
        `);

      marker.addTo(mapInstance);
      markers.push(marker);
    });

    // Fit map to show all markers if there are any, otherwise keep India view
    if (markers.length > 0) {
      const group = new L.FeatureGroup(markers);
      mapInstance.fitBounds(group.getBounds().pad(0.1));
    }
  }, [reports]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '400px' }}
    />
  );
}
