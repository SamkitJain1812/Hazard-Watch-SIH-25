import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Plus, User, LogOut, Filter, Shield, TrendingUp, Activity, CheckCircle, Map, Maximize2 } from "lucide-react";
import MapView from "@/react-app/components/MapView";
import ReportsList from "@/react-app/components/ReportsList";
import RoleBadge from "@/react-app/components/RoleBadge";
import EmergencyFeed from "@/react-app/components/EmergencyFeed";
import UserCategorySelector from "@/react-app/components/UserCategorySelector";
import { Report, UserRole, UserCategory } from "@/shared/types";

export default function Dashboard() {
  const { user, isPending, logout } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [userRole, setUserRole] = useState<UserRole>('reporter');
  const [userCategory, setUserCategory] = useState<UserCategory>('local');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [mapHighlightMode, setMapHighlightMode] = useState<'none' | 'high-priority' | 'verified'>('none');

  useEffect(() => {
    if (!isPending && !user) {
      navigate("/");
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reports
        const reportsResponse = await fetch('/api/reports');
        if (reportsResponse.ok) {
          const reportsData = await reportsResponse.json();
          setReports(reportsData);
        }

        // Fetch user data including role
        const userResponse = await fetch('/api/users/me');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserRole(userData.role || 'reporter');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time updates
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isPending || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

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

  // Use sample reports if no real reports exist, otherwise use real reports
  const allReports = reports.length > 0 ? reports : sampleReports;
  
  const filteredReports = filter === 'all' 
    ? allReports 
    : allReports.filter(report => report.hazard_type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-slate-900 relative">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.5) 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}></div>
      
      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-sm shadow-lg border-b border-blue-500/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">HazardWatch</h1>
                <p className="text-xs text-blue-200">Emergency Response Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/report")}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium border border-red-500/50"
              >
                <Plus className="w-5 h-5" />
                <span>Report Emergency</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3">
                  <RoleBadge role={userRole} size="sm" />
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-300" />
                    <span className="text-sm text-white">{user.email}</span>
                    <div className="ml-2">
                      <UserCategorySelector 
                        selectedCategory={userCategory}
                        onCategoryChange={setUserCategory}
                        compact={true}
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-blue-300 hover:text-blue-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Emergency Dashboard */}
          <div className="lg:col-span-3">
            <EmergencyFeed reports={filteredReports} />
          </div>

          {/* Sidebar with Map and Reports */}
          <div className="space-y-6">
            {/* Compact Map Widget */}
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-blue-500/30 overflow-hidden">
              <div className="p-4 border-b border-blue-500/30 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Map className="w-5 h-5" />
                    <h3 className="font-semibold">Live Map - India</h3>
                  </div>
                  <button
                    onClick={() => setIsMapExpanded(true)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-blue-100 mt-1">
                  {filteredReports.length > 0 ? filteredReports.length : 5} active threats
                </p>
              </div>
              <div className="h-64">
                <MapView 
                  reports={filteredReports} 
                  highlightMode={mapHighlightMode}
                />
              </div>
            </div>

            {/* Emergency Stats */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg border-l-4 shadow-2xl border border-blue-500/30" style={{ borderLeftColor: '#3b82f6' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{allReports.length}</div>
                    <div className="text-sm text-gray-300">Total Reports</div>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <button 
                onClick={() => setMapHighlightMode(mapHighlightMode === 'verified' ? 'none' : 'verified')}
                className={`w-full bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg border-l-4 shadow-2xl border border-blue-500/30 hover:bg-slate-700/90 transition-all duration-200 ${mapHighlightMode === 'verified' ? 'ring-2 ring-green-500' : ''}`} 
                style={{ borderLeftColor: '#10b981' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {allReports.filter(r => r.is_verified).length}
                    </div>
                    <div className="text-sm text-gray-300">Verified Threats</div>
                    <div className="text-xs text-green-200 mt-1">Click to view locations</div>
                  </div>
                  <div className="relative">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    {mapHighlightMode === 'verified' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>
              </button>
              <button 
                onClick={() => setMapHighlightMode(mapHighlightMode === 'high-priority' ? 'none' : 'high-priority')}
                className={`w-full bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg border-l-4 shadow-2xl border border-blue-500/30 hover:bg-slate-700/90 transition-all duration-200 ${mapHighlightMode === 'high-priority' ? 'ring-2 ring-red-500' : ''}`} 
                style={{ borderLeftColor: '#ef4444' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {allReports.filter(r => r.severity >= 4).length}
                    </div>
                    <div className="text-sm text-gray-300">High Priority</div>
                    <div className="text-xs text-red-200 mt-1">Click to view locations</div>
                  </div>
                  <div className="relative">
                    <TrendingUp className="w-8 h-8 text-red-600" />
                    {mapHighlightMode === 'high-priority' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Compact Reports List */}
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-blue-500/30">
              <div className="p-4 border-b border-blue-500/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Recent Reports</h3>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-blue-300" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="text-xs bg-slate-700 border-blue-500/30 rounded text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="flooding">Flooding</option>
                      <option value="wildfire">Wildfire</option>
                      <option value="earthquake">Earthquake</option>
                      <option value="severe_weather">Weather</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <ReportsList reports={filteredReports.slice(0, 5)} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Map Modal */}
      {isMapExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl max-w-6xl w-full h-5/6 flex flex-col border border-blue-500/30 shadow-2xl">
            <div className="p-6 border-b border-blue-500/30 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
              <div>
                <h2 className="text-xl font-semibold text-white">Live Hazard Map - India</h2>
                <p className="text-sm text-blue-100">Real-time threats and emergency reports</p>
              </div>
              <button
                onClick={() => setIsMapExpanded(false)}
                className="text-blue-200 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            <div className="flex-1">
              <MapView 
                reports={filteredReports} 
                highlightMode={mapHighlightMode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
