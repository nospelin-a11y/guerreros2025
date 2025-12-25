
import React, { useState, useMemo } from 'react';
import { User, Workout, ActivityConfig, ActivityType } from '../types';
import { isSameDay } from 'date-fns';
import { CheckCircle2, AlertCircle, Dumbbell, PlayCircle } from 'lucide-react';

interface WorkoutFormProps {
  currentUser: User;
  workouts: Workout[];
  activityConfigs: ActivityConfig[];
  onSave: (workout: Workout) => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ currentUser, workouts, activityConfigs, onSave }) => {
  const [selectedType, setSelectedType] = useState<ActivityType | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);

  const workoutsToday = useMemo(() => {
    return workouts.filter(w => w.userId === currentUser.id && isSameDay(new Date(w.timestamp), new Date()));
  }, [workouts, currentUser.id]);

  const canAddMore = workoutsToday.length < 2;

  const handleAdd = () => {
    if (!selectedType) return;
    if (!canAddMore) {
      setStatus({ type: 'error', message: '¡Límite alcanzado! Máximo 2 entrenos al día.' });
      return;
    }

    setIsSubmitting(true);
    const config = activityConfigs.find(c => c.type === selectedType)!;
    
    const newWorkout: Workout = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      activityType: selectedType as ActivityType,
      points: config.points,
      timestamp: Date.now(),
    };

    // Simulate small delay for impact
    setTimeout(() => {
      onSave(newWorkout);
      setStatus({ type: 'success', message: '¡Entrenamiento registrado con éxito!' });
      setIsSubmitting(false);
      setSelectedType('');
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white italic tracking-tight">REGISTRAR ESFUERZO</h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Tu disciplina es tu poder</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl space-y-8">
        {/* Progress Tracker */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Cupo Diario</span>
            <span className="text-lg font-black text-white">{workoutsToday.length}/2</span>
          </div>
          <div className="h-4 bg-slate-950 rounded-full overflow-hidden p-1 flex gap-1">
            <div className={`flex-1 rounded-full transition-all duration-500 ${workoutsToday.length >= 1 ? 'bg-orange-600' : 'bg-slate-800'}`} />
            <div className={`flex-1 rounded-full transition-all duration-500 ${workoutsToday.length >= 2 ? 'bg-orange-600' : 'bg-slate-800'}`} />
          </div>
        </div>

        <div className="space-y-6">
          <label className="block text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Selecciona Actividad</label>
          <div className="grid grid-cols-2 gap-4">
            {activityConfigs.map(config => (
              <button
                key={config.type}
                type="button"
                onClick={() => {
                    setSelectedType(config.type);
                    setStatus(null);
                }}
                className={`relative flex flex-col items-center gap-3 p-5 rounded-3xl border-2 transition-all group ${
                  selectedType === config.type 
                    ? 'bg-orange-600/10 border-orange-600' 
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${config.color} shadow-lg transition-transform group-active:scale-90`}>
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-white">{config.type}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">+{config.points} pts</p>
                </div>
                {selectedType === config.type && (
                   <div className="absolute -top-2 -right-2 bg-orange-600 rounded-full p-1 shadow-lg">
                     <CheckCircle2 className="w-4 h-4 text-white" />
                   </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {status && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-green-600/10 text-green-400' : 'bg-red-600/10 text-red-400'}`}>
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-xs font-black uppercase">{status.message}</span>
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={isSubmitting || !selectedType || !canAddMore}
          className={`w-full py-5 rounded-3xl font-black text-white shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest transition-all active:scale-[0.98] ${
            !selectedType || !canAddMore 
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
              : 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20'
          }`}
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <PlayCircle className="w-6 h-6" />
              <span>Ejecutar Registro</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WorkoutForm;
