"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Home, Moon, Sun, AlertCircle, Loader } from 'lucide-react';
import { predictPrice } from '@/lib/api';

export default function BuyPage() {
  const [isDayMode, setIsDayMode] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    CRIM: "",
    ZN: "",
    INDUS: "",
    CHAS: "",
    NOX: "",
    RM: "",
    Age: "",
    DIS: "",
    RAD: "",
    TAX: "",
    PTRATIO: "",
    B: "",
    LSTAT: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Convert form data to numbers and prepare for API
      const features = {
        CRIM: parseFloat(formData.CRIM) || 0,
        ZN: parseFloat(formData.ZN) || 0,
        INDUS: parseFloat(formData.INDUS) || 0,
        CHAS: parseFloat(formData.CHAS) || 0,
        NOX: parseFloat(formData.NOX) || 0,
        RM: parseFloat(formData.RM) || 0,
        Age: parseFloat(formData.Age) || 0,
        DIS: parseFloat(formData.DIS) || 0,
        RAD: parseFloat(formData.RAD) || 0,
        TAX: parseFloat(formData.TAX) || 0,
        PTRATIO: parseFloat(formData.PTRATIO) || 0,
        B: parseFloat(formData.B) || 0,
        LSTAT: parseFloat(formData.LSTAT) || 0,
      };

      const response = await predictPrice(features);
      
      if (response.error) {
        setError(response.error);
        setPrediction(null);
      } else {
        // Convert prediction from thousands to display format
        const price = (response.prediction * 1000).toFixed(0);
        setPrediction(`$${parseInt(price).toLocaleString()}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get prediction. Make sure the backend is running at http://localhost:5000";
      setError(errorMessage);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen ${isDayMode ? "bg-slate-50 text-slate-900" : "bg-[#050505] text-white"}`}>
      {/* Header */}
      <header className={`border-b ${isDayMode ? "border-slate-200 bg-white/80" : "border-white/10 bg-black/40"} backdrop-blur-xl sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Home size={20} className="text-emerald-400 group-hover:scale-110 transition-transform" />
            <h1 className="text-2xl font-black tracking-tighter">
              dream<span className="text-emerald-400">home</span>
            </h1>
          </Link>

          <button
            onClick={() => setIsDayMode((prev) => !prev)}
            className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest border transition-all active:scale-95 flex items-center gap-2 ${isDayMode ? "bg-white text-slate-900 border-slate-200 hover:bg-slate-100" : "bg-white/10 text-white border-white/10 hover:bg-white/20"}`}
          >
            {isDayMode ? <Sun size={16} /> : <Moon size={16} />}
            {isDayMode ? "Day" : "Night"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <div className="text-center mb-12">
            <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-3 ${isDayMode ? "text-emerald-700" : "text-emerald-300"}`}>
              Price Prediction
            </p>
            <h1 className={`text-4xl md:text-5xl font-black tracking-tighter mb-4 ${isDayMode ? "text-slate-900" : "text-white"}`}>
              Boston House Price Prediction
            </h1>
            <p className={`${isDayMode ? "text-slate-700" : "text-white/60"} max-w-2xl mx-auto text-lg`}>
              Enter all 13 features from the Boston Housing dataset to get an estimated median home value.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handlePredict} className={`rounded-3xl border p-8 md:p-12 ${isDayMode ? "bg-white border-slate-200 shadow-lg" : "bg-white/5 border-white/10 backdrop-blur-xl"}`}>
            <div className="space-y-6">
              {/* CRIM */}
              <FeatureInput
                name="CRIM"
                label="CRIM"
                description="Per capita crime rate by town"
                value={formData.CRIM}
                onChange={handleChange}
                placeholder="e.g., 0.00632"
                isDayMode={isDayMode}
              />

              {/* ZN */}
              <FeatureInput
                name="ZN"
                label="ZN"
                description="Proportion of residential land zoned for lots over 25,000 sq. ft."
                value={formData.ZN}
                onChange={handleChange}
                placeholder="e.g., 18.0"
                isDayMode={isDayMode}
              />

              {/* INDUS */}
              <FeatureInput
                name="INDUS"
                label="INDUS"
                description="Proportion of non-retail business acres per town"
                value={formData.INDUS}
                onChange={handleChange}
                placeholder="e.g., 2.31"
                isDayMode={isDayMode}
              />

              {/* CHAS */}
              <FeatureInput
                name="CHAS"
                label="CHAS"
                description="Charles River dummy variable (1 if tract bounds river; 0 otherwise)"
                value={formData.CHAS}
                onChange={handleChange}
                placeholder="0 or 1"
                isDayMode={isDayMode}
              />

              {/* NOX */}
              <FeatureInput
                name="NOX"
                label="NOX"
                description="Nitric oxide concentration (parts per 10 million)"
                value={formData.NOX}
                onChange={handleChange}
                placeholder="e.g., 0.538"
                isDayMode={isDayMode}
              />

              {/* RM */}
              <FeatureInput
                name="RM"
                label="RM"
                description="Average number of rooms per dwelling"
                value={formData.RM}
                onChange={handleChange}
                placeholder="e.g., 6.575"
                isDayMode={isDayMode}
              />

              {/* AGE */}
              <FeatureInput
                name="Age"
                label="Age"
                description="Proportion of owner-occupied units built prior to 1940"
                value={formData.Age}
                onChange={handleChange}
                placeholder="e.g., 65.2"
                isDayMode={isDayMode}
              />

              {/* DIS */}
              <FeatureInput
                name="DIS"
                label="DIS"
                description="Weighted distances to five Boston employment centers"
                value={formData.DIS}
                onChange={handleChange}
                placeholder="e.g., 4.09"
                isDayMode={isDayMode}
              />

              {/* RAD */}
              <FeatureInput
                name="RAD"
                label="RAD"
                description="Index of accessibility to radial highways"
                value={formData.RAD}
                onChange={handleChange}
                placeholder="e.g., 1"
                isDayMode={isDayMode}
              />

              {/* TAX */}
              <FeatureInput
                name="TAX"
                label="TAX"
                description="Full-value property tax rate per $10,000"
                value={formData.TAX}
                onChange={handleChange}
                placeholder="e.g., 296"
                isDayMode={isDayMode}
              />

              {/* PTRATIO */}
              <FeatureInput
                name="PTRATIO"
                label="PTRATIO"
                description="Pupil-teacher ratio by town"
                value={formData.PTRATIO}
                onChange={handleChange}
                placeholder="e.g., 15.3"
                isDayMode={isDayMode}
              />

              {/* B */}
              <FeatureInput
                name="B"
                label="B"
                description="1000(Bk - 0.63)^2 where Bk is the proportion of blacks by town"
                value={formData.B}
                onChange={handleChange}
                placeholder="e.g., 396.9"
                isDayMode={isDayMode}
              />

              {/* LSTAT */}
              <FeatureInput
                name="LSTAT"
                label="LSTAT"
                description="Percentage of lower status of the population"
                value={formData.LSTAT}
                onChange={handleChange}
                placeholder="e.g., 4.98"
                isDayMode={isDayMode}
              />
            </div>

            {/* Predict Button */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-10 w-full group flex items-center justify-center gap-3 rounded-2xl text-black px-12 py-5 font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-400/20 active:scale-95 transition-all ${
                loading 
                  ? "bg-emerald-500/50 cursor-not-allowed" 
                  : "bg-emerald-400 hover:bg-emerald-300"
              }`}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  Predict Price
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 rounded-3xl border p-6 flex items-start gap-4 ${isDayMode ? "bg-red-50 border-red-200" : "bg-red-500/10 border-red-500/20"}`}
            >
              <AlertCircle className={`flex-shrink-0 mt-1 ${isDayMode ? "text-red-600" : "text-red-400"}`} size={24} />
              <div>
                <h3 className={`font-bold mb-1 ${isDayMode ? "text-red-900" : "text-red-300"}`}>Prediction Error</h3>
                <p className={`text-sm ${isDayMode ? "text-red-700" : "text-red-400"}`}>{error}</p>
              </div>
            </motion.div>
          )}

          {/* Prediction Result */}
          {prediction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-8 rounded-3xl border p-8 text-center ${isDayMode ? "bg-emerald-50 border-emerald-200" : "bg-emerald-500/10 border-emerald-500/20"}`}
            >
              <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-2 ${isDayMode ? "text-emerald-700" : "text-emerald-300"}`}>
                Target Variable
              </p>
              <h3 className={`text-xl font-black mb-2 ${isDayMode ? "text-slate-900" : "text-white"}`}>
                MEDV: Median value of owner-occupied homes
              </h3>
              <div className="text-5xl font-black text-emerald-400 tracking-tighter">
                {prediction}
              </div>
            </motion.div>
          )}

          {/* Info Card */}
          <div className={`mt-8 rounded-2xl border p-6 ${isDayMode ? "bg-slate-100 border-slate-200" : "bg-white/5 border-white/10"}`}>
            <h4 className={`text-sm font-black uppercase tracking-widest mb-3 ${isDayMode ? "text-slate-700" : "text-white/70"}`}>
              About the Dataset
            </h4>
            <p className={`text-sm leading-relaxed ${isDayMode ? "text-slate-700" : "text-white/60"}`}>
              This model uses the classic Boston Housing dataset with 13 features to predict the median value of owner-occupied homes in $1000s. 
              The prediction is powered by a CatBoostRegressor trained on 506 instances with features normalized using StandardScaler.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

/* Helper Component */
function FeatureInput({
  name,
  label,
  description,
  value,
  onChange,
  placeholder,
  isDayMode,
}: {
  name: string;
  label: string;
  description: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  isDayMode: boolean;
}) {
  return (
    <div>
      <label className="block mb-2">
        <span className={`text-sm font-black uppercase tracking-widest ${isDayMode ? "text-slate-900" : "text-white"}`}>
          {label}
        </span>
        <span className={`block text-xs mt-1 ${isDayMode ? "text-slate-600" : "text-white/50"}`}>
          {description}
        </span>
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-400 transition-all ${
          isDayMode
            ? "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400"
            : "bg-black/40 border border-white/10 text-white placeholder-white/30"
        }`}
      />
    </div>
  );
}
