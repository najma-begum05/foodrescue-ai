import React, { useState } from 'react';
import { aiService } from '../services/api';
import { 
  X, 
  Sparkles, 
  TrendingUp, 
  Package, 
  Calendar, 
  CloudRain, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function SurplusForecastModal({ isOpen, onClose, onApplyToCreate }) {
  if (!isOpen) return null;

  const [category, setCategory] = useState('Cooked Meals');
  const [preparedQuantity, setPreparedQuantity] = useState(250);
  const [dayOfWeek, setDayOfWeek] = useState('Friday');
  const [eventType, setEventType] = useState('Banquet Buffet');

  const [loading, setLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState(null);

  // Accessibility: Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await aiService.forecastSurplus(
        Number(preparedQuantity),
        category,
        dayOfWeek,
        eventType
      );
      setLoading(false);
      if (res.success) {
        setForecastResult(res.result);
      }
    } catch (err) {
      setLoading(false);
      alert('Prediction error: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="forecast-modal-title"
        className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close surplus forecasting dialog"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Module 8: AI Surplus Forecasting Model
          </div>
          <h3 id="forecast-modal-title" className="text-2xl font-black text-slate-900 tracking-tight">
            Predict End-of-Day Food Surplus
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Simulate expected unsold stock in advance using historical hospitality time-series benchmarks.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handlePredict} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Food Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500 font-semibold"
              >
                <option value="Cooked Meals">Cooked Meals (Buffet / Banquet)</option>
                <option value="Bakery">Bakery & Breads</option>
                <option value="Fresh Produce">Fresh Produce (Fruits & Veggies)</option>
                <option value="Dairy">Dairy Products</option>
                <option value="Packaged Goods">Packaged Grains & Staples</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Batch Prepared / Stocked Today
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                required
                value={preparedQuantity}
                onChange={(e) => setPreparedQuantity(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Day of the Week</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500 font-semibold"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday (High Event Volume)</option>
                <option value="Saturday">Saturday (Weekend Banquets)</option>
                <option value="Sunday">Sunday (Brunch Service)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Weather / Operational Context</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500 font-semibold"
              >
                <option value="Normal">Normal Regular Day</option>
                <option value="Rainy Day">Rainy Weather (Lower Footfall)</option>
                <option value="Corporate Event">Corporate Catered Lunch</option>
                <option value="Banquet Buffet">Large Banquet Buffet</option>
                <option value="Wedding Banquet">Wedding Reception</option>
                <option value="Festival Holiday">Festival Holiday</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Analyzing Historical Gradient...' : 'Generate Surplus Forecast'}</span>
          </button>
        </form>

        {/* Prediction Results Banner */}
        {forecastResult && (
          <div className="mt-6 p-5 rounded-2xl bg-purple-50/80 border border-purple-200 animate-in fade-in duration-300 space-y-4">
            
            <div className="flex items-center justify-between border-b border-purple-200/80 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-700">Expected Unsold Surplus</span>
                <h4 className="text-3xl font-black text-purple-950 mt-0.5">
                  ~{forecastResult.predictedSurplusQuantity} units
                </h4>
                <p className="text-xs text-purple-700">
                  {forecastResult.predictedSurplusPercentage}% of daily preparation
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Confidence</span>
                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-white text-purple-900 border border-purple-200">
                  {forecastResult.predictionConfidence}%
                </span>
              </div>
            </div>

            {/* Strategic Action */}
            <div className="text-xs space-y-1">
              <span className="font-bold text-purple-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" /> Recommended Proactive Action:
              </span>
              <p className="text-slate-700 leading-relaxed pl-5">
                {forecastResult.recommendedAction}
              </p>
            </div>

            {/* Disclaimer per Module 8 */}
            <div className="p-2.5 bg-white rounded-xl border border-purple-100 text-[10px] text-slate-500 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
              <span>
                <strong>Demonstration Prototype:</strong> Generated using synthetic hospitality time-series datasets. Real production deployments integrate with POS inventory tracking.
              </span>
            </div>

            {/* Pre-fill CTA */}
            {onApplyToCreate && (
              <button
                type="button"
                onClick={() => {
                  onApplyToCreate({
                    category,
                    quantity: forecastResult.predictedSurplusQuantity
                  });
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Pre-Fill Surplus Listing Form ({forecastResult.predictedSurplusQuantity} units)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
