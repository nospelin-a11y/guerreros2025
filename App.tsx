
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  LayoutDashboard, 
  Trophy, 
  PlusCircle, 
  History, 
  Settings, 
  LogOut,
  Loader2
} from 'lucide-react';
import { User, Workout, ActivityConfig, AppTab } from './types';
import { INITIAL_USERS, INITIAL_ACTIVITY_CONFIG } from './constants';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Ranking from './components/Ranking';
import WorkoutForm from './components/WorkoutForm';
import WorkoutHistory from './components/WorkoutHistory';

// Lazy loading del AdminPanel para que solo se cargue si el usuario es Franju
const AdminPanel = lazy(() => import('./components/AdminPanel'));

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('g26_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('g26_workouts');
    return saved ? JSON.parse(saved) : [];
  });

  const [activityConfigs, setActivityConfigs] = useState<ActivityConfig[]>(() => {
    const saved = localStorage.getItem('g26_activity_configs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('g26_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('g26_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('g26_activity_configs', JSON.stringify(activityConfigs));
  }, [activityConfigs]);

  useEffect(() => {
    const savedUser = localStorage.getItem('g26_current_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('g26_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('g26_current_user');
    setActiveTab('dashboard');
  };

  const handleAddWorkout = (workout: Workout) => {
    setWorkouts(prev => [workout, ...prev]);
    setActiveTab('history');
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  const handleUpdatePoints = (configs: ActivityConfig[]) => {
    setActivityConfigs(configs);
  };

  const handleManageUsers = (newUsers: User[]) => {
    setUsers(newUsers);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100 flex flex-col">
      <header className="p-6 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-30 flex justify-between items-center border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 p-2 rounded-xl shadow-lg shadow-orange-900/20">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Guerreros <span className="text-orange-500">2026</span>
          </h1>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 overflow-x-hidden">
        <div className="page-transition">
          {activeTab === 'dashboard' && (
            <Dashboard 
              currentUser={currentUser} 
              workouts={workouts} 
              users={users}
            />
          )}
          {activeTab === 'ranking' && (
            <Ranking 
              users={users} 
              workouts={workouts} 
            />
          )}
          {activeTab === 'add' && (
            <WorkoutForm 
              currentUser={currentUser} 
              workouts={workouts} 
              activityConfigs={activityConfigs}
              onSave={handleAddWorkout}
            />
          )}
          {activeTab === 'history' && (
            <WorkoutHistory 
              workouts={workouts} 
              users={users} 
              activityConfigs={activityConfigs}
              currentUser={currentUser}
              onDelete={handleDeleteWorkout}
            />
          )}
          {activeTab === 'admin' && currentUser.isAdmin && (
            <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-orange-600" /></div>}>
              <AdminPanel 
                users={users}
                activityConfigs={activityConfigs}
                onUpdatePoints={handleUpdatePoints}
                onUpdateUsers={handleManageUsers}
              />
            </Suspense>
          )}
        </div>
      </main>

      <nav className="fixed bottom-6 left-4 right-4 h-20 bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-[2.5rem] shadow-2xl flex items-center justify-around px-4 z-40">
        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard className="w-6 h-6" />}
          label="Inicio"
        />
        <NavButton 
          active={activeTab === 'ranking'} 
          onClick={() => setActiveTab('ranking')} 
          icon={<Trophy className="w-6 h-6" />}
          label="Ranking"
        />
        <button 
          onClick={() => setActiveTab('add')}
          className={`relative -top-10 bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-orange-600/30 transition-all hover:scale-110 active:scale-95 border-4 border-slate-950`}
        >
          <PlusCircle className="w-8 h-8 text-white" />
        </button>
        <NavButton 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
          icon={<History className="w-6 h-6" />}
          label="Historial"
        />
        {currentUser.isAdmin && (
          <NavButton 
            active={activeTab === 'admin'} 
            onClick={() => setActiveTab('admin')} 
            icon={<Settings className="w-6 h-6" />}
            label="Admin"
          />
        )}
      </nav>
    </div>
  );
};

const NavButton = React.memo(({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-orange-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
));

export default App;
