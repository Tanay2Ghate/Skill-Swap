import { useContext, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import { User, Star, MapPin, Search, ArrowRight, Zap, Loader2, MessageSquare, BookOpen, CheckCircle2, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// Dummy data for roulette animation
const DUMMY_PROFILES = [
  { name: 'Sarah Connor', skill: 'Machine Learning' },
  { name: 'Tony Stark', skill: 'Engineering' },
  { name: 'Michael Scott', skill: 'Management' },
  { name: 'Emma Watson', skill: 'Public Speaking' },
  { name: 'Bruce Wayne', skill: 'Finance' },
  { name: 'Jim Halpert', skill: 'Sales' },
  { name: 'Diana Prince', skill: 'History' },
  { name: 'Clark Kent', skill: 'Journalism' },
];

export default function Matches() {
  const { user } = useContext(AuthContext);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedSwapId, setConnectedSwapId] = useState(null);
  const [connectionStep, setConnectionStep] = useState(1); // 1: connecting, 2: success
  const [exchangeDetails, setExchangeDetails] = useState({ offered: '', wanted: '' });
  
  // Roulette State
  const [isRouletteActive, setIsRouletteActive] = useState(false);
  const [rouletteUser, setRouletteUser] = useState(DUMMY_PROFILES[0]);

  const { data: matches, isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data } = await api.get('/matches');
      return data;
    }
  });

  // Enhance matches with dummy data if backend returns empty
  const displayMatches = matches && matches.length > 0 ? matches : [
    {
      id: 998,
      name: 'Alice Smith',
      bio: 'Expert in Python, looking to learn React.',
      avatar_url: null,
      avg_rating: '4.8',
      swap_count: 5,
      matched_skills_count: 1,
      userSkills: [
        { type: 'have', skill: { id: 1, name: 'Python' } },
        { type: 'want', skill: { id: 2, name: 'React.js' } }
      ]
    },
    {
      id: 999,
      name: 'Bob Jones',
      bio: 'React master, need some backend Python help.',
      avatar_url: null,
      avg_rating: '4.5',
      swap_count: 12,
      matched_skills_count: 1,
      userSkills: [
        { type: 'have', skill: { id: 2, name: 'React.js' } },
        { type: 'want', skill: { id: 1, name: 'Python' } }
      ]
    }
  ];

  const requestSwapMutation = useMutation({
    mutationFn: (swapData) => api.post('/swaps', swapData),
    onSuccess: (response) => {
      setIsConnecting(true);
      setConnectionStep(1);
      setConnectedSwapId(response.data.swap.id);
      
      // Phase 1: Connecting animation
      setTimeout(() => {
        setConnectionStep(2);
        toast.success(`You can now chat and swap skills!`);
      }, 3000);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  });

  const handleRequestSwap = (match) => {
    setSelectedMatch(match);
    // For simplicity, we just pick the first overlapping skill they have that we want, and vice versa
    // In a real app, we'd let the user select which skills specifically
    const theirHaveSkills = match.userSkills.filter(us => us.type === 'have').map(us => us.skill);
    const theirWantSkills = match.userSkills.filter(us => us.type === 'want').map(us => us.skill);
    
    const myHaveSkills = user.userSkills?.filter(us => us.type === 'have').map(us => us.skill) || [];
    const myWantSkills = user.userSkills?.filter(us => us.type === 'want').map(us => us.skill) || [];

    let skillOffered = myHaveSkills.find(myHave => theirWantSkills.some(theirWant => theirWant.id === myHave.id)) || myHaveSkills[0];
    let skillWanted = myWantSkills.find(myWant => theirHaveSkills.some(theirHave => theirHave.id === myWant.id)) || theirHaveSkills[0];

    // DEMO FALLBACK: If user has no skills setup at all, fake the data so the demo animation still plays!
    if (!skillOffered) skillOffered = { id: 1, name: 'Communication' };
    if (!skillWanted) skillWanted = theirHaveSkills[0] || { id: 2, name: 'Web Development' };

    setExchangeDetails({
      offered: skillOffered.name,
      wanted: skillWanted.name
    });

    // If it's a dummy user (id 998 or 999), just bypass the backend request to avoid foreign key constraints!
    if (match.id > 900) {
      setIsConnecting(true);
      setConnectionStep(1);
      setConnectedSwapId(999); // Fake swap ID for demo
      setTimeout(() => {
        setConnectionStep(2);
        toast.success(`You can now chat and swap skills!`);
      }, 3000);
      return;
    }

    requestSwapMutation.mutate({
      receiver_id: match.id,
      skill_offered_id: skillOffered.id,
      skill_wanted_id: skillWanted.id
    });
  };

  const startRouletteMatch = () => {
    if (!displayMatches || displayMatches.length === 0) {
      return toast.error("No users available to match with!");
    }
    
    setIsRouletteActive(true);
    let spins = 0;
    const maxSpins = 25; // How many times it cycles
    const intervalTime = 100; // ms per cycle

    const intervalId = setInterval(() => {
      // Pick a random dummy user for the visual effect
      const randomDummy = DUMMY_PROFILES[Math.floor(Math.random() * DUMMY_PROFILES.length)];
      setRouletteUser(randomDummy);
      spins++;

      if (spins >= maxSpins) {
        clearInterval(intervalId);
        // Lock onto a real match!
        const finalMatch = displayMatches[Math.floor(Math.random() * displayMatches.length)];
        setRouletteUser({ name: finalMatch.name, skill: 'Perfect Match!' });
        
        // Wait 1 second to show the locked target, then open their profile
        setTimeout(() => {
          setIsRouletteActive(false);
          setSelectedMatch(finalMatch);
          setShowDetail(true);
        }, 1200);
      }
    }, intervalTime);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Matches</h1>
            <p className="text-slate-600">People who have the skills you want, and want the skills you have.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            <button 
              onClick={startRouletteMatch}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
            >
              <RefreshCw className="w-5 h-5 group-hover:animate-spin" />
              Auto Match
            </button>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by skill..." 
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse h-64"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMatches.map((match) => {
              const theirHaveSkills = match.userSkills?.filter(us => us.type === 'have').map(us => us.skill) || [];
              const theirWantSkills = match.userSkills?.filter(us => us.type === 'want').map(us => us.skill) || [];

              return (
                <div key={match.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  <div className="p-6 flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                          {match.avatar_url ? (
                            <img src={match.avatar_url} alt={match.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{match.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>{match.avg_rating} ({match.swap_count} swaps)</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
                        {match.matched_skills_count} Matches
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {match.bio || 'This user prefers to let their skills do the talking.'}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">They can teach you:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {theirHaveSkills.slice(0, 3).map(skill => (
                            <span key={skill.id} className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">
                              {skill.name}
                            </span>
                          ))}
                          {theirHaveSkills.length > 3 && <span className="text-xs text-slate-500">+{theirHaveSkills.length - 3}</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">They want to learn:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {theirWantSkills.slice(0, 3).map(skill => (
                            <span key={skill.id} className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                              {skill.name}
                            </span>
                          ))}
                          {theirWantSkills.length > 3 && <span className="text-xs text-slate-500">+{theirWantSkills.length - 3}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <button 
                      onClick={() => handleRequestSwap(match)}
                      disabled={requestSwapMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-70"
                    >
                      Request Swap <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Match Detail Modal */}
      {showDetail && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="relative h-32 bg-gradient-to-r from-primary-500 to-accent-500">
              <button 
                onClick={() => setShowDetail(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-8 pb-8 -mt-16">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-3xl bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
                  {selectedMatch.avatar_url ? (
                    <img src={selectedMatch.avatar_url} alt={selectedMatch.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-slate-300 mx-auto mt-8" />
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">{selectedMatch.name}</h2>
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-lg text-xs font-bold border border-yellow-100">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    {selectedMatch.avg_rating}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-widest">{selectedMatch.swap_count} successful swaps</div>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">About</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedMatch.bio || "No bio provided."}</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-600 mb-3 uppercase tracking-widest">Offers to Teach</h4>
                    <div className="space-y-2">
                      {selectedMatch.userSkills?.filter(us => us.type === 'have').map((us, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          {us.skill.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary-600 mb-3 uppercase tracking-widest">Wants to Learn</h4>
                    <div className="space-y-2">
                      {selectedMatch.userSkills?.filter(us => us.type === 'want').map((us, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                          <Search className="w-4 h-4 text-primary-500" />
                          {us.skill.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setShowDetail(false); handleRequestSwap(selectedMatch); }}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98]"
              >
                Connect Now
                <Zap className="w-5 h-5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Dashboard Overlay */}
      {isConnecting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500 rounded-full blur-[120px] animate-pulse [animation-delay:1s]"></div>
          </div>

          <div className="max-w-4xl w-full px-6 text-center">
            {connectionStep === 1 ? (
              <div className="animate-in fade-in zoom-in duration-500">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                  FINDING THE <span className="text-primary-400">PERFECT</span> CONNECTION
                </h1>
                <p className="text-slate-400 text-xl mb-16">Syncing your skills with {selectedMatch?.name}...</p>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-16 relative">
                  {/* Connection Line */}
                  <div className="absolute top-1/2 left-1/4 right-1/4 h-1 bg-slate-800 hidden md:block">
                    <div className="h-full bg-gradient-to-r from-primary-500 via-white to-accent-500 w-1/3 animate-ping"></div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full border-4 border-primary-500 p-1 bg-slate-800 shadow-[0_0_40px_rgba(59,130,246,0.5)] animate-bounce">
                      <div className="w-full h-full rounded-full overflow-hidden bg-slate-700">
                        {user?.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <User className="w-16 h-16 text-slate-500 mx-auto mt-6" />}
                      </div>
                    </div>
                    <span className="text-white font-bold text-xl uppercase tracking-tighter">{user?.name}</span>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-full border border-slate-700 animate-spin-slow">
                    <Zap className="w-12 h-12 text-amber-400" />
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full border-4 border-accent-500 p-1 bg-slate-800 shadow-[0_0_40px_rgba(236,72,153,0.5)] animate-bounce [animation-delay:0.2s]">
                      <div className="w-full h-full rounded-full overflow-hidden bg-slate-700">
                        {selectedMatch?.avatar_url ? <img src={selectedMatch.avatar_url} className="w-full h-full object-cover" /> : <User className="w-16 h-16 text-slate-500 mx-auto mt-6" />}
                      </div>
                    </div>
                    <span className="text-white font-bold text-xl uppercase tracking-tighter">{selectedMatch?.name}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter italic">
                  IT'S A <span className="text-emerald-400 underline decoration-emerald-400/30">MATCH!</span>
                </h1>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
                  <div className="bg-slate-800/50 backdrop-blur px-6 py-4 rounded-2xl border border-primary-500/30">
                    <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-1">You Teach</p>
                    <p className="text-white text-xl font-bold">{exchangeDetails.offered}</p>
                  </div>
                  <Zap className="w-8 h-8 text-amber-500 hidden md:block" />
                  <div className="bg-slate-800/50 backdrop-blur px-6 py-4 rounded-2xl border border-accent-500/30">
                    <p className="text-accent-400 text-xs font-bold uppercase tracking-widest mb-1">They Teach</p>
                    <p className="text-white text-xl font-bold">{exchangeDetails.wanted}</p>
                  </div>
                </div>
                
                <p className="text-emerald-300 font-bold text-2xl max-w-2xl mx-auto mb-16 leading-relaxed bg-emerald-900/30 py-4 px-6 rounded-2xl border border-emerald-500/30">
                  🎉 You and <span className="text-white">{selectedMatch?.name}</span> can now chat and swap skills!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <button 
                    onClick={() => window.location.href = `/chat/${connectedSwapId}`}
                    className="group relative flex items-center justify-center gap-3 bg-white text-slate-900 py-6 rounded-3xl font-black text-xl hover:scale-105 transition-all shadow-xl active:scale-95"
                  >
                    <MessageSquare className="w-6 h-6 text-primary-500 group-hover:animate-bounce" /> 
                    START CHATTING
                  </button>
                  
                  <button 
                    onClick={() => window.location.href = '/swaps'}
                    className="flex items-center justify-center gap-3 bg-slate-800 text-white py-6 rounded-3xl font-bold text-xl hover:bg-slate-700 transition-all border border-slate-700"
                  >
                    <BookOpen className="w-6 h-6 text-accent-400" /> 
                    VIEW SWAP
                  </button>
                </div>

                <button 
                  onClick={() => setIsConnecting(false)}
                  className="mt-12 text-slate-500 font-medium hover:text-slate-300 transition-colors uppercase tracking-widest text-sm"
                >
                  Return to Matches
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Roulette Overlay */}
      {isRouletteActive && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/95 backdrop-blur-md overflow-hidden">
          {/* Radar background effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary-500/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary-500/30 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] [animation-delay:0.5s]"></div>
          
          <div className="relative flex flex-col items-center justify-center text-center">
            <h2 className="text-primary-400 font-bold tracking-[0.3em] uppercase mb-12 animate-pulse text-sm">
              Quantum Match Algorithm Running
            </h2>
            
            <div className="relative w-48 h-48 mb-8">
              {/* Spinning border */}
              <div className="absolute inset-0 border-4 border-t-primary-500 border-r-accent-500 border-b-primary-500 border-l-accent-500 rounded-full animate-spin"></div>
              
              <div className="absolute inset-2 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden border-4 border-slate-900 shadow-2xl">
                <User className="w-20 h-20 text-slate-600 animate-pulse" />
              </div>
            </div>

            <div className="h-24 flex flex-col items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                {rouletteUser.name}
              </h1>
              <p className="text-xl text-accent-400 mt-2 font-medium">
                {rouletteUser.skill}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
