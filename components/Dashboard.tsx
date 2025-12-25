
import React, { useMemo } from 'react';
import { User, Workout } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Zap, Target, TrendingUp, Calendar } from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  workouts: Workout[];
  users: User[];
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, workouts, users }) => {
  const userStats = useMemo(() => {
    const userWorkouts = workouts.filter(w => w.userId === currentUser.id);
    const totalPoints = userWorkouts.reduce((sum, w) => sum + w.points, 0);
    
    // Ranking calculation
    const allUserStats = users.map(u => {
      const uWorkouts = workouts.filter(w => w.userId === u.id);
      return {
        id: u.id,
        points: uWorkouts.reduce((sum, w) => sum + w.points, 0)
      };
    }).sort((a, b) => b.points - a.points);
    
    const rank = allUserStats.findIndex(u => u.id === currentUser.id) + 1;
    const latestWorkouts = userWorkouts.slice(0, 5);

    return { totalPoints, rank, latestWorkouts, workoutCount: userWorkouts.length };
  }, [currentUser.id, workouts, users]);

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl">
        <div className="flex items-center gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-3xl border-2 border-orange-600 object-cover"
          />
          <div>
            <h2 className="text-2xl font-black text-white">Hola, {currentUser.name}!</h2>
            <p className="text-slate-400 font-medium">Guerrero de Élite</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Zap className="w-5 h-5 text-orange-500" />}
          label="Puntos"
          value={userStats.totalPoints.toFixed(2)}
          color="border-orange-600/20"
        />
        <StatCard 
          icon={<Target className="w-5 h-5 text-blue-500" />}
          label="Puesto"
          value={`#${userStats.rank}`}
          color="border-blue-600/20"
        />
        <StatCard 
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          label="Entrenos"
          value={userStats.workoutCount.toString()}
          color="border-green-600/20"
        />
        <StatCard 
          icon={<Calendar className="w-5 h-5 text-purple-500" />}
          label="Días Activo"
          value={new Set(workouts.filter(w => w.userId === currentUser.id).map(w => new Date(w.timestamp).toLocaleDateString())).size.toString()}
          color="border-purple-600/20"
        />
      </div>

      {/* Latest Workouts */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-300 ml-2">Últimos Esfuerzos</h3>
        {userStats.latestWorkouts.length > 0 ? (
          <div className="space-y-3">
            {userStats.latestWorkouts.map(w => (
              <div key={w.id} className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-3xl flex justify-between items-center group hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{w.activityType}</p>
                    <p className="text-xs text-slate-500">
                      {format(new Date(w.timestamp), "d MMM, HH:mm", { locale: es })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-orange-500 font-black">+{w.points}</span>
                  <p className="text-[10px] text-slate-600 font-bold uppercase">PTS</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-800">
            <p className="text-slate-500 font-medium italic">Aún no has sudado la camiseta...</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className={`bg-slate-900 border ${color} p-5 rounded-[2rem] shadow-lg flex flex-col gap-2`}>
    <div className="p-2 bg-slate-800/50 w-fit rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-white leading-tight">{value}</p>
    </div>
  </div>
);

export default Dashboard;
