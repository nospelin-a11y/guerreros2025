
import { ActivityConfig, User } from './types';

export const INITIAL_USERS: User[] = [
  { id: '1', username: 'juanmi', password: 'guerrero_master', name: 'Juanmi', isAdmin: false, avatar: 'https://picsum.photos/seed/juanmi/200' },
  { id: '2', username: 'adri', password: 'adri_2026', name: 'Adri', isAdmin: false, avatar: 'https://picsum.photos/seed/adri/200' },
  { id: '3', username: 'joseluis', password: 'jose_luis_26', name: 'Joseluis', isAdmin: false, avatar: 'https://picsum.photos/seed/joseluis/200' },
  { id: '4', username: 'josevi', password: 'jose_vi_26', name: 'Josevi', isAdmin: false, avatar: 'https://picsum.photos/seed/josevi/200' },
  { id: '5', username: 'pedro', password: 'pedro_g26', name: 'Pedro', isAdmin: false, avatar: 'https://picsum.photos/seed/pedro/200' },
  { id: '6', username: 'franju', password: 'franju_g26', name: 'Franju', isAdmin: true, avatar: 'https://picsum.photos/seed/franju/200' },
  { id: '7', username: 'sergio', password: 'sergio_g26', name: 'Sergio', isAdmin: false, avatar: 'https://picsum.photos/seed/sergio/200' },
  { id: '8', username: 'joseca', password: 'jose_ca_26', name: 'Joseca', isAdmin: false, avatar: 'https://picsum.photos/seed/joseca/200' },
  { id: '9', username: 'juanma', password: 'juanma_g26', name: 'Juanma', isAdmin: false, avatar: 'https://picsum.photos/seed/juanma/200' },
];

export const INITIAL_ACTIVITY_CONFIG: ActivityConfig[] = [
  { type: 'Crossfit', points: 1.0, color: 'bg-orange-500' },
  { type: 'Correr', points: 1.0, color: 'bg-blue-500' },
  { type: 'Musculación', points: 1.0, color: 'bg-purple-500' },
  { type: 'Bicicleta', points: 1.0, color: 'bg-green-500' },
  { type: 'Pádel', points: 0.25, color: 'bg-yellow-500' },
  { type: 'Baloncesto', points: 0.25, color: 'bg-red-500' },
];
