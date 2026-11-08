import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from './config';
import { User } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Fetch user profile from Firestore
export async function getUserFromFirestore(userId: string): Promise<User | null> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      return null;
    }
    return snap.data() as User;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

// Save or create new user profile in Firestore
export async function saveUserToFirestore(user: User): Promise<void> {
  const path = `users/${user.id}`;
  try {
    const userDocRef = doc(db, 'users', user.id);
    const payload: Record<string, any> = {
      id: user.id,
      name: user.name || 'Estudante Dev',
      email: user.email || '',
      avatar: user.avatar || '🦊',
      originalKey: user.originalKey || '',
      xp: typeof user.xp === 'number' ? user.xp : 0,
      streak: typeof user.streak === 'number' ? user.streak : 1,
      lastActiveDate: user.lastActiveDate || new Date().toISOString().split('T')[0],
      gems: typeof user.gems === 'number' ? user.gems : 100,
      hearts: typeof user.hearts === 'number' ? user.hearts : 5,
      maxHearts: typeof user.maxHearts === 'number' ? user.maxHearts : 5,
      completedLessons: Array.isArray(user.completedLessons) ? user.completedLessons : [],
      completedModules: Array.isArray(user.completedModules) ? user.completedModules : [],
      currentModuleId: user.currentModuleId || 'mod-1',
      isAdmin: Boolean(user.isAdmin),
      isGuest: Boolean(user.isGuest),
      updatedAt: new Date().toISOString(),
    };

    if (user.selectedLanguageId) {
      payload.selectedLanguageId = user.selectedLanguageId;
    }

    await setDoc(userDocRef, payload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
