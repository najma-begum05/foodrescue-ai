import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle, 
  Package, 
  X,
  ExternalLink
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Critical Expiry Alert',
    message: 'Banquet Meals at Royal Palace have 3.5 hours remaining. Accelerated claim recommended.',
    type: 'urgent',
    timestamp: '10 mins ago',
    read: false,
    link: '/available-food'
  },
  {
    id: 'notif-2',
    title: 'AI Match Found (98% Score)',
    message: 'Hope Haven Shelter matched with 120 hot banquet meals located 2.8 km away.',
    type: 'ai',
    timestamp: '25 mins ago',
    read: false,
    link: '/available-food'
  },
  {
    id: 'notif-3',
    title: 'Donation Claim Approved',
    message: 'Boulangerie Bakery accepted your claim for 45 artisan sourdough loaves.',
    type: 'success',
    timestamp: '1 hour ago',
    read: true,
    link: '/dashboard/ngo'
  },
  {
    id: 'notif-4',
    title: 'Driver En Route',
    message: 'Logistics Van TS 09 EQ 4421 has picked up Bakery shipment and is in transit.',
    type: 'logistics',
    timestamp: '2 hours ago',
    read: true,
    link: '/dashboard/logistics'
  },
  {
    id: 'notif-5',
    title: 'New Surplus Broadcast',
    message: 'Green Valley Organic Farms listed 250 kg fresh seasonal fruit.',
    type: 'info',
    timestamp: '3 hours ago',
    read: true,
    link: '/available-food'
  }
];

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'urgent'
  const dropdownRef = useRef(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'urgent') return n.type === 'urgent';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'logistics':
        return <Truck className="w-4 h-4 text-blue-600" />;
      default:
        return <Package className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer flex items-center justify-center"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] flex items-center justify-center ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 text-xs font-semibold bg-white">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filter === 'all' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filter === 'unread' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('urgent')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                filter === 'urgent' ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Urgent
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No notifications in this view.
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
                    !item.read ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0 p-1.5 rounded-lg bg-slate-100">
                    {getIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h5 className={`text-xs truncate ${!item.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {item.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                      {item.message}
                    </p>
                  </div>

                  <button
                    onClick={(e) => clearNotification(item.id, e)}
                    className="p-1 text-slate-300 hover:text-slate-600 rounded-md transition"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-medium">
              Real-time In-App Notification Center &bull; Module 10
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
