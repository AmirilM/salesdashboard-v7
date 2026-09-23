import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Search, MessageSquare, Bell } from 'lucide-react';

export const Layout = () => {
  const location = useLocation();
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Overview';
      case '/daily': return 'Daily Report';
      case '/product': return 'Product Performance';
      case '/report': return 'Report';
      default: return 'Overview';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-[#F5F5F7] flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-bold text-[#1A1A2E]">{getPageTitle()}</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-10 pr-4 py-2 bg-white border-none rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#6B4C9A] shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2.5 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600 transition-colors">
                <MessageSquare className="h-5 w-5" />
              </button>
              <button className="p-2.5 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-600 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
