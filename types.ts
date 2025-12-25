
export type ActivityType = 'Crossfit' | 'Correr' | 'Musculación' | 'Bicicleta' | 'Pádel' | 'Baloncesto';

export interface ActivityConfig {
  type: ActivityType;
  points: number;
  color: string;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  isAdmin: boolean;
  avatar: string;
}

export interface Workout {
  id: string;
  userId: string;
  activityType: ActivityType;
  points: number;
  timestamp: number; // Date.now()
}

export type AppTab = 'dashboard' | 'ranking' | 'add' | 'history' | 'admin';
