import { Report, HAZARD_TYPE_LABELS, SEVERITY_LABELS } from '@/shared/types';
import { Clock, MapPin, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface ReportsListProps {
  reports: Report[];
  loading: boolean;
}

const getSeverityColor = (severity: number) => {
  const colorMap = {
    1: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    2: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    3: 'bg-blue-100 text-blue-800 border-blue-200',
    4: 'bg-amber-100 text-amber-800 border-amber-200',
    5: 'bg-red-100 text-red-800 border-red-200',
  };
  return colorMap[severity as keyof typeof colorMap] || colorMap[3];
};

const getHazardTypeColor = (hazardType: string) => {
  const colorMap = {
    flooding: 'bg-blue-100 text-blue-800 border-blue-200',
    wildfire: 'bg-red-100 text-red-800 border-red-200',
    earthquake: 'bg-purple-100 text-purple-800 border-purple-200',
    tsunami: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    hurricane: 'bg-amber-100 text-amber-800 border-amber-200',
    tornado: 'bg-gray-100 text-gray-800 border-gray-200',
    landslide: 'bg-lime-100 text-lime-800 border-lime-200',
    volcanic: 'bg-red-100 text-red-800 border-red-200',
    drought: 'bg-orange-100 text-orange-800 border-orange-200',
    severe_weather: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colorMap[hazardType as keyof typeof colorMap] || colorMap.other;
};

export default function ReportsList({ reports, loading }: ReportsListProps) {
  // Sample incidents for coastal cities when no real reports exist
  const sampleReports: Report[] = [
    {
      id: 1,
      user_id: 'sample',
      title: "Severe Monsoon Flooding in South Mumbai",
      description: "Heavy rainfall causing dangerous street flooding in low-lying coastal areas. Water levels rising rapidly.",
      hazard_type: "flooding" as const,
      severity: 4 as const,
      latitude: 19.0760,
      longitude: 72.8777,
      location_name: "Mumbai, Maharashtra",
      media_urls: null,
      status: "verified" as const,
      is_verified: true,
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 2,
      user_id: 'sample',
      title: "Cyclone Mandous Approaching Chennai Coast",
      description: "Category 3 tropical cyclone with winds up to 120 km/h approaching Tamil Nadu coast",
      hazard_type: "hurricane" as const,
      severity: 5 as const,
      latitude: 13.0827,
      longitude: 80.2707,
      location_name: "Chennai, Tamil Nadu",
      media_urls: null,
      status: "verified" as const,
      is_verified: true,
      created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
      updated_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 3,
      user_id: 'sample',
      title: "Storm Surge Warning - Hooghly River",
      description: "Dangerous storm surge affecting port areas and riverside communities",
      hazard_type: "severe_weather" as const,
      severity: 4 as const,
      latitude: 22.5726,
      longitude: 88.3639,
      location_name: "Kolkata, West Bengal",
      media_urls: null,
      status: "pending" as const,
      is_verified: false,
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      updated_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: 4,
      user_id: 'sample',
      title: "Coastal Erosion Emergency - Calangute Beach",
      description: "Rapid erosion threatening beachfront hotels and tourist infrastructure",
      hazard_type: "other" as const,
      severity: 3 as const,
      latitude: 15.2993,
      longitude: 74.1240,
      location_name: "Goa",
      media_urls: null,
      status: "pending" as const,
      is_verified: false,
      created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
      updated_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      id: 5,
      user_id: 'sample',
      title: "Tsunami Watch Alert - Arabian Sea",
      description: "Undersea earthquake magnitude 6.8 detected, monitoring for potential tsunami waves",
      hazard_type: "tsunami" as const,
      severity: 5 as const,
      latitude: 9.9312,
      longitude: 76.2673,
      location_name: "Kochi, Kerala",
      media_urls: null,
      status: "verified" as const,
      is_verified: true,
      created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
      updated_at: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    },
    {
      id: 6,
      user_id: 'sample',
      title: "Flash Flood Warning - Mandovi River",
      description: "Sudden water level rise due to upstream dam release affecting coastal settlements",
      hazard_type: "flooding" as const,
      severity: 3 as const,
      latitude: 15.4989,
      longitude: 73.8278,
      location_name: "Panaji, Goa",
      media_urls: null,
      status: "verified" as const,
      is_verified: true,
      created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hours ago
      updated_at: new Date(Date.now() - 1000 * 60 * 270).toISOString(),
    },
    {
      id: 7,
      user_id: 'sample',
      title: "High Tide Flooding - Marine Drive",
      description: "Exceptionally high tides causing water overflow on coastal roads",
      hazard_type: "flooding" as const,
      severity: 2 as const,
      latitude: 18.9220,
      longitude: 72.8347,
      location_name: "Mumbai, Maharashtra",
      media_urls: null,
      status: "pending" as const,
      is_verified: false,
      created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
      updated_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    },
  ];

  // Use sample reports if no real reports exist
  const reportsToShow = reports.length > 0 ? reports : sampleReports;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No reports found</p>
          <p className="text-sm text-gray-500 mt-1">
            Be the first to report a hazard in your area
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {reportsToShow.map((report) => (
        <div
          key={report.id}
          className="p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-medium text-gray-900 truncate">
                  {report.title}
                </h3>
                {report.is_verified && (
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getHazardTypeColor(report.hazard_type)}`}>
                  {HAZARD_TYPE_LABELS[report.hazard_type]}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(report.severity)}`}>
                  {SEVERITY_LABELS[report.severity]}
                </span>
              </div>

              {report.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {report.description}
                </p>
              )}

              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(report.created_at).toLocaleDateString()}</span>
                </div>
                {report.location_name && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{report.location_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
