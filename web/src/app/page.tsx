"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Search, 
  Home, 
  MapPin, 
  IndianRupee, 
  Bed, 
  Bath, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  ArrowRight, 
  Menu, 
  X,
  Sun,
  Moon 
} from 'lucide-react';

/**
 * DREAMHOME - AI POWERED REAL ESTATE
 * Fixed with "use client" directive for Next.js compatibility
 */

type StoredUser = {
  name: string;
  email?: string;
  avatar?: string;
  provider?: string;
};

const HomePage = () => {
  const [prediction, setPrediction] = useState("₹ 72,50,000");
  const [showFeatures, setShowFeatures] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftAvatar, setDraftAvatar] = useState("");
  const [isDayMode, setIsDayMode] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.name) {
          setUser(parsed);
          setDraftName(parsed.name || "");
          setDraftEmail(parsed.email || "");
          setDraftAvatar(parsed.avatar || "");
        }
      } catch (_e) {
        setUser(null);
      }
    }
  }, []);

  const saveProfile = () => {
    const nextUser: StoredUser = {
      name: draftName || "User",
      email: draftEmail || undefined,
      avatar: draftAvatar || undefined,
      provider: user?.provider || "password",
    };
    localStorage.setItem("authUser", JSON.stringify(nextUser));
    setUser(nextUser);
    setShowProfileEditor(false);
  };

  const displayName = user?.name?.includes("@") ? user.name.split("@")[0] : user?.name;

  return (
    <div className={`min-h-screen ${isDayMode ? "bg-slate-50 text-slate-900" : "bg-[#050505] text-white"} selection:bg-emerald-500/30`}>
      
      {/* ================= NAVBAR ================= */}
      <header className="absolute top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tighter">
            dream<span className="text-emerald-400">home</span>
          </h1>

          <nav className={`hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest ${isDayMode ? "text-slate-700" : "text-white/70"}`}>
            <Link href="/buy" className="hover:text-emerald-500 transition-colors">Buy</Link>
            <a href="#ai-predictor" className="hover:text-emerald-500 transition-colors">AI Predictor</a>
            <a href="#details" className="hover:text-emerald-500 transition-colors">Details</a>
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/settings" className="hover:text-emerald-500 transition-colors">Settings</Link>
                <button
                  onClick={() => setShowProfileEditor(true)}
                  className="flex items-center gap-2 hover:text-emerald-500 transition-colors"
                >
                  {user.avatar ? (
                    <span
                      className="w-8 h-8 rounded-full bg-white/10 border border-white/10 overflow-hidden"
                      style={{ display: "inline-flex" }}
                    >
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    </span>
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-white/10 border border-white/10 inline-flex items-center justify-center text-xs font-black uppercase">
                      {user.name?.slice(0, 2) || "U"}
                    </span>
                  )}
                  <span>{displayName || "Profile"}</span>
                </button>
              </div>
            ) : (
              <Link href="/login" className="hover:text-emerald-500 transition-colors">Login</Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDayMode((prev) => !prev)}
              className={`rounded-full px-4 py-3 text-xs font-black uppercase tracking-widest border transition-all active:scale-95 flex items-center gap-2 ${isDayMode ? "bg-white text-slate-900 border-slate-200 hover:bg-slate-100" : "bg-white/10 text-white border-white/10 hover:bg-white/20"}`}
            >
              {isDayMode ? <Sun size={16} /> : <Moon size={16} />}
              {isDayMode ? "Day" : "Night"}
            </button>
            <button className={`rounded-full px-6 py-3 text-xs font-black uppercase tracking-widest transition-all active:scale-95 border ${isDayMode ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-400" : "bg-white/10 text-white backdrop-blur-md border-white/10 hover:bg-white/20"}`}>
              Contact Us
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000')",
            filter: isDayMode ? "brightness(1)" : "brightness(0.8)",
          }}
        />

        {/* Cinematic dark overlay */}
        <div className={`absolute inset-0 ${isDayMode ? "bg-gradient-to-b from-white/40 via-white/10 to-slate-100" : "bg-gradient-to-b from-black/70 via-black/40 to-[#050505]"}`} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <h2 className="text-6xl md:text-8xl font-black leading-[0.9] max-w-4xl tracking-tighter mb-8">
              Modeling the Boston <br />
              <span className="text-emerald-400">housing market.</span>
            </h2>

            <p className={`max-w-xl text-lg md:text-xl font-medium leading-relaxed mb-12 ${isDayMode ? "text-slate-700" : "text-white/60"}`}>
              Built on the classic Boston Housing dataset with 13 features, this UI keeps you focused on the model—not global listings.
            </p>

            {/* Search Bar */}
            <div className={`flex flex-wrap items-center gap-6 rounded-[2rem] p-4 lg:p-6 max-w-5xl backdrop-blur-3xl shadow-2xl ${isDayMode ? "bg-white/80 border border-slate-200 text-slate-900" : "bg-black/40 border border-white/10"}`}>
              <SearchField placeholder="Per-capita crime (CRIM)" isDayMode={isDayMode} />
              <Divider isDayMode={isDayMode} />
              <SearchField placeholder="Avg rooms (RM)" isDayMode={isDayMode} />
              <Divider isDayMode={isDayMode} />
              <SearchField placeholder="Tax rate (TAX)" isDayMode={isDayMode} />
              <Divider isDayMode={isDayMode} />
              <SearchField placeholder="Pupil-teacher ratio (PTRATIO)" isDayMode={isDayMode} />

              <button className="ml-auto w-full md:w-auto rounded-2xl bg-emerald-400 text-black px-10 py-4 font-black text-xs uppercase tracking-widest hover:bg-emerald-300 transition-all shadow-xl shadow-emerald-400/20 active:scale-95">
                Search now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURE DRAWER ================= */}
      <AnimatePresence>
        {showFeatures && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFeatures(false)}
          >
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-[#0b0f14] rounded-t-3xl border-t border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDayMode ? "text-emerald-700" : "text-white/40"}`}>Boston housing</p>
                  <h4 className="text-xl font-black text-white">All 13 features</h4>
                </div>
                <button
                  onClick={() => setShowFeatures(false)}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/15 active:scale-95 transition"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-4">
                {bostonFeatures.map((f) => (
                  <div key={f.key} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300 mb-2">{f.key}</p>
                    <p className="text-white font-semibold mb-1">{f.label}</p>
                    <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= PROFILE EDITOR ================= */}
      <AnimatePresence>
        {showProfileEditor && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfileEditor(false)}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xl rounded-3xl bg-[#0b0f14] border border-white/10 p-6 shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDayMode ? "text-emerald-700" : "text-white/40"}`}>Profile</p>
                  <h4 className="text-xl font-black text-white">{user ? "Edit your info" : "Create account"}</h4>
                </div>
                <button
                  onClick={() => setShowProfileEditor(false)}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/15 active:scale-95 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {user ? (
              <div className="space-y-4">
                <label className="block">
                  <span className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDayMode ? "text-slate-600" : "text-white/40"}`}>Name</span>
                  <input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-emerald-400 transition"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDayMode ? "text-slate-600" : "text-white/40"}`}>Email</span>
                  <input
                    value={draftEmail}
                    onChange={(e) => setDraftEmail(e.target.value)}
                    className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-emerald-400 transition"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="block">
                  <span className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isDayMode ? "text-slate-600" : "text-white/40"}`}>Avatar URL</span>
                  <input
                    value={draftAvatar}
                    onChange={(e) => setDraftAvatar(e.target.value)}
                    className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-emerald-400 transition"
                    placeholder="https://..."
                  />
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={saveProfile}
                    className="rounded-2xl bg-emerald-400 text-black px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-emerald-300 transition-all shadow-emerald-400/30 shadow-lg active:scale-95"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowProfileEditor(false)}
                    className="rounded-2xl bg-white/10 text-white px-6 py-3 font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/15 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("authUser");
                      setUser(null);
                      setShowProfileEditor(false);
                      window.location.reload();
                    }}
                    className="rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
              ) : (
              <div className="space-y-4">
                <p className="text-white/60 text-sm mb-4">You are not signed in. Sign in or create an account to start making predictions.</p>
                <Link
                  href="/login"
                  className="w-full block rounded-2xl bg-emerald-400 text-black px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-emerald-300 transition-all shadow-emerald-400/30 shadow-lg text-center active:scale-95"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="w-full block rounded-2xl bg-white/10 border border-white/10 text-white px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-white/15 transition-all text-center"
                >
                  Sign Up
                </Link>
                <button
                  onClick={() => setShowProfileEditor(false)}
                  className="w-full rounded-2xl bg-white/5 text-white px-6 py-3 font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= FEATURES ================= */}
      <section className={`${isDayMode ? "bg-white" : "bg-[#0b0f14]"} py-32 border-y ${isDayMode ? "border-slate-200" : "border-white/5"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-black tracking-tighter mb-4">Boston Housing, modeled right</h3>
            <p className={`${isDayMode ? "text-slate-600" : "text-white/40"} font-medium`}>Purpose-built for the 13-feature Boston dataset—nothing more, nothing less.</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Feature
              icon={<Zap className="text-emerald-400" size={24} />}
              title="Model-ready inputs"
              desc="Keep CRIM, RM, TAX, PTRATIO, and other features clean and normalized before prediction."
              isDayMode={isDayMode}
            />
            <Feature
              icon={<ShieldCheck className="text-emerald-400" size={24} />}
              title="Explainable metrics"
              desc="Track key drivers like LSTAT and RM with transparent feature ordering and scaling."
              isDayMode={isDayMode}
            />
            <Feature
              icon={<Cpu className="text-emerald-400" size={24} />}
              title="CatBoost accuracy"
              desc="Optimized CatBoostRegressor with StandardScaler to mirror the backend setup."
              isDayMode={isDayMode}
            />
          </div>
        </div>
      </section>

      {/* ================= MODEL DETAILS ================= */}
      <section id="details" className={`py-32 ${isDayMode ? "bg-slate-100" : "bg-[#0e141b]"}`}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDayMode ? "text-emerald-700" : "text-emerald-300"}`}>Model details</p>
            <h3 className="text-4xl font-black leading-[1.1] tracking-tighter">What powers these predictions</h3>
            <p className={`${isDayMode ? "text-slate-700" : "text-white/60"} text-lg leading-relaxed`}>
              We train on the classic Boston Housing dataset (506 rows, 13 numerical features) using StandardScaler + CatBoostRegressor. Hyperparameters come from a RandomizedSearchCV sweep, and we target MEDV to estimate median home value.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <DetailCard
              title="Dataset & Features"
              body="506 records from sklearn's Boston Housing dataset with 13 numeric inputs (CRIM, RM, TAX, PTRATIO, LSTAT, and more)."
              isDayMode={isDayMode}
            />
            <DetailCard
              title="Preprocessing"
              body="StandardScaler normalizes every feature before training and inference to keep CatBoost gradients stable."
              isDayMode={isDayMode}
            />
            <DetailCard
              title="Model training"
              body="CatBoostRegressor tuned via RandomizedSearchCV and 5-fold CV; evaluated on an 80/20 split with R² around 0.88."
              isDayMode={isDayMode}
            />
            <DetailCard
              title="Serving"
              body="Flask API loads the trained model (housepred.pkl) and scaler for /predict_api; served via gunicorn or container."
              isDayMode={isDayMode}
            />
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section id="ai-predictor" className={`${isDayMode ? "bg-white text-slate-900" : "bg-[#0e141b] text-white"} py-32 relative overflow-hidden`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-3 ${isDayMode ? "text-emerald-700" : "text-emerald-300"}`}>
              Why Choose Us
            </p>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Advanced ML Features
            </h3>
            <p className={`${isDayMode ? "text-slate-700" : "text-white/60"} max-w-2xl mx-auto text-lg`}>
              Industry-leading machine learning tools for accurate Boston housing price predictions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AdvancedFeature
              icon={<Cpu className="text-emerald-400" size={28} />}
              title="CatBoost Algorithm"
              description="State-of-the-art gradient boosting with categorical feature support and superior accuracy on tabular data."
              isDayMode={isDayMode}
            />
            <AdvancedFeature
              icon={<Zap className="text-emerald-400" size={28} />}
              title="Real-time Predictions"
              description="Lightning-fast inference with optimized model serving through Flask API and production-ready gunicorn deployment."
              isDayMode={isDayMode}
            />
            <AdvancedFeature
              icon={<ShieldCheck className="text-emerald-400" size={28} />}
              title="Standardized Scaling"
              description="Robust StandardScaler preprocessing ensures consistent feature normalization across training and inference."
              isDayMode={isDayMode}
            />
            <AdvancedFeature
              icon={<ArrowRight className="text-emerald-400" size={28} />}
              title="13-Feature Analysis"
              description="Comprehensive evaluation using all Boston Housing features: CRIM, ZN, INDUS, CHAS, NOX, RM, AGE, DIS, RAD, TAX, PTRATIO, B, LSTAT."
              isDayMode={isDayMode}
            />
            <AdvancedFeature
              icon={<Home className="text-emerald-400" size={28} />}
              title="High Accuracy"
              description="Achieve ~0.88 R² score on test data through hyperparameter tuning with RandomizedSearchCV and 5-fold cross-validation."
              isDayMode={isDayMode}
            />
            <AdvancedFeature
              icon={<Search className="text-emerald-400" size={28} />}
              title="Explainable Results"
              description="Transparent feature importance tracking with clear insights into key drivers like LSTAT and RM affecting predictions."
              isDayMode={isDayMode}
            />
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/buy"
              className="inline-flex items-center gap-3 rounded-2xl bg-emerald-400 text-black px-12 py-5 font-black text-xs uppercase tracking-widest hover:bg-emerald-300 transition-all shadow-2xl shadow-emerald-400/20 active:scale-95"
            >
              Try Price Prediction
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-gradient-to-r from-emerald-400 to-teal-400 p-12 lg:p-24 text-black text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h3 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
              Ready to run a<br /> Boston prediction?
            </h3>
            <p className="max-w-xl mx-auto mb-10 font-bold text-black/70">
              Use the CatBoost + StandardScaler setup to estimate home values with the 13 Boston Housing features.
            </p>
            <button className="rounded-2xl bg-black text-white px-12 py-5 font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-2xl active:scale-95">
              Run a prediction
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className={`${isDayMode ? "bg-slate-900" : "bg-black"} py-20 border-t ${isDayMode ? "border-slate-800" : "border-white/5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <h1 className="text-2xl font-black tracking-tighter mb-8">
            dream<span className="text-emerald-400">home</span>
          </h1>
          <div className={`flex gap-8 mb-12 font-bold text-xs uppercase tracking-widest ${isDayMode ? "text-slate-400" : "text-white/40"}`}>
            <a href="#" className={`${isDayMode ? "hover:text-slate-700" : "hover:text-white"}`}>Privacy</a>
            <a href="#" className={`${isDayMode ? "hover:text-slate-700" : "hover:text-white"}`}>Terms</a>
            <a href="#" className={`${isDayMode ? "hover:text-slate-700" : "hover:text-white"}`}>Support</a>
          </div>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} DREAMHOME AI TECHNOLOGIES. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

/* ================= HELPER COMPONENTS ================= */

function SearchField({ placeholder, isDayMode }: { placeholder: string; isDayMode: boolean }) {
  return (
    <div className="flex-1 min-w-[150px]">
      <input
        type="text"
        placeholder={placeholder}
        className={`bg-transparent outline-none font-bold w-full text-sm lg:text-base ${isDayMode ? "text-slate-900 placeholder-slate-400" : "text-white placeholder-white/30"}`}
      />
    </div>
  );
}

function Divider({ isDayMode }: { isDayMode: boolean }) {
  return <div className={`hidden lg:block h-6 w-px mx-2 ${isDayMode ? "bg-slate-300" : "bg-white/10"}`} />;
}

function Feature({ icon, title, desc, isDayMode }: { icon: React.ReactNode; title: string; desc: string; isDayMode: boolean }) {
  return (
    <div className={`group rounded-[2rem] p-10 backdrop-blur-xl transition-all duration-500 ${isDayMode ? "bg-white border border-slate-200 hover:border-emerald-200 hover:shadow-lg" : "bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/20"}`}>
      <div className={`mb-6 p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform ${isDayMode ? "bg-emerald-50" : "bg-white/5"}`}>
        {icon}
      </div>
      <h4 className={`text-xl font-black tracking-tight mb-4 ${isDayMode ? "text-slate-900" : "text-white"}`}>{title}</h4>
      <p className={`${isDayMode ? "text-slate-700" : "text-white/40"} font-medium leading-relaxed`}>{desc}</p>
    </div>
  );
}

function DetailCard({ title, body, isDayMode }: { title: string; body: string; isDayMode: boolean }) {
  return (
    <div className={`rounded-2xl p-5 border ${isDayMode ? "bg-white border-slate-200 text-slate-900" : "bg-white/5 border-white/10 text-white"}`}>
      <h5 className="text-lg font-black mb-2 tracking-tight">{title}</h5>
      <p className={`${isDayMode ? "text-slate-700" : "text-white/60"} text-sm leading-relaxed`}>{body}</p>
    </div>
  );
}

function AdvancedFeature({ icon, title, description, isDayMode }: { icon: React.ReactNode; title: string; description: string; isDayMode: boolean }) {
  return (
    <div className={`group rounded-2xl p-8 border transition-all duration-300 ${isDayMode ? "bg-slate-50 border-slate-200 hover:border-emerald-300 hover:shadow-lg" : "bg-white/5 border-white/10 hover:border-emerald-500/30 hover:bg-white/10"}`}>
      <div className={`mb-5 p-3 rounded-xl w-fit transition-transform group-hover:scale-110 ${isDayMode ? "bg-emerald-50" : "bg-white/5"}`}>
        {icon}
      </div>
      <h4 className={`text-lg font-black mb-3 tracking-tight ${isDayMode ? "text-slate-900" : "text-white"}`}>{title}</h4>
      <p className={`text-sm leading-relaxed ${isDayMode ? "text-slate-700" : "text-white/60"}`}>{description}</p>
    </div>
  );
}

function InputDark({ label, placeholder, isDayMode }: { label: string; placeholder: string; isDayMode: boolean }) {
  return (
    <div className="w-full">
      <label className={`block mb-2 text-[10px] font-black uppercase tracking-widest ${isDayMode ? "text-slate-500" : "text-white/30"}`}>{label}</label>
      <input
        placeholder={placeholder}
        className={`w-full rounded-2xl px-6 py-4 font-medium outline-none focus:border-emerald-500/50 transition-all ${isDayMode ? "bg-white border border-slate-200 text-slate-900 placeholder-slate-400" : "bg-black/40 border border-white/5 text-white placeholder-white/20"}`}
      />
    </div>
  );
}

function Stat({ label, value, isDayMode }: { label: string; value: string; isDayMode: boolean }) {
  return (
    <div className={`rounded-2xl p-5 border text-center ${isDayMode ? "bg-white border-slate-200" : "bg-white/5 border-white/5"}`}>
      <div className={`font-black text-lg tracking-tighter ${isDayMode ? "text-slate-900" : "text-white"}`}>{value}</div>
      <div className={`text-[9px] font-black uppercase mt-1 tracking-widest ${isDayMode ? "text-slate-500" : "text-white/30"}`}>{label}</div>
    </div>
  );
}

const bostonFeatures = [
  { key: "CRIM", label: "Per capita crime rate", desc: "Crime rate per town." },
  { key: "ZN", label: "Large lot zoning", desc: "Residential land zoned for lots over 25,000 sq. ft." },
  { key: "INDUS", label: "Non-retail acres", desc: "Proportion of non-retail business acres per town." },
  { key: "CHAS", label: "Charles River", desc: "1 if tract bounds the river, otherwise 0." },
  { key: "NOX", label: "Nitric oxides", desc: "NOX concentration (parts per 10 million)." },
  { key: "RM", label: "Avg rooms", desc: "Average number of rooms per dwelling." },
  { key: "AGE", label: "Pre-1940 share", desc: "Proportion of owner-occupied units built before 1940." },
  { key: "DIS", label: "Distance to jobs", desc: "Weighted distances to five Boston employment centers." },
  { key: "RAD", label: "Highway access", desc: "Accessibility index to radial highways." },
  { key: "TAX", label: "Tax rate", desc: "Property tax rate per $10,000." },
  { key: "PTRATIO", label: "Pupil-teacher", desc: "Pupil-teacher ratio by town." },
  { key: "B", label: "Demographic index", desc: "1000(Bk - 0.63)^2 where Bk is the proportion of Black residents." },
  { key: "LSTAT", label: "Lower status %", desc: "Percentage of lower status population." },
];

export default HomePage;