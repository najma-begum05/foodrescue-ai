import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Bot, 
  X, 
  Send, 
  MessageSquare, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SUGGESTED_QUESTIONS = [
  'How does the AI matching score work?',
  'What are the food safety and inspection rules?',
  'How does inventory lock prevent over-claiming?',
  'How can restaurants predict surplus food?',
  'How do I claim a food donation as an NGO?'
];

const BOT_KNOWLEDGE = [
  {
    keywords: ['match', 'score', 'algorithm', 'criteria', 'recommendation'],
    title: 'AI Multi-Criteria Matching Engine (Module 6)',
    reply: `Our AI Matching Engine calculates a 0–100 compatibility score using four weighted operational pillars:
    
1. Geographic Distance (35%): Evaluates Haversine distance. Listings within 5 km receive top scores.
2. Expiry Urgency (25%): Prioritizes items needing immediate redistribution (e.g., hot meals < 4 hours).
3. Dietary Alignment (20%): Matches NGO requirements (Vegetarian, Halal, Vegan, Produce).
4. Capacity Compatibility (20%): Ensures the NGO can consume the batch without secondary spoilage.

Each recommendation includes a clear, natural language explanation detailing why the match was generated!`
  },
  {
    keywords: ['safety', 'inspection', 'temperature', 'regulation', 'fssai', 'safe', 'spoilage'],
    title: 'Food Safety & Human Sensory Protocol (Module 7)',
    reply: `Food security platforms must prioritize public health. FoodRescue AI operates under strict regulatory food safety rules:

• AI Priority vs. Physical Inspection: The AI predicts urgency and prioritizes routing, but CANNOT independently guarantee microbiological safety.
• Mandatory Handover Inspection: At collection, donors and recipients must perform a three-point sensory check: Visual appearance, Fresh aroma/odor, and Thermal probe.
• Thermal Danger Zone: Hot meals must be maintained >65°C and cold dairy <4°C. Food between 5°C and 60°C for over 2 hours is strictly prohibited from redistribution.`
  },
  {
    keywords: ['inventory', 'lock', 'reserve', 'concurrency', 'over-claim', 'stock'],
    title: 'Multi-Recipient Inventory Lock (Module 5)',
    reply: `To prevent race conditions where multiple charities request the same surplus batch:

• Atomic Deduction: When an NGO submits a claim, the system validates Q_req <= Q_avail and instantly decrements available inventory.
• Automatic Status Transition: If available inventory reaches 0, the listing automatically transitions to "Reserved" or "Accepted".
• Safe Inventory Release: If a donor declines the claim or the charity cancels, the locked quantity is automatically restored to the public listing.`
  },
  {
    keywords: ['predict', 'forecast', 'surplus', 'unsold', 'end-of-day', 'waste'],
    title: 'AI Surplus Forecasting (Module 8)',
    reply: `Our predictive surplus model simulates expected unsold inventory before end-of-day service:

• Historical Benchmarks: Analyzes day-of-week, footfall context (banquets, rainy days), and food category decay rates.
• Strategic Recommendations: Suggests proactive community discounts at 6:00 PM or early donor listings for nearby shelters.
• One-Click Pre-fill: Providers can directly transfer predicted surplus figures into the Food Surplus Listing form with one click!`
  },
  {
    keywords: ['logistics', 'route', 'map', 'driver', 'osm', 'transit', 'optimize'],
    title: 'Logistics & Route Optimization (Module 9)',
    reply: `Our logistics system runs on free OpenStreetMap tiles and Leaflet:

• Multi-Stop Optimization: Solves multi-point pickups and dropoffs with precedence constraints (pickups strictly precede dropoffs).
• Hot-Meal Priority: High-urgency cooked meals are scheduled first to preserve safe serving temperatures.
• Environmental Impact: Bundled routes save an average of ~5.5 km of urban driving per run, preventing ~1.07 kg of CO2 emissions!`
  },
  {
    keywords: ['ngo', 'claim', 'request', 'receive', 'charity', 'shelter'],
    title: 'NGO Surplus Discovery & Claiming',
    reply: `Verified NGOs and community kitchens can discover available surplus in three simple steps:

1. Browse the "Available Food" directory or check your NGO Dashboard for AI-recommended matches.
2. Click "Claim Food Portion" and specify your needed quantity.
3. Coordinate collection with the donor or an assigned fleet driver. Once received, click "Confirm Receipt" to close the donation loop!`
  }
];

export default function RescueBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am RescueBot AI, your food surplus and redistribution assistant. How can I help you today?',
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend = null) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setTyping(true);

    // Simulate intelligent bot thinking
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let matchedEntry = BOT_KNOWLEDGE.find(entry => 
        entry.keywords.some(k => lowerQuery.includes(k))
      );

      let botReply = '';
      if (matchedEntry) {
        botReply = matchedEntry.reply;
      } else {
        botReply = `I understand you are asking about "${query}".
        
FoodRescue AI connects food surplus providers (restaurants, caterers, supermarkets) with verified charities and shelters using multi-criteria AI matching and Leaflet routing.

You can ask me about:
• AI Match Scoring formulas
• Food safety and handover inspection rules
• Multi-recipient inventory locking
• Surplus forecasting
• How to register and claim donations`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group px-4 py-3.5 rounded-full bg-gradient-to-r from-emerald-700 to-teal-800 text-white font-extrabold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition flex items-center gap-2.5 cursor-pointer border border-emerald-500/30"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </div>
            <span>RescueBot AI</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          </button>
        )}
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Bot className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                  <span>RescueBot AI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                </h4>
                <p className="text-[10px] text-emerald-200">Knowledge Assistant & Policy Advisor</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick FAQ Suggestion Pills */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-600 text-slate-700 hover:text-emerald-800 font-semibold shrink-0 transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-[#FAFBF9]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {typing && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200 w-24 text-slate-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-200" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sensory Protocol Reminder */}
          <div className="px-3.5 py-1.5 bg-emerald-50 border-t border-emerald-100 text-[10px] text-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>AI prioritizes urgency. Always verify food sensory quality at collection.</span>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask RescueBot about matching, safety, routing..."
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
