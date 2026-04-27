import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';
import { User, Check, X, Clock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Swaps() {
  const [filter, setFilter] = useState('incoming');
  const queryClient = useQueryClient();

  const { data: swaps, isLoading } = useQuery({
    queryKey: ['swaps', filter],
    queryFn: async () => {
      const { data } = await api.get(`/swaps?filter=${filter}`);
      return data;
    }
  });

  const updateSwapMutation = useMutation({
    mutationFn: ({ id, action }) => api.put(`/swaps/${id}/${action}`),
    onSuccess: () => {
      toast.success('Swap status updated!');
      queryClient.invalidateQueries(['swaps']);
    },
    onError: () => toast.error('Failed to update swap request.')
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Swap Requests</h1>
          <p className="text-slate-600">Manage your pending and active skill exchanges.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto hide-scrollbar">
          {['incoming', 'outgoing', 'active'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 font-medium text-sm capitalize whitespace-nowrap border-b-2 transition-colors ${
                filter === tab 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab} Swaps
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="bg-white h-24 rounded-2xl border border-slate-200 animate-pulse"></div>)}
          </div>
        ) : swaps?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No {filter} swaps</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {filter === 'incoming' && "You don't have any pending requests right now."}
              {filter === 'outgoing' && "You haven't sent any requests recently."}
              {filter === 'active' && "You don't have any active skill exchanges."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {swaps?.map((swap) => {
              const otherUser = filter === 'incoming' || filter === 'active' && swap.sender_id !== user?.id ? swap.sender : swap.receiver;
              
              return (
                <div key={swap.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-200">
                      {otherUser?.avatar_url ? (
                        <img src={otherUser.avatar_url} alt={otherUser.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{otherUser?.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <ArrowRight className="w-4 h-4 text-emerald-500" />
                          Teaching: <span className="font-medium text-slate-900">{swap.skillOffered?.name}</span>
                        </span>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <span className="flex items-center gap-1.5">
                          <ArrowRight className="w-4 h-4 text-blue-500" />
                          Learning: <span className="font-medium text-slate-900">{swap.skillWanted?.name}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:ml-auto border-t border-slate-100 md:border-0 pt-4 md:pt-0">
                    {filter === 'incoming' && (
                      <>
                        <button 
                          onClick={() => updateSwapMutation.mutate({ id: swap.id, action: 'reject' })}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors"
                        >
                          <X className="w-4 h-4" /> Decline
                        </button>
                        <button 
                          onClick={() => updateSwapMutation.mutate({ id: swap.id, action: 'accept' })}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors shadow-sm"
                        >
                          <Check className="w-4 h-4" /> Accept
                        </button>
                      </>
                    )}
                    {filter === 'outgoing' && (
                      <span className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Pending
                      </span>
                    )}
                    {filter === 'active' && (
                      <button onClick={() => window.location.href = `/chat/${swap.id}`} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition-colors shadow-sm">
                        Go to Chat <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
