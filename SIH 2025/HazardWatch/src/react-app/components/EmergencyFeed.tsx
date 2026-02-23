import { useState, useEffect } from 'react';
import { Report, HAZARD_TYPE_LABELS, EMERGENCY_COLORS } from '@/shared/types';
import { AlertTriangle, Clock, MapPin, CheckCircle, Bell, Radio, Activity } from 'lucide-react';

interface EmergencyFeedProps {
  reports: Report[];
}

interface EmergencyAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  location?: string;
}

export default function EmergencyFeed({ reports }: EmergencyFeedProps) {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);

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
  const allReports = reports.length > 0 ? reports : sampleReports;

  useEffect(() => {
    // Generate emergency alerts based on reports
    const emergencyAlerts: EmergencyAlert[] = [];
    
    // Critical alerts for high severity reports
    const criticalReports = allReports.filter(r => r.severity >= 4);
    criticalReports.slice(0, 3).forEach((report) => {
      emergencyAlerts.push({
        id: `critical-${report.id}`,
        type: 'critical',
        title: `Critical ${HAZARD_TYPE_LABELS[report.hazard_type]} Alert`,
        message: `High severity ${HAZARD_TYPE_LABELS[report.hazard_type].toLowerCase()} reported: ${report.title}`,
        timestamp: new Date(report.created_at),
        location: report.location_name || undefined,
      });
    });

    // Warning alerts for recent reports
    const recentReports = allReports.filter(r => {
      const reportTime = new Date(r.created_at);
      const now = new Date();
      const hoursDiff = (now.getTime() - reportTime.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 2 && r.severity >= 3;
    });

    recentReports.slice(0, 2).forEach((report) => {
      if (!emergencyAlerts.some(a => a.id === `critical-${report.id}`)) {
        emergencyAlerts.push({
          id: `warning-${report.id}`,
          type: 'warning',
          title: `${HAZARD_TYPE_LABELS[report.hazard_type]} Update`,
          message: `Recent ${HAZARD_TYPE_LABELS[report.hazard_type].toLowerCase()} activity detected in your area`,
          timestamp: new Date(report.created_at),
          location: report.location_name || undefined,
        });
      }
    });

    // Info alerts for verification updates
    const verifiedReports = allReports.filter(r => r.is_verified).slice(0, 2);
    verifiedReports.forEach((report) => {
      emergencyAlerts.push({
        id: `verified-${report.id}`,
        type: 'info',
        title: 'Threat Verified',
        message: `${HAZARD_TYPE_LABELS[report.hazard_type]} report has been officially verified`,
        timestamp: new Date(report.updated_at),
        location: report.location_name || undefined,
      });
    });

    setAlerts(emergencyAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, [reports]);

  const getAlertStyles = (type: EmergencyAlert['type']) => {
    switch (type) {
      case 'critical':
        return {
          border: EMERGENCY_COLORS.danger,
          bg: 'bg-red-50',
          text: 'text-red-800',
          icon: 'text-red-600',
        };
      case 'warning':
        return {
          border: EMERGENCY_COLORS.warning,
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          icon: 'text-amber-600',
        };
      case 'info':
        return {
          border: EMERGENCY_COLORS.info,
          bg: 'bg-blue-50',
          text: 'text-blue-800',
          icon: 'text-blue-600',
        };
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Interactive Emergency Operations Center */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all duration-300">
            <Radio className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold group-hover:text-red-100 transition-colors duration-300">Emergency Operations Center</h2>
            <p className="text-red-100 group-hover:text-red-50 transition-colors duration-300">Real-time threat monitoring and community alerts</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">LIVE</span>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2 p-3 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <span className="font-medium">System Status</span>
              <p className="text-xs text-red-100">All systems operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
            <Bell className="w-4 h-4 animate-pulse" />
            <div>
              <span className="font-medium">{alerts.filter(a => a.type === 'critical').length} Critical Alerts</span>
              <p className="text-xs text-red-100">Requiring immediate attention</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
            <Activity className="w-4 h-4" />
            <div>
              <span className="font-medium">Live Reports</span>
              <p className="text-xs text-red-100">Real-time community updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Active Emergency Alerts</span>
          </h3>
        </div>
        <div className="space-y-0">
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p>No active emergency alerts</p>
              <p className="text-sm">All systems normal</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const styles = getAlertStyles(alert.type);
              return (
                <div
                  key={alert.id}
                  className={`p-4 border-l-4 hover:bg-gray-50 cursor-pointer transition-colors ${styles.bg}`}
                  style={{ borderLeftColor: styles.border }}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertTriangle className={`w-4 h-4 ${styles.icon}`} />
                        <h4 className={`font-semibold ${styles.text}`}>{alert.title}</h4>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(alert.timestamp)}</span>
                        </div>
                        {alert.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{alert.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {alert.type === 'critical' && (
                      <div className="ml-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Radio className="w-5 h-5 text-blue-600" />
            <span>Live Activity Feed</span>
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {allReports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div 
                  className="w-3 h-3 rounded-full mt-1.5"
                  style={{ backgroundColor: EMERGENCY_COLORS[report.severity >= 4 ? 'danger' : report.severity >= 3 ? 'warning' : 'info'] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{HAZARD_TYPE_LABELS[report.hazard_type]}</span> reported
                    {report.location_name && <span> in {report.location_name}</span>}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(new Date(report.created_at))}</span>
                    {report.is_verified && (
                      <>
                        <span>•</span>
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">Verified</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedAlert.title}</h3>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <p className="text-gray-700 mb-4">{selectedAlert.message}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{selectedAlert.timestamp.toLocaleString()}</span>
              </div>
              {selectedAlert.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedAlert.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
