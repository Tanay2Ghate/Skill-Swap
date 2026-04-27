import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, ArrowLeft, Check, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [bio, setBio] = useState('');
  
  // Fetch all skills
  const { data: allSkills, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data } = await api.get('/skills');
      return data;
    }
  });

  const [selectedHave, setSelectedHave] = useState([]);
  const [selectedWant, setSelectedWant] = useState([]);

  const updateBioMutation = useMutation({
    mutationFn: (bio) => api.put('/users/me', { bio }),
    onSuccess: () => setStep(2)
  });

  const addSkillMutation = useMutation({
    mutationFn: (skillData) => api.post('/users/me/skills', skillData)
  });

  const handleNextStep1 = (e) => {
    e.preventDefault();
    updateBioMutation.mutate(bio);
  };

  const handleComplete = async () => {
    try {
      // Check for overlapping skills
      const haveIds = selectedHave.map(s => s.id);
      const wantIds = selectedWant.map(s => s.id);
      const overlap = haveIds.some(id => wantIds.includes(id));
      if (overlap) {
        return toast.error('You cannot select the same skill in both Teach and Learn lists.');
      }

      // Add all HAVE skills
      for (const skill of selectedHave) {
        await addSkillMutation.mutateAsync({ skill_id: skill.id, type: 'have', proficiency: 'intermediate' });
      }
      // Add all WANT skills
      for (const skill of selectedWant) {
        await addSkillMutation.mutateAsync({ skill_id: skill.id, type: 'want', proficiency: 'beginner' });
      }
      toast.success('Profile setup complete!');
      
      // Refresh user data in context
      const { data } = await api.get('/users/me');
      // If we had a setter in AuthContext, we'd use it here.
      // We will just force a reload for simplicity
      window.location.href = '/dashboard';
    } catch (error) {
      toast.error('Failed to save skills. Please try again.');
    }
  };

  const toggleSkill = (skill, list, setList) => {
    if (list.find(s => s.id === skill.id)) {
      setList(list.filter(s => s.id !== skill.id));
    } else {
      if (list.length >= 10) return toast.error('You can only select up to 10 skills');
      setList([...list, skill]);
    }
  };

  const renderSkillSelector = (list, setList, type) => (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {list.map(skill => (
          <span key={skill.id} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${type === 'have' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
            {skill.name}
            <button onClick={() => toggleSkill(skill, list, setList)} className="hover:text-red-500"><X className="w-4 h-4" /></button>
          </span>
        ))}
      </div>
      <div className="h-64 overflow-y-auto border border-slate-200 rounded-xl p-4 bg-slate-50">
        {isLoading ? (
          <div className="text-center py-8 text-slate-500">Loading skills...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allSkills?.map(skill => {
              const isSelected = list.find(s => s.id === skill.id);
              return (
                <button
                  key={skill.id}
                  onClick={() => toggleSkill(skill, list, setList)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all text-left ${isSelected ? (type === 'have' ? 'border-emerald-500 bg-emerald-50' : 'border-blue-500 bg-blue-50') : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <span className={`text-sm font-medium ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{skill.name}</span>
                  {isSelected ? <Check className={`w-4 h-4 ${type === 'have' ? 'text-emerald-600' : 'text-blue-600'}`} /> : <Plus className="w-4 h-4 text-slate-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Progress bar */}
        <div className="bg-slate-100 h-2 w-full">
          <div className="bg-primary-500 h-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <div className="p-8 sm:p-12">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome to SkillSwap!</h2>
                <p className="text-slate-600">Let's set up your profile so others can get to know you.</p>
              </div>
              <form onSubmit={handleNextStep1} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bio (Optional)</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell the community a bit about yourself..."
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Skills You Can Teach</h2>
                <p className="text-slate-600">Select the skills you already have and are willing to share.</p>
              </div>
              {renderSkillSelector(selectedHave, setSelectedHave, 'have')}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 px-4 py-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(3)} className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors">
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Skills You Want to Learn</h2>
                <p className="text-slate-600">Select the skills you're hoping to learn from others.</p>
              </div>
              {renderSkillSelector(selectedWant, setSelectedWant, 'want')}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 px-4 py-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleComplete} className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
                  Complete Profile <Check className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
