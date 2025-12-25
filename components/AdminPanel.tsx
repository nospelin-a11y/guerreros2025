
import React, { useState } from 'react';
import { User, ActivityConfig, ActivityType } from '../types';
import { Shield, Plus, X, Save, Edit3, Trash2, UserPlus, Eye, EyeOff, LayoutGrid } from 'lucide-react';

interface AdminPanelProps {
  users: User[];
  activityConfigs: ActivityConfig[];
  onUpdatePoints: (configs: ActivityConfig[]) => void;
  onUpdateUsers: (users: User[]) => void;
}

const COLOR_PRESETS = [
  'bg-orange-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 
  'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-cyan-500'
];

const AdminPanel: React.FC<AdminPanelProps> = ({ users, activityConfigs, onUpdatePoints, onUpdateUsers }) => {
  const [activeView, setActiveView] = useState<'points' | 'users'>('points');
  const [editConfigs, setEditConfigs] = useState<ActivityConfig[]>(activityConfigs);
  const [editUsers, setEditUsers] = useState<User[]>(users);
  
  // States for new activity
  const [newActName, setNewActName] = useState('');
  const [newActPoints, setNewActPoints] = useState('1.0');
  const [newActColor, setNewActColor] = useState(COLOR_PRESETS[0]);

  // States for users
  const [newUserName, setNewUserName] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // --- Point Management Handlers ---
  const handlePointChange = (index: number, val: string) => {
    const newVal = parseFloat(val) || 0;
    const nextConfigs = [...editConfigs];
    nextConfigs[index].points = newVal;
    setEditConfigs(nextConfigs);
  };

  const addActivity = () => {
    if (!newActName.trim()) return;
    const newConfig: ActivityConfig = {
      type: newActName.trim() as ActivityType,
      points: parseFloat(newActPoints) || 0,
      color: newActColor
    };
    const nextConfigs = [...editConfigs, newConfig];
    setEditConfigs(nextConfigs);
    onUpdatePoints(nextConfigs);
    setNewActName('');
  };

  const removeActivity = (type: string) => {
    if (confirm(`¿Eliminar la categoría "${type}"?`)) {
      const nextConfigs = editConfigs.filter(c => c.type !== type);
      setEditConfigs(nextConfigs);
      onUpdatePoints(nextConfigs);
    }
  };

  const savePoints = () => {
    onUpdatePoints(editConfigs);
    alert('Configuración de recompensas actualizada correctamente');
  };

  // --- User Management Handlers ---
  const addUser = () => {
    if (!newUserName.trim()) return;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: newUserName.toLowerCase().replace(/\s+/g, ''),
      password: newUserPass || '123',
      name: newUserName,
      isAdmin: false,
      avatar: `https://picsum.photos/seed/${newUserName}/200`
    };
    const nextUsers = [...editUsers, newUser];
    setEditUsers(nextUsers);
    onUpdateUsers(nextUsers);
    setNewUserName('');
    setNewUserPass('');
  };

  const handleUpdatePassword = (userId: string, newPass: string) => {
    const nextUsers = editUsers.map(u => u.id === userId ? { ...u, password: newPass } : u);
    setEditUsers(nextUsers);
    onUpdateUsers(nextUsers);
  };

  const removeUser = (id: string) => {
    if (confirm('¿Seguro que quieres expulsar a este guerrero?')) {
      const nextUsers = editUsers.filter(u => u.id !== id);
      setEditUsers(nextUsers);
      onUpdateUsers(nextUsers);
    }
  };

  const togglePassVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white italic">COMANDANCIA</h2>
        <div className="flex justify-center gap-4 mt-4">
          <button 
            onClick={() => setActiveView('points')}
            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'points' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-500'}`}
          >
            Recompensas
          </button>
          <button 
            onClick={() => setActiveView('users')}
            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'users' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-500'}`}
          >
            Usuarios
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl">
        {activeView === 'points' ? (
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-sm font-black text-slate-300 uppercase tracking-widest">
              <Shield className="w-4 h-4 text-orange-500" />
              Gestión de Actividades
            </h3>

            {/* Create New Activity Form */}
            <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800/50 space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Nueva Categoría</p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nombre actividad"
                  className="w-full bg-slate-900 border border-slate-800 p-3 rounded-2xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-600"
                  value={newActName}
                  onChange={(e) => setNewActName(e.target.value)}
                />
                <div className="flex gap-3">
                  <input
                    type="number"
                    step="0.25"
                    placeholder="Pts"
                    className="w-24 bg-slate-900 border border-slate-800 p-3 rounded-2xl text-sm text-center font-black text-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-600"
                    value={newActPoints}
                    onChange={(e) => setNewActPoints(e.target.value)}
                  />
                  <div className="flex-1 flex gap-1 items-center bg-slate-900 border border-slate-800 p-2 rounded-2xl overflow-x-auto hide-scrollbar">
                    {COLOR_PRESETS.map(c => (
                      <button 
                        key={c}
                        onClick={() => setNewActColor(c)}
                        className={`w-6 h-6 rounded-full flex-shrink-0 transition-all ${c} ${newActColor === c ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'}`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={addActivity}
                    className="bg-orange-600 p-3 rounded-2xl text-white shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Categorías Existentes</p>
              {editConfigs.map((config, idx) => (
                <div key={config.type} className="flex items-center gap-4 bg-slate-950 p-4 rounded-3xl border border-slate-800">
                  <div className={`w-3 h-10 rounded-full ${config.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-black text-white">{config.type}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">VALOR</p>
                  </div>
                  <input
                    type="number"
                    step="0.25"
                    className="w-16 bg-slate-900 border border-slate-800 p-2 rounded-xl text-center font-black text-orange-500 text-sm focus:outline-none focus:ring-1 focus:ring-orange-600"
                    value={config.points}
                    onChange={(e) => handlePointChange(idx, e.target.value)}
                  />
                  <button 
                    onClick={() => removeActivity(config.type)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={savePoints}
              className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest mt-4"
            >
              <Save className="w-5 h-5" /> Guardar Todos los Cambios
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-sm font-black text-slate-300 uppercase tracking-widest">
              <UserPlus className="w-4 h-4 text-orange-500" />
              Gestión de Personal
            </h3>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-2xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-600"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contraseña (opcional)"
                  className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-2xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-600"
                  value={newUserPass}
                  onChange={(e) => setNewUserPass(e.target.value)}
                />
                <button 
                  onClick={addUser}
                  className="bg-orange-600 px-6 rounded-2xl text-white shadow-lg font-black text-xs uppercase"
                >
                  Añadir
                </button>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              {editUsers.map(user => (
                <div key={user.id} className="bg-slate-950 p-4 rounded-3xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{user.isAdmin ? 'Administrador' : 'Soldado'}</p>
                    </div>
                    {!user.isAdmin && (
                      <button 
                        onClick={() => removeUser(user.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 items-center bg-slate-900 p-2 rounded-2xl border border-slate-800/50">
                    <div className="relative flex-1">
                      <input
                        type={showPasswords[user.id] ? "text" : "password"}
                        className="w-full bg-transparent p-1 text-xs font-mono text-orange-500 focus:outline-none"
                        value={user.password || ''}
                        onChange={(e) => handleUpdatePassword(user.id, e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => togglePassVisibility(user.id)}
                      className="p-1 text-slate-500 hover:text-slate-300"
                    >
                      {showPasswords[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
