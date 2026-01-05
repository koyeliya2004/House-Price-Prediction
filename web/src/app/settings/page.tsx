"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Home, 
  User, 
  Shield, 
  Palette, 
  ChevronRight, 
  CheckCircle2,
  Moon,
  Sun,
  TrendingUp,
  FileText,
  HelpCircle,
  LogOut
} from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<{ name: string; email?: string; avatar?: string; provider: string } | null>(null);
  const [activeSection, setActiveSection] = useState("account");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("medium");
  const [compactMode, setCompactMode] = useState(false);
  const [showAnimations, setShowAnimations] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const userData = { 
          name: parsed.name || "User", 
          email: parsed.email || "",
          avatar: parsed.avatar || "",
          provider: parsed.provider || "password" 
        };
        setUser(userData);
        
        // Split name into first and last
        const nameParts = userData.name.split(" ");
        setFirstName(nameParts[0] || "");
        setLastName(nameParts.slice(1).join(" ") || "");
        setEmail(userData.email || "");
      } catch (_e) {
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("authUser");
    router.push("/");
  };

  const saveChanges = () => {
    if (user) {
      const updatedUser = {
        ...user,
        name: `${firstName} ${lastName}`.trim(),
        email: email,
      };
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Changes saved successfully!");
    }
  };

  const changePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    // In a real app, verify current password with backend
    alert("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const toggle2FA = () => {
    setTwoFAEnabled(!twoFAEnabled);
    alert(twoFAEnabled ? "2FA disabled" : "2FA enabled successfully!");
  };

  const saveAppearance = () => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("compactMode", String(compactMode));
    localStorage.setItem("showAnimations", String(showAnimations));
    localStorage.setItem("highContrast", String(highContrast));
    alert("Appearance settings saved!");
  };

  return (
    <main className="min-h-screen bg-[#0a0f1a] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#151b2d] border-r border-white/5 flex flex-col">
        {/* User Profile */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-lg font-black">
                {firstName.charAt(0) || "U"}
              </div>
            )}
            <div>
              <p className="font-bold text-white">{user?.name || "Guest"}</p>
              <p className="text-xs text-white/50">{user?.email || "sam@email.com"}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <p className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-3 px-3">Menu</p>
          <div className="space-y-1">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
              <Home size={20} className="text-blue-400" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link href="/buy" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
              <TrendingUp size={20} className="text-cyan-400" />
              <span className="text-sm font-medium">Predictions</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
              <User size={20} className="text-purple-400" />
              <span className="text-sm font-medium">Profile</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 transition-colors">
              <Shield size={20} />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>

          <p className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-3 px-3 mt-6">Other Menu</p>
          <div className="space-y-1">
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
              <FileText size={20} className="text-teal-400" />
              <span className="text-sm font-medium">History</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
              <HelpCircle size={20} className="text-amber-400" />
              <span className="text-sm font-medium">Help</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Settings Menu */}
        <div className="w-96 bg-[#0f1420] p-8 border-r border-white/5">
          <h2 className="text-2xl font-black mb-8">Settings</h2>

          {/* Settings Menu Items */}
          <div className="space-y-2">
            <button 
              onClick={() => setActiveSection("appearance")}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-colors border ${activeSection === "appearance" ? "bg-white/10 border-emerald-500/30" : "bg-white/5 hover:bg-white/10 border-white/10"}`}
            >
              <div className="flex items-center gap-3">
                <Palette size={20} className="text-white/60" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Appearances</p>
                  <p className="text-xs text-white/50">Dark and Light Mode, Font size</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/40" />
            </button>

            <button 
              onClick={() => setActiveSection("account")}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-colors border ${activeSection === "account" ? "bg-white/10 border-emerald-500/30" : "bg-white/5 hover:bg-white/10 border-white/10"}`}
            >
              <div className="flex items-center gap-3">
                <User size={20} className="text-white/60" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Account Settings</p>
                  <p className="text-xs text-white/50">Personal Informations, Email</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/40" />
            </button>

            <button 
              onClick={() => setActiveSection("security")}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-colors border ${activeSection === "security" ? "bg-white/10 border-emerald-500/30" : "bg-white/5 hover:bg-white/10 border-white/10"}`}
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-white/60" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Security</p>
                  <p className="text-xs text-white/50">Change Password, 2FA</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/40" />
            </button>
          </div>
        </div>

        {/* Right Panel - Dynamic Content */}
        <div className="flex-1 p-8">
          <div className="max-w-2xl">
            {activeSection === "account" && (
              <>
            <h2 className="text-2xl font-black mb-8">Account Settings</h2>

            {/* Personal Informations */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-2">Personal Informations</h3>
              <p className="text-white/50 text-sm mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-2">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#151b2d] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Samantha"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#151b2d] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                      placeholder="William"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#151b2d] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors pr-32"
                      placeholder="sam@email.com"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 size={16} />
                      Email Verified
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/")}
                className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                Discard Changes
              </button>
              <button
                onClick={saveChanges}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm hover:from-indigo-600 hover:to-purple-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
            </>
            )}

            {/* Appearance Section */}
            {activeSection === "appearance" && (
              <>
                <h2 className="text-2xl font-black mb-8">Appearance</h2>

                <div className="space-y-8">
                  {/* Theme */}
                  <div>
                    <h3 className="text-lg font-bold mb-4">Theme</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setTheme("dark")}
                        className={`p-6 rounded-xl border-2 transition-colors ${theme === "dark" ? "border-emerald-500 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Moon size={24} />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === "dark" ? "border-emerald-500" : "border-white/20"}`}>
                            {theme === "dark" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>}
                          </div>
                        </div>
                        <p className="font-bold">Dark Mode</p>
                        <p className="text-xs text-white/50 mt-1">{theme === "dark" ? "Current theme" : "Switch to dark"}</p>
                      </button>
                      <button 
                        onClick={() => setTheme("light")}
                        className={`p-6 rounded-xl border-2 transition-colors ${theme === "light" ? "border-emerald-500 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Sun size={24} />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === "light" ? "border-emerald-500" : "border-white/20"}`}>
                            {theme === "light" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>}
                          </div>
                        </div>
                        <p className="font-bold">Light Mode</p>
                        <p className="text-xs text-white/50 mt-1">{theme === "light" ? "Current theme" : "Switch to light"}</p>
                      </button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <h3 className="text-lg font-bold mb-4">Font Size</h3>
                    <div className="space-y-3">
                      <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-white/10 transition-colors border ${fontSize === "small" ? "bg-white/10 border-emerald-500/30" : "bg-white/5 border-white/10"}`}>
                        <span className="text-sm">Small</span>
                        <input 
                          type="radio" 
                          name="fontSize" 
                          checked={fontSize === "small"}
                          onChange={() => setFontSize("small")}
                          className="w-4 h-4 accent-emerald-500" 
                        />
                      </label>
                      <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-white/10 transition-colors border ${fontSize === "medium" ? "bg-white/10 border-emerald-500/30" : "bg-white/5 border-white/10"}`}>
                        <span className="text-sm">Medium (Default)</span>
                        <input 
                          type="radio" 
                          name="fontSize" 
                          checked={fontSize === "medium"}
                          onChange={() => setFontSize("medium")}
                          className="w-4 h-4 accent-emerald-500" 
                        />
                      </label>
                      <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-white/10 transition-colors border ${fontSize === "large" ? "bg-white/10 border-emerald-500/30" : "bg-white/5 border-white/10"}`}>
                        <span className="text-sm">Large</span>
                        <input 
                          type="radio" 
                          name="fontSize" 
                          checked={fontSize === "large"}
                          onChange={() => setFontSize("large")}
                          className="w-4 h-4 accent-emerald-500" 
                        />
                        <input type="radio" name="fontSize" className="w-4 h-4 accent-emerald-500" />
                      </label>
                    </div>
                  </div>

                  {/* Display Settings */}
                  <div>
                    <h3 className="text-lg font-bold mb-4">Display Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                        <div>
                          <p className="font-semibold text-sm">Compact Mode</p>
                          <p className="text-xs text-white/50 mt-1">Reduce spacing for denser layout</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={compactMode}
                          onChange={(e) => setCompactMode(e.target.checked)}
                          className="w-5 h-5 accent-emerald-500" 
                        />
                      </label>
                      <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                        <div>
                          <p className="font-semibold text-sm">Show Animations</p>
                          <p className="text-xs text-white/50 mt-1">Enable smooth transitions</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={showAnimations}
                          onChange={(e) => setShowAnimations(e.target.checked)}
                          className="w-5 h-5 accent-emerald-500" 
                        />
                      </label>
                      <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                        <div>
                          <p className="font-semibold text-sm">High Contrast</p>
                          <p className="text-xs text-white/50 mt-1">Increase contrast for better visibility</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={highContrast}
                          onChange={(e) => setHighContrast(e.target.checked)}
                          className="w-5 h-5 accent-emerald-500" 
                        />
                      </label>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex gap-4">
                    <button
                      onClick={saveAppearance}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm hover:from-indigo-600 hover:to-purple-700 transition-colors"
                    >
                      Save Appearance
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <>
                <h2 className="text-2xl font-black mb-8">Security</h2>

                <div className="space-y-8">
                  {/* Change Password */}
                  <div>
                    <h3 className="text-lg font-bold mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-white/50 mb-2">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-[#151b2d] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/50 mb-2">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-[#151b2d] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/50 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-[#151b2d] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button 
                        onClick={changePassword}
                        className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div>
                    <h3 className="text-lg font-bold mb-4">Two-Factor Authentication (2FA)</h3>
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-semibold mb-1">Authenticator App</p>
                          <p className="text-sm text-white/50">Use an authenticator app to get verification codes</p>
                        </div>
                        <button 
                          onClick={toggle2FA}
                          className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors ${twoFAEnabled ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}`}
                        >
                          {twoFAEnabled ? "Disable" : "Enable"}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <Shield size={14} />
                        <span>{twoFAEnabled ? "Enabled" : "Not configured"}</span>
                      </div>
                    </div>
                  </div>


                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
