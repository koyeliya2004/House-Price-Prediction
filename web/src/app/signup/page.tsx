"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function persistAuth(payload: { name: string; email?: string; provider: string }) {
  localStorage.setItem(
    "authUser",
    JSON.stringify({ ...payload, ts: Date.now() })
  );
}

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim() || "User";
    const email = (formData.get("email") as string)?.trim();
    persistAuth({ name, email, provider: "password" });
    router.push("/");
  };
  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15)_0,_transparent_45%)]" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black tracking-tighter">
            dream<span className="text-emerald-400">home</span>
          </h1>
          <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>

        <div className="mb-6 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">Create account</p>
          <h2 className="text-3xl font-black tracking-tight">Join the Boston hub</h2>
          <p className="text-white/60 text-sm">Save your Boston Housing inputs and retrieve predictions faster.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">Full name</label>
            <input
              type="text"
              placeholder="Ada Lovelace"
              name="name"
              className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-emerald-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              name="email"
              className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-emerald-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              name="password"
              className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-emerald-400 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-2">Confirm password</label>
            <input
              type="password"
              placeholder="••••••••"
              name="confirm"
              className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-emerald-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 rounded-2xl bg-emerald-400 text-black px-4 py-3 font-black text-xs uppercase tracking-widest hover:bg-emerald-300 transition-all shadow-emerald-400/30 shadow-lg active:scale-95"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account? <Link className="text-emerald-300 hover:text-emerald-200" href="/login">Login</Link>
        </p>
      </motion.div>
    </main>
  );
}
