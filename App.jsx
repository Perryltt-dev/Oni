import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Zap, Leaf, Navigation, ArrowRight, Clock, CheckCircle2, Sparkles, Loader2, Github } from 'lucide-react';

// --- Utility Component for Scroll Animations ---
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Main Application ---
export default function App() {
  const [craving, setCraving] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const scrollToLocations = () => {
    document.getElementById('locations').scrollIntoView({ behavior: 'smooth' });
  };

  const getRecommendation = async () => {
    if (!craving.trim()) return;
    setIsGenerating(true);
    setRecommendation(null);
    
    const apiKey = ""; // API key is provided by the execution environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const systemPrompt = `You are the AI Flavor Matchmaker for Oni, a fast-casual onigiri vending startup. 
    The user will describe their craving, current mood, or activity. 
    Recommend the perfect onigiri. Choose from our standard menu (Spicy Tuna Mayo, Classic Salmon, Teriyaki Chicken, Plum & Kelp) OR invent a plausible, delicious "secret menu" Japanese onigiri that perfectly fits their need. 
    Return ONLY valid JSON. Keep descriptions punchy, energetic, and short (max 2 sentences).`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: craving }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                badge: { type: "STRING", description: "Short 1-2 word tag like 'Protein Packed' or 'Secret Menu'" },
                color: { type: "STRING", description: "Tailwind color classes e.g. 'bg-orange-100 text-orange-800' or 'bg-indigo-100 text-indigo-800'" },
                description: { type: "STRING", description: "Punchy explanation of why it fits" },
                matchScore: { type: "STRING", description: "Percentage string e.g. '98%'" }
              }
            }
          }
        })
      });

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        setRecommendation(JSON.parse(text));
      }
    } catch (error) {
      console.error("Error generating recommendation:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter text-slate-900">
            ONI<span className="text-red-600">.</span>
          </div>
          <button 
            onClick={scrollToLocations}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-colors duration-200 active:scale-95"
          >
            Find a Machine
          </button>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <header className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 w-full text-center md:text-left z-10">
          <FadeIn>
            <p className="text-red-600 font-semibold tracking-wide uppercase text-sm mb-3 flex items-center justify-center md:justify-start gap-2">
              <Clock size={16} /> Running late?
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              Real Meals. <br className="hidden md:block" />
              <span className="text-slate-400">No Waiting.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Fresh onigiri, ready in seconds — wherever you are. Skip the line, not the nutrition.
            </p>
            <button 
              onClick={scrollToLocations}
              className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 shadow-[0_8px_30px_rgb(220,38,38,0.3)] hover:shadow-[0_8px_30px_rgb(220,38,38,0.5)] active:scale-95 flex items-center justify-center gap-2 mx-auto md:mx-0"
            >
              Find a Machine <ArrowRight size={20} />
            </button>
          </FadeIn>
        </div>
        <div className="flex-1 w-full relative">
          <FadeIn delay={200}>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] md:aspect-square bg-slate-200 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1512413914421-eb33d2650849?auto=format&fit=crop&q=80&w=1000" 
                alt="Commuter quickly grabbing a meal" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div className="absolute bottom-6 -left-6 md:-left-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="bg-green-100 text-green-600 p-2 rounded-full">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Stock Status</p>
                <p className="text-sm font-bold text-slate-900">Freshly Restocked</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </header>

      {/* 2. Problem Section */}
      <section className="bg-slate-900 text-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-12">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-400">You’re in a rush.</h2>
          </FadeIn>
          <FadeIn delay={200}>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-300">You don’t have time to wait.</h2>
          </FadeIn>
          <FadeIn delay={400}>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-500">And your only options are fast food… or nothing.</h2>
          </FadeIn>
          <FadeIn delay={600}>
            <h2 className="text-4xl md:text-6xl font-black text-red-500 mt-8 pt-8 border-t border-slate-800">
              Oni changes that.
            </h2>
          </FadeIn>
        </div>
      </section>

      {/* 3. Solution Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center md:text-left transition-transform hover:-translate-y-1">
              <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center text-red-600 mb-6 mx-auto md:mx-0">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant</h3>
              <p className="text-slate-600">Ready in under a minute. Tap, grab, and you're back on your way.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center md:text-left transition-transform hover:-translate-y-1">
              <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center text-green-600 mb-6 mx-auto md:mx-0">
                <Leaf size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Real Food</h3>
              <p className="text-slate-600">Fresh, filling, and balanced. Made with premium rice and authentic fillings.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center md:text-left transition-transform hover:-translate-y-1">
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto md:mx-0">
                <Navigation size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Made for Movement</h3>
              <p className="text-slate-600">Perfectly portable. Clean packaging designed to be eaten anywhere, anytime.</p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 4. Product Section */}
      <section className="py-24 px-6 bg-slate-100">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">Fresh daily. Built to go.</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Individually packaged for maximum freshness and portability. No mess, no fuss.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Spicy Tuna Mayo", color: "bg-orange-100 text-orange-800" },
              { name: "Classic Salmon", color: "bg-rose-100 text-rose-800" },
              { name: "Teriyaki Chicken", color: "bg-amber-100 text-amber-800" },
              { name: "Plum & Kelp", color: "bg-purple-100 text-purple-800", badge: "Vegan" }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-white rounded-2xl p-4 md:p-6 text-center shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                  <div className="aspect-square bg-slate-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[40%] shadow-inner border border-slate-200 relative transform transition-transform group-hover:scale-105">
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-8 bg-slate-800 rounded-t-sm"></div>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{item.name}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.color}`}>
                    {item.badge || "Popular"}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* AI Matchmaker Section */}
          <FadeIn delay={200} className="mt-16 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
                <Sparkles size={24} />
              </div>
              <h3 className="text-2xl font-bold">Not sure what you want?</h3>
            </div>
            <p className="text-slate-600 mb-6">Tell us what you're doing or craving, and our AI will find your perfect match.</p>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={craving}
                onChange={(e) => setCraving(e.target.value)}
                placeholder="e.g. Need high protein post-workout..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => e.key === 'Enter' && getRecommendation()}
              />
              <button
                onClick={getRecommendation}
                disabled={isGenerating || !craving.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 min-w-[150px]"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={20} /> : "Match Me ✨"}
              </button>
            </div>

            {recommendation && (
              <div className="mt-6 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{recommendation.name}</h4>
                    <span className={`inline-block mt-2 text-xs font-bold px-2 py-1 rounded-md ${recommendation.color}`}>
                      {recommendation.badge}
                    </span>
                  </div>
                  <div className="bg-white px-3 py-1 rounded-full shadow-sm text-sm font-bold text-indigo-600 border border-indigo-100">
                    {recommendation.matchScore} Match
                  </div>
                </div>
                <p className="text-slate-700 font-medium">{recommendation.description}</p>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-black mb-16">Three steps. Zero waiting.</h2>
        </FadeIn>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative">
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-slate-200 -z-10"></div>
          {[
            { step: "1", title: "Find", desc: "Locate a machine near you." },
            { step: "2", title: "Tap", desc: "Select and pay contactlessly." },
            { step: "3", title: "Go", desc: "Grab your meal and keep moving." }
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 150} className="flex-1 w-full bg-white md:bg-transparent p-6 rounded-2xl md:p-0">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-xl border-4 border-white">
                {item.step}
              </div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 6. Location Section */}
      <section id="locations" className="py-24 px-6 bg-slate-900 text-white scroll-mt-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 w-full text-center md:text-left">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-black mb-6">On your route.</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto md:mx-0">
                We place our machines exactly where you need them: transit hubs, university campuses, and office building lobbies.
              </p>
              <button className="w-full md:w-auto bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-full font-bold text-lg transition-colors duration-200 active:scale-95 flex items-center justify-center gap-2 mx-auto md:mx-0">
                <MapPin size={20} /> Use Current Location
              </button>
            </FadeIn>
          </div>
          
          <div className="flex-1 w-full">
            <FadeIn delay={200}>
              <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-700">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Machines near you
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Central Station", loc: "Platform 4", dist: "0.1 mi" },
                    { name: "University Library", loc: "Ground Floor Lobby", dist: "0.4 mi" },
                    { name: "Metro Center", loc: "North Exit", dist: "0.8 mi" }
                  ].map((loc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-2xl hover:bg-slate-700 transition-colors cursor-pointer">
                      <div>
                        <h4 className="font-bold">{loc.name}</h4>
                        <p className="text-sm text-slate-400">{loc.loc}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-red-400">{loc.dist}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 7. Social Proof */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { quote: "Finally something better than chips or candy. Perfect for my morning commute.", author: "Sarah T.", role: "Commuter" },
                { quote: "I literally grab one between classes. It takes 10 seconds and keeps me full.", author: "James L.", role: "Student" },
                { quote: "A lifesaver on days when I don't have time for a real lunch break.", author: "Elena M.", role: "Nurse" }
              ].map((testimonial, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {[...Array(5)].map((_, j) => <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
                  </div>
                  <p className="text-slate-700 font-medium mb-6 text-lg">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-bold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
              Don’t wait for food.<br />
              <span className="text-red-600">Grab it.</span>
            </h2>
            <button 
              onClick={scrollToLocations}
              className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-full font-bold text-xl transition-all duration-200 shadow-[0_8px_30px_rgb(220,38,38,0.3)] hover:shadow-[0_8px_30px_rgb(220,38,38,0.5)] active:scale-95 mx-auto"
            >
              Find an Oni Machine
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-black tracking-tighter text-slate-900">
            ONI<span className="text-red-600">.</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="https://github.com/Perryltt-dev/Oni.git" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <Github size={16} /> GitHub
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">Locations</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Menu</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
          </div>
          <p className="text-slate-400 text-sm text-center md:text-right">
            © {new Date().getFullYear()} Oni Foods. Crafted with ❤️ by Perryltt-dev.
          </p>
        </div>
      </footer>

    </div>
  );
}
