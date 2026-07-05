import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Terminal,
  ScrollText,
  Server,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SideBar from './SideBar';

export const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/commands', icon: Terminal, label: 'Commands' },
  { to: '/rules', icon: ScrollText, label: 'Rules' },
  { to: '/servers', icon: Server, label: 'Servers' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const  NavItem= ({ to, icon: Icon, label, collapsed })=> {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-3 rounded-lg  transition-colors ${
          isActive
            ? 'bg-primary-600 bg-primary text-white'
            : 'text-gray-700 hover:text-gray-800 dark:hover:bg-surface-800'
        } ${collapsed ? 'justify-center' : ''}`
      }
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </NavLink>
  );
}

export default function AppLayout() {
  const { admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-surface-900/50 dark:bg-surface-950/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
    <SideBar sidebarOpen={sidebarOpen} sidebarCollapsed={sidebarCollapsed} admin={admin} logout={logout}/>


      {/* Main content */}
      <div
        className={`transition-all duration-300  ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 h-12 bg-white/80 dark:bg-surface-900/80 backdrop-blur  dark:border-surface-800 z-30 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg cursor-pointer text-primary hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block p-2 rounded-lg text-primary cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="max-w-7xl  mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
