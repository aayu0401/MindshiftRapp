import React, { useState, useEffect, createContext, useContext } from "react";

// Lightweight auth client that talks to API endpoints at VITE_API_URL
const API = (path, opts = {}) => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  return fetch(base + path, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...(opts.headers||{}) }, ...opts });
};

const AuthContext = createContext(null);
export function useAuth(){ return useContext(AuthContext); }

function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    // Try to refresh token on load
    (async ()=>{
      try{
        const r = await API('/auth/refresh', { method: 'POST' });
        if (r.ok){
          const { accessToken } = await r.json();
          // store in memory
          sessionStorage.setItem('accessToken', accessToken);
          // In a real app we'd call /me to get user data. For now mark as logged in.
          setUser({ email: 'you@domain.com' });
        }
      }catch(e){ /* ignore */ }
      setLoading(false);
    })();
  },[]);

  const signup = async (email, password) => {
    const r = await API('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (!r.ok) throw new Error(await r.text());
    const { accessToken } = await r.json();
    sessionStorage.setItem('accessToken', accessToken);
    setUser({ email });
  };

  const login = async (email, password) => {
    const r = await API('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (!r.ok) throw new Error(await r.text());
    const { accessToken } = await r.json();
    sessionStorage.setItem('accessToken', accessToken);
    setUser({ email });
  };

  const logout = async () => {
    await API('/auth/logout', { method: 'POST' });
    sessionStorage.removeItem('accessToken');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, signup, login, logout }}>{children}</AuthContext.Provider>
}

export default function MindshiftRLanding(){ 
  return (
    <AuthProvider>
      <LandingWithAuth />
    </AuthProvider>
  )
}

function LandingWithAuth(){
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gradient-to-b from-white to-gray-50">
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <div>
            <div className="font-extrabold text-lg">mindshiftR</div>
            <div className="text-xs text-gray-500 -mt-1">Tools for lasting mental change</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="hover:text-indigo-600">Features</a>
          <a href="#programs" className="hover:text-indigo-600">Programs</a>
          <a href="#testimonials" className="hover:text-indigo-600">Testimonials</a>
          <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">{user.email}</span>
              <button onClick={() => logout()} className="px-4 py-2 rounded-md border border-indigo-200 text-indigo-700 hover:bg-indigo-50">Logout</button>
            </div>
          ) : (
            <>
              <button onClick={() => setShowAuthModal(true)} className="px-4 py-2 rounded-md border border-indigo-200 text-indigo-700 hover:bg-indigo-50">Login</button>
              <a href="#signup" onClick={() => setShowAuthModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:opacity-95">Get started</a>
            </>
          )}
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-6 pt-12 pb-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Transform how you think, feel, and act — with small daily shifts.</h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl">mindshiftR blends evidence-based practices, short guided exercises, and gentle habit nudges to help you build resilience and clarity. Start with a 7‑day guided program designed for measurable progress.</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href="#signup" onClick={() => setShowAuthModal(true)} className="inline-flex items-center gap-3 bg-indigo-600 text-white px-5 py-3 rounded-lg shadow-lg font-medium">Start your free trial</a>
            <a href="#programs" className="inline-flex items-center gap-3 px-5 py-3 rounded-lg border border-gray-200 hover:bg-gray-50">Explore programs</a>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-md md:max-w-lg">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            <img alt="hero" src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcd" className="w-full h-80 object-cover" />
            <div className="p-6 bg-white">
              <h3 className="font-semibold">7-Day Clarity Starter</h3>
              <p className="text-sm text-gray-500 mt-2">Short guided sessions + daily reflection prompts.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-white rounded-2xl shadow">
            <h4 className="font-semibold text-lg">Micro-practices</h4>
            <p className="mt-3 text-sm text-gray-600">Short evidence-based exercises you can complete in under 15 minutes. Designed to be repeatable and trackable.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow">
            <h4 className="font-semibold text-lg">Personalized paths</h4>
            <p className="mt-3 text-sm text-gray-600">Programs adapt to your progress and preferences — cognitive techniques, resilience training, and mindful reflection.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow">
            <h4 className="font-semibold text-lg">Progress tracking</h4>
            <p className="mt-3 text-sm text-gray-600">Visual dashboards show streaks, mood shifts, and milestones so you can see real change.</p>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 text-sm text-gray-600">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <div className="font-bold">mindshiftR</div>
            <div className="text-xs text-gray-500 mt-1">Small daily shifts. Big impact.</div>
          </div>
        </div>
        <div className="mt-8 text-xs text-gray-400">© {new Date().getFullYear()} mindshiftR. All rights reserved.</div>
      </footer>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

function AuthModal({ open, onClose }){
  const [mode, setMode] = useState('login');
  const { signup, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{mode==='login'?'Welcome back':'Create account'}</h3>
          <button onClick={onClose} className="text-gray-400">✕</button>
        </div>
        <div className="mt-4">
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          <form onSubmit={async (e)=>{e.preventDefault(); setError(''); try{ if(mode==='login') await login(email,password); else await signup(email,password); onClose(); }catch(err){ setError(err.message || 'Error'); } }} className="space-y-3">
            <label className="block"><span className="text-sm text-gray-600">Email</span><input value={email} onChange={e=>setEmail(e.target.value)} required type="email" className="mt-1 block w-full rounded-md border px-3 py-2" /></label>
            <label className="block"><span className="text-sm text-gray-600">Password</span><input value={password} onChange={e=>setPassword(e.target.value)} required type="password" className="mt-1 block w-full rounded-md border px-3 py-2" /></label>
            <div className="flex gap-3">
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 bg-indigo-600 text-white">{mode==='login'?'Sign in':'Create account'}</button>
              <button type="button" onClick={()=>setMode(mode==='login'?'signup':'login')} className="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 border"> {mode==='login'?'Create account':'Back to login'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
