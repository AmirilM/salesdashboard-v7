import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Boxes, FileBarChart2, LogOut, Search, ChevronDown } from 'lucide-react';
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
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">Sales Dashboard</h1>
      </div>

      {/* Store Filter */}
      <div className="p-4 border-b border-gray-100">
        <label className="text-xs font-medium text-gray-500 mb-2 block">Filter Store</label>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <span className="truncate text-gray-700">
              {loading ? 'Loading...' : selectedStore ? `${selectedStore.store_name} (${selectedStore.store_code})` : 'Semua Store'}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari store..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Store List */}
              <div className="overflow-y-auto max-h-48">
                <button
                  onClick={() => {
                    setSelectedStoreCode(null);
                    setIsDropdownOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${!selectedStoreCode ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
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
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${selectedStoreCode === store.store_code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                  >
                    <div className="font-medium">{store.store_name}</div>
                    <div className="text-xs text-gray-400">{store.store_code}</div>
                  </button>
                ))}
                {filteredStores.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-400">Tidak ada store ditemukan</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2 truncate">{user?.email}</p>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};