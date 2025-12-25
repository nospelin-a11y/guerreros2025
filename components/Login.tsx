
import React, { useState } from 'react';
import { User } from '../types';
import { Lock, User as UserIcon, Shield } from 'lucide-react';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const [selectedUsername, setSelectedUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUsername) {
      setError('Selecciona un usuario');
      return;
    }
    
    const user = users.find(u => u.username === selectedUsername);
    if (!user) return;

    // Validación contra la contraseña del usuario (fallback a "123" si no existe)
    const validPassword = user.password || '123';
    
    if (password === validPassword) {
      onLogin(user);
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="bg-orange-600 w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-orange-600/30 mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tighter">
            GUERREROS <span className="text-orange-600 italic">2026</span>
          </h1>
          <p className="text-slate-500 font-medium">Panel de Control de Entrenamiento</p>
        </div>

        <form onSubmit={handleLogin} className="mt-12 space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500 transition-colors">
                <UserIcon className="w-5 h-5" />
              </div>
              <select
                className="block w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-3xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-600/50 appearance-none transition-all"
                value={selectedUsername}
                onChange={(e) => {
                  setSelectedUsername(e.target.value);
                  setError('');
                }}
              >
                <option value="" disabled>Selecciona tu Guerrero</option>
                {users.map(u => (
                  <option key={u.id} value={u.username}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                placeholder="Contraseña"
                className="block w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-3xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-600/50 transition-all"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-bold text-center animate-pulse">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 px-6 bg-orange-600 text-white font-bold rounded-3xl shadow-xl shadow-orange-600/20 hover:bg-orange-700 active:scale-[0.98] transition-all transform uppercase tracking-widest"
          >
            Acceder al Campo
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
