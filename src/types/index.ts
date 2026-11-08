export interface User {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  isAdmin: boolean;
  directCode: string; // Unique quick-access direct code (can be customized by user)
  directCodePassword?: string; // Optional password lock on direct code
  password?: string; // Stored credential for email/password or guest
  originalKey?: string; // The activation key redeemed from the 1,100 keys
  avatar: string;
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  gems: number;
  hearts: number;
  maxHearts: number;
  completedLessons: string[]; // array of lesson IDs
  completedModules: number[]; // array of module numbers
  quizScores: Record<string, boolean>; // quizId -> passed
  currentModuleId: string;
  selectedLanguageId?: string; // Currently active language track (e.g. 'mod-1')
  unlockedModules?: number[]; // Modules unlocked for the user
  registeredAt: string;
  deviceId?: string; // Device ID where user was registered/authenticated
  registeredDeviceId?: string; // Device bound to the purchased key
  securityNumber?: number; // Secret 2-digit recovery pattern number (e.g. 13, 45, 46) configured in Settings
}
