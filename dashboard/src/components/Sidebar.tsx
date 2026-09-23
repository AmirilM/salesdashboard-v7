import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Boxes, FileBarChart2, LogOut, ChevronDown, ChevronRight, Gem } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/daily', label: 'Daily', icon: CalendarDays },
  { path: '/product', label: 'Product', icon: Boxes },
  { path: '/report', label: 'Report', icon: FileBarChart2 },
];

export const Sidebar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { stores, selectedStoreCode, setSelectedStoreCode, loading } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredStores = stores.filter(store =>
    store.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.store_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedStore = stores.find(s => s.store_code === selectedStoreCode);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="w-64 m-4 mr-0 bg-white rounded-2xl shadow-sm flex flex-col h-[calc(100vh-2rem)] sticky top-4">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-[#6B4C9A] p-2 rounded-xl text-white">
          <Gem className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold text-[#1A1A2E] tracking-tight">Lesale.co</h1>
      </div>

      {/* Store Filter */}
      <div className="px-6 py-2">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="truncate text-xs font-semibold text-gray-700">
              {loading ? 'Loading...' : selectedStore ? `${selectedStore.store_name}` : 'Semua Store'}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-50 max-h-64 overflow-hidden">
              <div className="p-2 border-b border-gray-50">
                <input
                  type="text"
                  placeholder="Cari store..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B4C9A]"
                />
              </div>

              <div className="overflow-y-auto max-h-48">
                <button
                  onClick={() => {
                    setSelectedStoreCode(null);
                    setIsDropdownOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${!selectedStoreCode ? 'bg-purple-50 text-[#6B4C9A] font-medium' : 'text-gray-600'}`}
                >
                  Semua Store
                </button>
                {filteredStores.map(store => (
                  <button
                    key={store.store_code}
                    onClick={() => {
                      setSelectedStoreCode(store.store_code);
                      setIsDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 ${selectedStoreCode === store.store_code ? 'bg-purple-50 text-[#6B4C9A] font-medium' : 'text-gray-600'}`}
                  >
                    <div className="truncate">{store.store_name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1.5">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#6B4C9A] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-[#6B4C9A] font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {user?.email ? user.email.split('@')[0] : 'User'}
              </p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};