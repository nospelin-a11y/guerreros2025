
import React, { useState, useMemo } from 'react';
import { Workout, User, ActivityConfig } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Filter, Trash2, Search, Calendar } from 'lucide-react';

interface WorkoutHistoryProps {
  workouts: Workout[];
  users: User[];
  activityConfigs: ActivityConfig[];
  currentUser: User;
  onDelete: (id: string) => void;
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ workouts, users, activityConfigs, currentUser, onDelete }) => {
  const [filterUser, setFilterUser] = useState<string>('all');

  const filteredWorkouts = useMemo(() => {
    return workouts
      .filter(w => filterUser === 'all' || w.userId === filterUser)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [workouts, filterUser]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white italic">BITÁCORA</h2>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-bold text-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-600 appearance-none"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          >
            <option value="all">Todos los Guerreros</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredWorkouts.length > 0 ? (
        <div className="space-y-4">
          {filteredWorkouts.map(w => {
            const user = users.find(u => u.id === w.userId);
            const config = activityConfigs.find(c => c.type === w.activityType);
            
            return (
              <div 
                key={w.id} 
                className="bg-slate-900/80 border border-slate-800 p-4 rounded-3xl shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={user?.avatar} 
                    alt={user?.name} 
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-white truncate">{user?.name}</h3>
                      <span className="text-[10px] font-black text-slate-500 uppercase">
                        {format(new Date(w.timestamp), "HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase text-white ${config?.color || 'bg-slate-700'}`}>
                        {w.activityType}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {format(new Date(w.timestamp), "d MMM", { locale: es })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="text-lg font-black text-orange-500 italic">+{w.points}</span>
                    {currentUser.isAdmin && (
                      <button 
                        onClick={() => {
                          if (confirm('¿Eliminar este registro de combate?')) onDelete(w.id);
                        }}
                        className="p-1.5 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-800 space-y-3">
          <Search className="w-12 h-12 text-slate-700 mx-auto" />
          <p className="text-slate-500 font-bold italic">No se han encontrado registros en el sector...</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
