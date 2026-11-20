import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { logisticsService } from '../services/api';
import LogisticsMap from '../components/LogisticsMap';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Phone, 
  ShieldCheck, 
  TrendingUp, 
  Package, 
  Sparkles, 
  RefreshCw,
  Thermometer,
  Layers,
  ArrowRight,
  AlertTriangle,
  Leaf
} from 'lucide-react';

export default function LogisticsDashboard() {
  const { user } = useAuth();

  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed'

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const res = await logisticsService.getShipments();
      if (res.success && res.shipments) {
        setShipments(res.shipments);
        if (!selectedShipment && res.shipments.length > 0) {
          setSelectedShipment(res.shipments[0]);
        }
      }
    } catch (err) {
      console.warn('Logistics fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await logisticsService.updateShipmentStatus(id, newStatus);
      if (res.success) {
        setStatusMessage(`Shipment status updated to "${newStatus}"!`);
        setShipments(shipments.map(s => s._id === id ? { ...s, status: newStatus } : s));
        if (selectedShipment && selectedShipment._id === id) {
          setSelectedShipment(prev => ({ ...prev, status: newStatus }));
        }
        setTimeout(() => setStatusMessage(null), 3500);
      }
    } catch (err) {
      alert('Error updating shipment: ' + err.message);
    }
  };

  const handleOptimizeRoute = async () => {
    setOptimizing(true);
    try {
      const res = await logisticsService.optimizeMultiStopRoute();
      setOptimizing(false);
      if (res.success) {
        setOptimizedRoute(res);
        setSelectedShipment(null); // Show the whole optimized circuit on map
        setStatusMessage(`AI Multi-Stop Route optimized! ${res.distanceSavedKm} km saved (${res.co2SavedKg} kg CO2 prevented).`);
        setTimeout(() => setStatusMessage(null), 5000);
      }
    } catch (err) {
      setOptimizing(false);
      alert('Optimization error: ' + err.message);
    }
  };

  // Metrics
  const pendingCount = shipments.filter(s => s.status === 'Pickup Scheduled').length;
  const inTransitCount = shipments.filter(s => s.status === 'In Transit').length;
  const deliveredCount = shipments.filter(s => s.status === 'Delivered').length;
  const totalKmRescued = shipments.reduce((acc, curr) => acc + (curr.distanceKm || 0), 0);

  const filteredShipments = shipments.filter(s => {
    if (activeTab === 'active') return s.status !== 'Delivered';
    if (activeTab === 'completed') return s.status === 'Delivered';
    return true;
  });

  return (
    <DashboardLayout
      title={`Logistics Fleet Desk: ${user?.name || 'Driver'}`}
      subtitle={`Route Coordination & Insulated Dispatch • ${user?.organizationName || 'FoodRescue Logistics'}`}
    >
      <div className="space-y-8">
        
        {/* Status Toast */}
        {statusMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-2xl flex items-center gap-2 animate-in fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Dispatches</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-slate-900">{shipments.length}</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Today</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Active donor pickups & deliveries</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">In Transit Now</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-purple-700">{inTransitCount}</h3>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">Live GPS</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">En route with thermal containment</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Route Distance</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-black text-blue-700">{totalKmRescued.toFixed(1)} km</h3>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">Optimized</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Urban transit circuit mapped</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Vehicle Insulation</span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-2xl font-black text-emerald-700">Insulated</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Passed</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Hot-box & cold-chain thermal compliant</p>
          </div>
        </div>

        {/* Action Header Banner with Route Optimizer Button */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/70 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Module 9: OpenStreetMap & AI Route Optimization
            </div>
            <h3 className="text-2xl font-black">Fleet Logistics & Interactive Map</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Track live food transit from donor kitchens to charity shelters. Use the AI Multi-Stop Optimizer to sequence pickups and minimize hot-meal transit delay.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {optimizedRoute && (
              <button
                onClick={() => setOptimizedRoute(null)}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
              >
                Reset Map View
              </button>
            )}
            <button 
              onClick={handleOptimizeRoute}
              disabled={optimizing}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Navigation className="w-4 h-4" />
              <span>{optimizing ? 'Calculating Shortest Path...' : 'Optimize Multi-Stop Route'}</span>
            </button>
          </div>
        </div>

        {/* AI Optimized Route Summary Banner (if active) */}
        {optimizedRoute && (
          <div className="p-6 rounded-3xl bg-purple-50 border border-purple-200 text-slate-800 animate-in fade-in space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-200 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700">AI Sequenced Transit Circuit</span>
                <h4 className="text-xl font-black text-purple-950 mt-0.5">
                  Optimal Path: {optimizedRoute.totalDistanceKm} km (~{optimizedRoute.estimatedMinutes} mins)
                </h4>
                <p className="text-xs text-purple-700 mt-1">
                  {optimizedRoute.recommendation}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-xl border border-purple-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance Saved</span>
                  <span className="text-base font-black text-purple-900">{optimizedRoute.distanceSavedKm} km</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-purple-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center justify-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-600" /> CO2 Saved
                  </span>
                  <span className="text-base font-black text-emerald-700">{optimizedRoute.co2SavedKg} kg</span>
                </div>
              </div>
            </div>

            {/* Turn-by-Turn Waypoints Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {optimizedRoute.optimizedSequence?.map((st, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-purple-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      st.type === 'pickup' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      Stop {idx + 1}: {st.type === 'pickup' ? 'Pickup' : 'Dropoff'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{st.cumulativeKm} km</span>
                  </div>
                  <h5 className="font-bold text-slate-900 truncate">{st.name}</h5>
                  <p className="text-[11px] text-slate-500 truncate">📍 {st.address}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Leaflet OpenStreetMap Container */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                <span>OpenStreetMap Live Transit Grid</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any route or marker to inspect pickup details, food compliance, and navigation links.
              </p>
            </div>
            
            <button
              onClick={fetchShipments}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition self-start sm:self-auto"
              title="Refresh GPS locations"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} />
            </button>
          </div>

          <LogisticsMap 
            shipments={shipments}
            selectedShipment={selectedShipment}
            optimizedRoute={optimizedRoute}
            onSelectShipment={(ship) => setSelectedShipment(ship)}
          />
        </div>

        {/* Dispatches List & Action Controls */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Header & Tabs */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Assigned Transit Manifest</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage delivery progression from pickup to charity verification</p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({shipments.length})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'active' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Active Runs ({shipments.filter(s => s.status !== 'Delivered').length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'completed' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Delivered ({deliveredCount})
              </button>
            </div>
          </div>

          {/* Shipments Cards */}
          <div className="divide-y divide-slate-100 p-6 space-y-4">
            {filteredShipments.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No shipments found in this category.
              </div>
            ) : (
              filteredShipments.map((ship) => {
                const isSelected = selectedShipment?._id === ship._id;
                return (
                  <div
                    key={ship._id}
                    onClick={() => {
                      setSelectedShipment(ship);
                      setOptimizedRoute(null);
                    }}
                    className={`p-6 rounded-2xl border transition cursor-pointer space-y-5 ${
                      isSelected 
                        ? 'border-purple-500 bg-purple-50/30 ring-2 ring-purple-100 shadow-xs' 
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    
                    {/* Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                          {ship.trackingCode || ship._id}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          ship.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                          ship.urgency === 'URGENT' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ship.urgency} Shelf-Life
                        </span>
                        <span className="text-xs text-slate-500">
                          &bull; Est. Distance: {ship.distanceKm} km (~{ship.estimatedMinutes} mins)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          ship.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          ship.status === 'In Transit' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ship.status}
                        </span>
                      </div>
                    </div>

                    {/* Food Info */}
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">
                        {ship.foodName} &bull; <span className="text-emerald-700">{ship.quantity} {ship.unit}</span>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Thermometer className="w-3.5 h-3.5 text-purple-600" />
                        <span>Thermal Containment: <strong>{ship.storageRequirement}</strong></span>
                        <span className="text-slate-300">|</span>
                        <span>Van: <strong>{ship.assignedDriver?.vehicleNumber}</strong></span>
                      </div>
                    </div>

                    {/* Route Waypoints (Origin -> Destination) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      
                      {/* Pickup */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> 1. Pickup Origin (Donor)
                        </span>
                        <h5 className="font-bold text-slate-900">{ship.provider?.name}</h5>
                        <p className="text-slate-500 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{ship.provider?.address}</span>
                        </p>
                        <p className="text-slate-600 flex items-center gap-1 pt-1 font-semibold">
                          <Phone className="w-3 h-3 text-slate-400" /> {ship.provider?.contact}
                        </p>
                      </div>

                      {/* Delivery */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> 2. Delivery Destination (Shelter)
                        </span>
                        <h5 className="font-bold text-slate-900">{ship.recipient?.name}</h5>
                        <p className="text-slate-500 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{ship.recipient?.address}</span>
                        </p>
                        <p className="text-slate-600 flex items-center gap-1 pt-1 font-semibold">
                          <Phone className="w-3 h-3 text-slate-400" /> {ship.recipient?.contact}
                        </p>
                      </div>

                    </div>

                    {/* Handover Action Footer */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                      
                      {/* Sensory Disclaimer */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Perform visual & thermal sensory inspection at handover before sign-off.</span>
                      </div>

                      {/* Transition Buttons */}
                      <div className="flex items-center gap-2">
                        {ship.status === 'Pickup Scheduled' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(ship._id, 'In Transit');
                            }}
                            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Truck className="w-4 h-4" />
                            <span>Confirm Pickup & Start Transit</span>
                          </button>
                        )}

                        {ship.status === 'In Transit' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(ship._id, 'Delivered');
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirm Safe Delivery Handover</span>
                          </button>
                        )}

                        {ship.status === 'Delivered' && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Handover Completed
                          </span>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
