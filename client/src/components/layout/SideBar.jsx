import React from 'react'
import { Shield,X,LogOut } from 'lucide-react'
import {NavItem, navItems} from './AppLayout'
export default function SideBar({sidebarOpen,sidebarCollapsed,admin,logout}) {
  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full bg-white  shadow-md rounded-3xl z-50 transition-all duration-300
          ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
          lg:translate-x-0 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-16  ">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-semibold text-surface-900 dark:text-surface-100">
                  Bot Admin
                </span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} collapsed={sidebarCollapsed} />
            ))}
          </nav>

          {/* Footer */}
          <div className="px-3 py-4  dark:border-surface-800">
            {admin && !sidebarCollapsed && (
              <div className="px-3 py-2 mb-2 text-xs text-surface-500 dark:text-surface-400 truncate">
                {admin.email}
              </div>
            )}
            <button
              onClick={logout}
              className={`flex items-center cursor-pointer bg-gray-200 dark:bg-surface-800 gap-3 w-full px-3 py-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>
      </>
  )
}
