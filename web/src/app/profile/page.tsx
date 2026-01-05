"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Camera } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email?: string; avatar?: string; provider: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({ 
          name: parsed.name || "User", 
          email: parsed.email || "",
          avatar: parsed.avatar || "",
          provider: parsed.provider || "password" 
        });
      } catch (_e) {
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("authUser");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#0a0f1a] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors mb-8">
          ← Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-black tracking-tight mb-8 text-emerald-400">User Profile</h1>

          {user ? (
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="avatar" 
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500/30"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-3xl font-black border-2 border-emerald-500/30">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors flex items-center gap-2">
                  <Camera size={18} />
                  Change Avatar
                </button>
              </div>

              {/* User Info */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40 font-black mb-2">Full Name</p>
                  <p className="text-xl font-bold">{user.name}</p>
                </div>
                {user.email && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/40 font-black mb-2">Email Address</p>
                    <p className="text-lg font-semibold text-white/80">{user.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40 font-black mb-2">Account Type</p>
                  <p className="text-lg font-semibold capitalize text-white/80">{user.provider}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Link
                  href="/settings"
                  className="flex-1 px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors text-center"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>

              {/* Additional Info */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-white/40 mb-4">Quick Stats</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-black text-emerald-400">0</p>
                    <p className="text-xs text-white/50 mt-1">Predictions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-emerald-400">0</p>
                    <p className="text-xs text-white/50 mt-1">Saved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-emerald-400">New</p>
                    <p className="text-xs text-white/50 mt-1">Member</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
              <p className="text-white/60 mb-6">You are not signed in.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 text-white px-8 py-3 font-bold text-sm hover:bg-emerald-600 transition-all shadow-emerald-500/30 shadow-lg"
              >
                Go to Login
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
