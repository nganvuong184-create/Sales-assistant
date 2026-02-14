
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Specialty, Message, MenuItem, HotelRoom, OrderRequest } from './types';
import { CAO_BANG_SPECIALTIES, SYSTEM_INSTRUCTION, PHO_TOPPINGS, MA_BU_MENU, HOTEL_ROOMS } from './constants';
import SpecialtyCard from './components/SpecialtyCard';
import AudioVisualizer from './components/AudioVisualizer';
import { decode, encode, decodeAudioData, createBlob } from './utils/audioUtils';

type Section = 'explore' | 'eat' | 'stay';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('explore');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [userInputTranscription, setUserInputTranscription] = useState('');
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const isMutedRef = useRef(false);

  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  const toggleSession = () => isSessionActive ? stopSession() : startSession();
  const toggleMute = () => setIsMuted(prev => !prev);

  const askAI = (prompt: string, itemId: string) => {
    if (!isSessionActive) {
      alert("Please turn on the AI Guide first!");
      return;
    }
    setActiveItemId(itemId);
    if (sessionRef.current) {
      sessionRef.current.sendRealtimeInput({ message: prompt });
      setUserInputTranscription(`Requesting: ${itemId}`);
    }
  };

  const processOrderTag = (text: string) => {
    const orderTag = '[ORDER]';
    if (text.includes(orderTag)) {
      const summary = text.split(orderTag)[1].trim();
      if (summary) {
        const newOrder = {
          id: Math.random().toString(36).substr(2, 9),
          vietnameseSummary: summary,
          timestamp: new Date(),
          status: 'pending' as const
        };
        // Chỉ giữ lại yêu cầu mới nhất để tránh nhầm lẫn cho chủ quán
        setOrders([newOrder]);
      }
    }
  };

  const startSession = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    inputAudioContextRef.current = new AudioContext({ sampleRate: 16000 });
    outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });

    // gọi mic
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    console.log("Mic OK", stream);

    // xử lý session
    sessionRef.current = await sessionPromise;

  } catch (err: any) {
    console.error("Mic error:", err.name, err.message);
    alert("Mic error: " + err.name);
  }
};




      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsSessionActive(true);
            const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            scriptProcessor.onaudioprocess = (e) => {
              if (!isMutedRef.current) {
                const data = e.inputBuffer.getChannelData(0);
                sessionPromise.then(s => s.sendRealtimeInput({ media: createBlob(data) }));
                setIsUserSpeaking(data.reduce((a, v) => a + Math.abs(v), 0) / data.length > 0.01);
              } else setIsUserSpeaking(false);
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (m: LiveServerMessage) => {
            if (m.serverContent?.outputTranscription) {
              setCurrentTranscription(p => p + m.serverContent.outputTranscription!.text);
            }
            if (m.serverContent?.inputTranscription) {
              setUserInputTranscription(p => p + m.serverContent.inputTranscription!.text);
            }
            const audio = m.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio && outputAudioContextRef.current) {
              setIsModelSpeaking(true);
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsModelSpeaking(false);
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (m.serverContent?.turnComplete) {
              processOrderTag(currentTranscription);
              setMessages(p => [...p, 
                { role: 'user', text: userInputTranscription || "Voice", timestamp: new Date() }, 
                { role: 'model', text: currentTranscription || "Response", timestamp: new Date() }
              ]);
              setCurrentTranscription(''); 
              setUserInputTranscription('');
            }
          },
          onerror: (e) => console.error(e),
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          outputAudioTranscription: {}, inputAudioTranscription: {}
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) { alert("Mic error or API failure."); }
  };

  const stopSession = () => {
    setIsSessionActive(false); setIsModelSpeaking(false); setIsUserSpeaking(false);
    if (sessionRef.current) sessionRef.current.close();
    if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    sourcesRef.current.forEach(s => s.stop()); sourcesRef.current.clear();
  };

  const latestOrder = orders[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-emerald-900 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight">Cao Bằng AI Bridge</h1>
          </div>
          <nav className="flex bg-black/20 p-1 rounded-2xl">
            {(['explore', 'eat', 'stay'] as Section[]).map(s => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeSection === s ? 'bg-emerald-500 text-white' : 'text-emerald-200/60 hover:text-white'}`}
              >
                {s}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
          {activeSection === 'explore' && (
            <section className="animate-fadeIn">
              <h2 className="text-2xl font-black text-slate-800 mb-6">Local Specialties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {CAO_BANG_SPECIALTIES.map(s => (
                  <SpecialtyCard key={s.id} specialty={s} onClick={(item) => askAI(`Tell me about ${item.name}.`, item.id)} isActive={activeItemId === s.id} />
                ))}
              </div>
            </section>
          )}

          {activeSection === 'eat' && (
            <section className="animate-fadeIn space-y-8">
              <h2 className="text-2xl font-black text-slate-800">Cao Bang Pho</h2>
              <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select your choice:</h3>
                  <div className="flex flex-wrap gap-3">
                    {['Fresh Noodle', 'Dried Noodle', 'Sour Pho'].map(n => (
                      <button key={n} onClick={() => askAI(`I'd like to order ${n}.`, n)} className="px-6 py-3 border border-slate-200 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all">{n}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {PHO_TOPPINGS.map(t => (
                    <button key={t.id} onClick={() => askAI(`Add ${t.name} to my Pho.`, t.id)} className="p-4 border border-slate-100 rounded-[28px] text-left hover:border-emerald-300">
                      <p className="text-sm font-black">{t.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeSection === 'stay' && (
            <section className="animate-fadeIn space-y-6">
              <h2 className="text-2xl font-black text-slate-800">Accommodations</h2>
              {HOTEL_ROOMS.map(r => (
                <div key={r.id} onClick={() => askAI(`I want to book the ${r.type}.`, r.id)} className="bg-white rounded-[40px] overflow-hidden border border-slate-200 flex flex-col md:flex-row cursor-pointer hover:shadow-xl transition-all">
                  <img src={r.image} className="w-full md:w-64 h-48 object-cover" alt={r.type} />
                  <div className="p-8 flex-1">
                    <h3 className="text-xl font-black mb-2">{r.type}</h3>
                    <div className="flex gap-2 mb-4">
                      {r.amenities.map(a => <span key={a} className="text-[10px] bg-emerald-50 px-3 py-1 rounded-full text-emerald-700 font-bold uppercase">{a}</span>)}
                    </div>
                    <p className="text-lg font-black text-emerald-800">{r.price}</p>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Sidebar Interaction (Always visible) */}
        <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-[40px] shadow-2xl p-10 flex flex-col items-center text-center relative overflow-hidden border border-slate-100">
              <div className={`absolute top-0 left-0 w-full h-2 ${isSessionActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
              
              <div className="relative mb-8">
                {isSessionActive && !isMuted && <div className="absolute -inset-8 rounded-full border-4 border-emerald-500/20 animate-ping" />}
                <button onClick={toggleSession} className={`w-32 h-32 rounded-[48px] flex items-center justify-center transition-all shadow-2xl border-[6px] border-white ${isSessionActive ? 'bg-red-500' : 'bg-emerald-600'}`}>
                   {isSessionActive ? <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"/></svg> : <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>}
                </button>
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-2">{isSessionActive ? 'AI Guide is Ready' : 'Start AI Guide'}</h3>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-6">Speak now to order or ask info</p>

              <div className="w-full flex justify-around items-center mb-8">
                <div className="flex flex-col items-center gap-2">
                  <AudioVisualizer isActive={isUserSpeaking && isSessionActive && !isMuted} color="bg-emerald-500" />
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">You</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <AudioVisualizer isActive={isModelSpeaking && isSessionActive} color="bg-blue-500" />
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">AI</span>
                </div>
              </div>

              {/* DEDICATED MERCHANT TICKET - EXTREMELY VISIBLE */}
              {latestOrder && (
                <div className="w-full mt-4 animate-slideUp">
                   <div className="bg-amber-400 text-black p-6 rounded-[32px] shadow-xl border-4 border-black/5">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">PHIẾU CHO CHỦ QUÁN (Ticket)</p>
                      <p className="text-2xl font-black leading-tight">
                        {latestOrder.vietnameseSummary}
                      </p>
                      <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-center gap-2">
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"/></svg>
                         <span className="text-[10px] font-bold">Show this to owner</span>
                      </div>
                   </div>
                   <button 
                    onClick={() => setOrders([])} 
                    className="mt-4 text-[9px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors"
                   >
                     Clear Ticket
                   </button>
                </div>
              )}
            </div>

            {/* Conversation Log - Secondary focus */}
            {isSessionActive && (
              <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-xl max-h-[300px] overflow-y-auto custom-scrollbar">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-4">Recent Chat</h4>
                <div className="space-y-4">
                   {userInputTranscription && <p className="text-xs italic opacity-60">"{userInputTranscription}"</p>}
                   {currentTranscription && <p className="text-sm font-bold leading-relaxed">{currentTranscription}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 px-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2024 Cao Bang Tourism AI Bridge • Real-time Translation</p>
      </footer>

      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
