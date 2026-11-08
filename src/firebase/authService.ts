import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from './config';
import { getUserFromFirestore, saveUserToFirestore } from './userService';
import { User } from '../types';

// Convert Firebase user & Firestore profile into DevDuo User
export async function getOrCreateDevDuoUser(
  fbUser: FirebaseUser,
  activatedKey?: string,
  preferredName?: string,
  avatar?: string
): Promise<User> {
  const existing = await getUserFromFirestore(fbUser.uid);
  if (existing) {
    if (activatedKey && !existing.originalKey) {
      existing.originalKey = activatedKey;
      await saveUserToFirestore(existing);
    }
    return existing;
  }

  const isAdmin =
    fbUser.email === 'admin@devduo.local' ||
    fbUser.email === 'dttgtdsfjurtjgf@gmail.com';

  const newUser: User = {
    id: fbUser.uid,
    name: preferredName || fbUser.displayName || fbUser.email?.split('@')[0] || 'Estudante Dev',
    email: fbUser.email || '',
    isGuest: false,
    isAdmin,
    directCode: `DEV-PASS-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    originalKey: activatedKey || (isAdmin ? 'DEVDUO-ADMIN-MASTER-8899' : undefined),
    avatar: avatar || '🦊',
    xp: isAdmin ? 9999 : 0,
    streak: isAdmin ? 99 : 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    gems: 9999, // Infinite / unlimited access
    hearts: 999, // Infinite / unlimited access
    maxHearts: 999,
    completedLessons: [],
    completedModules: [],
    quizScores: {},
    currentModuleId: 'mod-1',
    registeredAt: new Date().toISOString(),
  };

  await saveUserToFirestore(newUser);
  return newUser;
}

// 1. Sign in with Google (Popup)
export async function signInWithGoogle(activatedKey?: string): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return await getOrCreateDevDuoUser(result.user, activatedKey);
}

// 2. Sign up with Email and Password
export async function signUpWithEmail(
  email: string,
  pass: string,
  name: string,
  avatar: string,
  activatedKey?: string
): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (name && result.user) {
    try {
      await updateProfile(result.user, { displayName: name });
    } catch (e) {
      console.warn('Failed to set displayName:', e);
    }
  }
  return await getOrCreateDevDuoUser(result.user, activatedKey, name, avatar);
}

// 3. Sign in with Email and Password
export async function signInWithEmail(
  email: string,
  pass: string,
  activatedKey?: string
): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return await getOrCreateDevDuoUser(result.user, activatedKey);
}

// 4. Logout
export async function signOutUser(): Promise<void> {
  await fbSignOut(auth);
}
