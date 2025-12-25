
import React, { useMemo } from 'react';
import { User, Workout } from '../types';
import { Trophy, Medal, Star } from 'lucide-react';

interface RankingProps {
  users: User[];
  workouts: Workout[];
}

const RankingItem = React.memo(({ user, index, maxPoints }: { user: any, index: number, maxPoints: number }) => (
  <div 
    className={`relative overflow-hidden bg-slate-900 border ${index === 0 ? 'border-orange-500 shadow-orange-500/10' : 'border-slate-800'} p-4 rounded-3xl transition-all`}
  >
    <div 
      className="absolute left-0 bottom-0 h-1 bg-orange-600/20 transition-all duration-1000 ease-out"
      style={{ width: `${(user.points / maxPoints) * 100}%` }}
    />

    <div className="flex items-center gap-4 relative z-10">
      <div className="flex-shrink-0 relative">
        <img 
          src={`${user.avatar}&w=100`} 
          alt={user.name} 
          loading="lazy"
          className={`w-14 h-14 rounded-2xl object-cover border-2 ${index === 0 ? 'border-orange-500 scale-110' : 'border-slate-800'}`}
        />
        <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-lg ${
          index === 0 ? 'bg-orange-500 text-white' : 
          index === 1 ? 'bg-slate-400 text-slate-900' :
          index === 2 ? 'bg-orange-800 text-white' : 'bg-slate-800 text-slate-400'
        }`}>
          #{index + 1}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-extrabold text-white truncate">{user.name}</h3>
          {index === 0 && <Trophy className="w-4 h-4 text-orange-500" />}
          {index === 1 && <Medal className="w-4 h-4 text-slate-400" />}
          {index === 2 && <Star className="w-4 h-4 text-orange-800" />}
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {user.workoutCount} Entrenamientos
        </p>
      </div>

      <div className="text-right">
        <p className="text-2xl font-black text-orange-500 italic leading-none">{user.points.toFixed(2)}</p>
        <p className="text-[10px] font-black text-slate-600 uppercase">Puntos</p>
      </div>
    </div>
  </div>
));

const Ranking: React.FC<RankingProps> = ({ users, workouts }) => {
  const leaderboard = useMemo(() => {
    return users.map(u => {
      const uWorkouts = workouts.filter(w => w.userId === u.id);
      const points = uWorkouts.reduce((sum, w) => sum + w.points, 0);
      return {
        ...u,
        points,
        workoutCount: uWorkouts.length
      };
    }).sort((a, b) => b.points - a.points);
  }, [users, workouts]);

  const maxPoints = leaderboard[0]?.points || 1;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">Salón de la Fama</h2>
        <p className="text-slate-500 font-semibold tracking-widest text-xs">AÑO 2026 - TEMPORADA OFICIAL</p>
      </div>

      <div className="space-y-4">
        {leaderboard.map((user, index) => (
          <RankingItem 
            key={user.id} 
            user={user} 
            index={index} 
            maxPoints={maxPoints} 
          />
        ))}
      </div>
    </div>
  );
};

export default Ranking;
