import React, { useState } from "react";
import {
  User,
  Shield,
  Palette,
  AlertTriangle,
  LogOut,
  Trash2,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Camera,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [twoFactor, setTwoFactor] = useState(true);
  
 const { admin, logout } = useAuth();

//  console.log(admin)
 const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen ">
      <div className="flex m-auto w-[90%] flex-col gap-6">

        {/* Admin Profile */}
        <section className="rounded-2xl  bg-white p-6 shadow-sm ring-1 mt-5 ring-black/5">
          <div className="mb-5 flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-gray-900">Admin Profile</h2>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <User
                className="h-14 w-14 rounded-full  bg-primary text-white"
              />
             
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                  Display Name
                </label>
                <input
                  type="text"
                  disabled
                  
                  defaultValue={admin.username || "Admin"}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary-light"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide text-pink-500">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  defaultValue={admin.email}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary-light"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="mb-5 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-gray-900">Security</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Current Password
              </label>
              <input
                type="password"
                disabled
                defaultValue="•••••••"
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary-light"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                New Password
              </label>
              <input
                type="password"
                defaultValue="•••••••"
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary-light"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Confirm New Password
              </label>
              <input
                type="password"
                defaultValue="•••••••"
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary-light"
              />
            </div>
          </div>

    
       
        </section>

        {/* Preferences */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-gray-900">Preferences</h2>
          </div>

          <div className="">
            {/* Left column */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Theme Selector
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "light", label: "Light", icon: Sun },
                    { key: "dark", label: "Dark", icon: Moon },
                    // { key: "system", label: "System", icon: Monitor },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors ${
                        theme === key
                          ? "border-primary bg-violet-50 text-primary"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

             
            </div>

          
          </div>
        </section>

        {/* Danger Zone */}
        {/* <section className="rounded-2xl border border-red-100 bg-red-50/50 p-6 ring-1 ring-black/5 mb-5">
          <div className="mb-1 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h2 className="text-sm font-semibold text-red-600">Danger Zone</h2>
          </div>
          <p className="mb-4 text-xs text-gray-500">
            Irreversible actions that affect your entire workspace and account status.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="flex items-center justify-center cursor-pointer gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 sm:w-auto">
              <LogOut className="h-3.5 w-3.5 cursor-pointer" />
              Logout
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white hover:bg-red-600 sm:w-auto">
              <Trash2 className="h-3.5 w-3.5" />
              Delete Account
            </button>
          </div>
        </section> */}

            <button onClick={handleLogout} className="flex items-center justify-center w-[85%] cursor-pointer gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-100 sm:w-auto">
              <LogOut className="h-3.5 w-3.5 cursor-pointer" />
              Logout
            </button>
      </div>
    </div>
  );
}