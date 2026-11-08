import { User } from '../types';
import { INITIAL_ACCESS_KEYS, ADMIN_MASTER_KEY, AccessKey } from '../data/accessKeys';
import { saveUserToFirestore } from '../firebase/userService';

const STORAGE_KEYS = {
  USER: 'devduo_current_user',
  ALL_KEYS: 'devduo_access_keys',
  USED_KEYS_SET: 'devduo_used_keys_set',
  DIRECT_CODES_MAP: 'devduo_direct_codes_map', // directCode (uppercase) -> User
  KEY_DEVICE_MAP: 'devduo_key_device_map', // normalizedKey -> { deviceId: string; activatedAt: string; user: User }
  DEVICE_ID: 'devduo_device_id',
  SOUND_MUTED: 'devduo_sound_muted',
};

// Create a fast lookup Set for all valid key codes normalized
const VALID_KEYS_SET = new Set(
  INITIAL_ACCESS_KEYS.map(k => k.code.trim().toUpperCase())
);

// Device Identification: Generates a stable unique device signature for this browser/device
export function getOrCreateDeviceId(): string {
  try {
    let devId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    if (!devId) {
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const timePart = Date.now().toString(36).toUpperCase();
      devId = `DEV-APARELHO-${timePart}-${randomSuffix}`;
      localStorage.setItem(STORAGE_KEYS.DEVICE_ID, devId);
    }
    return devId;
  } catch (e) {
    return 'DEV-APARELHO-LOCAL';
  }
}

// Generate an initial memorable direct access password (e.g. PASS-8392)
export function generateRandomPassword(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `PASS-${digits}`;
}

// Generate random 2-digit recovery pattern number (e.g. 13, 45, 46, 78)
export function generateRandomSecurityNumber(): number {
  return Math.floor(10 + Math.random() * 90);
}

// Helper to generate unique Direct Quick-Access Code
export function generateDirectAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let p1 = '';
  let p2 = '';
  for (let i = 0; i < 4; i++) {
    p1 += chars[Math.floor(Math.random() * chars.length)];
    p2 += chars[Math.floor(Math.random() * chars.length)];
  }
  return `DEV-PASS-${p1}-${p2}`;
}

// Normalize access key input to match regardless of spacing, lowercase, or missing prefix
export function normalizeKeyCode(input: string): string {
  const clean = (input || '').trim().toUpperCase();
  if (clean.startsWith('DEVDUO-')) {
    return clean;
  }
  const candidate = `DEVDUO-${clean}`;
  if (VALID_KEYS_SET.has(candidate)) {
    return candidate;
  }
  return clean;
}

// Get all keys ensuring that all 1,100 keys are loaded, preserving any used status
export function getStoredAccessKeys(): AccessKey[] {
  let usedCodes = new Set<string>();
  try {
    const rawUsed = localStorage.getItem(STORAGE_KEYS.USED_KEYS_SET);
    if (rawUsed) {
      usedCodes = new Set(JSON.parse(rawUsed));
    }
  } catch (e) {
    console.warn('Could not parse used keys:', e);
  }

  return INITIAL_ACCESS_KEYS.map(k => ({
    code: k.code,
    isUsed: usedCodes.has(k.code.toUpperCase()),
  }));
}

// Get device binding for a purchased key
export function getKeyDeviceBinding(code: string): { deviceId: string; activatedAt: string; user?: User } | null {
  const normalized = normalizeKeyCode(code);
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KEY_DEVICE_MAP);
    if (raw) {
      const map = JSON.parse(raw);
      return map[normalized] || null;
    }
  } catch (e) {
    console.warn('Could not read key device map:', e);
  }
  return null;
}

// Bind a purchased key strictly to a device
export function bindKeyToDevice(code: string, deviceId: string, user: User): void {
  const normalized = normalizeKeyCode(code);
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KEY_DEVICE_MAP);
    const map = raw ? JSON.parse(raw) : {};
    map[normalized] = {
      deviceId,
      activatedAt: new Date().toISOString(),
      user,
    };
    localStorage.setItem(STORAGE_KEYS.KEY_DEVICE_MAP, JSON.stringify(map));

    // Also mark key as used in general set
    const rawUsed = localStorage.getItem(STORAGE_KEYS.USED_KEYS_SET);
    const usedList: string[] = rawUsed ? JSON.parse(rawUsed) : [];
    if (!usedList.includes(normalized)) {
      usedList.push(normalized);
      localStorage.setItem(STORAGE_KEYS.USED_KEYS_SET, JSON.stringify(usedList));
    }
  } catch (e) {
    console.error('Failed to bind key to device:', e);
  }
}

// Verify a Purchased Key with Device Recognition:
// - If already registered:
//    - Same device -> allow re-login!
//    - Different device -> block with explicit warning!
// - If new key -> allow activation and bind to this device!
export function verifyPurchasedKeyWithDevice(
  inputCode: string,
  currentDeviceId: string
): {
  status: 'admin' | 'new_activation' | 'same_device' | 'different_device_blocked' | 'invalid';
  normalizedCode: string;
  user?: User;
  boundDeviceId?: string;
  error?: string;
} {
  const normalized = normalizeKeyCode(inputCode);
  if (!normalized) return { status: 'invalid', normalizedCode: '' };

  // 1. Check Master Admin Key
  if (normalized === ADMIN_MASTER_KEY.toUpperCase()) {
    return { status: 'admin', normalizedCode: ADMIN_MASTER_KEY };
  }

  // 2. Check if key belongs to the 1,100 valid keys
  if (!VALID_KEYS_SET.has(normalized)) {
    return {
      status: 'invalid',
      normalizedCode: normalized,
      error: 'Código não encontrado no banco de 1.100 chaves de licença.',
    };
  }

  // 3. Check existing device binding
  const binding = getKeyDeviceBinding(normalized);
  if (binding) {
    if (binding.deviceId === currentDeviceId) {
      // SAME DEVICE! Recover session seamlessly
      return {
        status: 'same_device',
        normalizedCode: normalized,
        user: binding.user,
        boundDeviceId: binding.deviceId,
      };
    } else {
      // DIFFERENT DEVICE DETECTED!
      return {
        status: 'different_device_blocked',
        normalizedCode: normalized,
        boundDeviceId: binding.deviceId,
        error: 'Dispositivo não autorizado! Este código comprado já foi ativado em outro aparelho. Por segurança e termos da licença, o código comprado fica vinculado exclusivamente ao dispositivo original. Para acessar neste aparelho, utilize o seu Código de Acesso Direto com a Senha de Acesso configurada.',
      };
    }
  }

  // Check if previously marked as redeemed without device binding (legacy fallback)
  try {
    const rawUsed = localStorage.getItem(STORAGE_KEYS.USED_KEYS_SET);
    if (rawUsed) {
      const usedList: string[] = JSON.parse(rawUsed);
      if (usedList.includes(normalized)) {
        return {
          status: 'different_device_blocked',
          normalizedCode: normalized,
          error: 'Esta chave já foi resgatada anteriormente. Se for o titular, use seu Código de Acesso Direto com Senha para entrar.',
        };
      }
    }
  } catch (e) {
    // continue
  }

  // New valid activation!
  return {
    status: 'new_activation',
    normalizedCode: normalized,
  };
}

// Mark key as redeemed
export function markKeyAsUsed(code: string, userEmail: string): boolean {
  const normalized = normalizeKeyCode(code);
  if (normalized === ADMIN_MASTER_KEY.toUpperCase()) {
    return true; // admin key never expires
  }

  if (!VALID_KEYS_SET.has(normalized)) {
    return false;
  }

  try {
    const rawUsed = localStorage.getItem(STORAGE_KEYS.USED_KEYS_SET);
    const usedList: string[] = rawUsed ? JSON.parse(rawUsed) : [];
    if (!usedList.includes(normalized)) {
      usedList.push(normalized);
      localStorage.setItem(STORAGE_KEYS.USED_KEYS_SET, JSON.stringify(usedList));
    }
    return true;
  } catch (e) {
    console.error('Failed to mark key as used:', e);
    return false;
  }
}

// Reset an access key (Admin panel feature)
export function resetAccessKey(code: string): void {
  const normalized = normalizeKeyCode(code);
  try {
    const rawUsed = localStorage.getItem(STORAGE_KEYS.USED_KEYS_SET);
    if (rawUsed) {
      const usedList: string[] = JSON.parse(rawUsed);
      const filtered = usedList.filter(k => k !== normalized);
      localStorage.setItem(STORAGE_KEYS.USED_KEYS_SET, JSON.stringify(filtered));
    }
    const rawBindings = localStorage.getItem(STORAGE_KEYS.KEY_DEVICE_MAP);
    if (rawBindings) {
      const map = JSON.parse(rawBindings);
      delete map[normalized];
      localStorage.setItem(STORAGE_KEYS.KEY_DEVICE_MAP, JSON.stringify(map));
    }
  } catch (e) {
    console.error('Failed to reset key:', e);
  }
}

// Create fresh user profile bound to purchased key and device
export function createNewUserFromPurchasedKey(key: string, deviceId: string): User {
  const randomNum = Math.floor(100 + Math.random() * 900);
  const directCode = generateDirectAccessCode();
  const directPassword = generateRandomPassword();

  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: `Dev Coder #${randomNum}`,
    email: '',
    isGuest: false,
    isAdmin: false,
    directCode,
    directCodePassword: directPassword,
    originalKey: key,
    deviceId,
    registeredDeviceId: deviceId,
    avatar: '🚀',
    xp: 0,
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    gems: 100,
    hearts: 999,
    maxHearts: 999,
    completedLessons: [],
    completedModules: [],
    quizScores: {},
    currentModuleId: 'mod-1',
    selectedLanguageId: undefined, // user picks language first
    registeredAt: new Date().toISOString(),
    securityNumber: generateRandomSecurityNumber(),
  };

  bindKeyToDevice(key, deviceId, newUser);
  saveUser(newUser);
  return newUser;
}

// Helper to normalize direct code format (e.g. accepts 'k7x2-m9q4', 'DEV-PASS-K7X2-M9Q4', or 'K7X2 M9Q4')
export function normalizeDirectCode(input: string): string {
  if (!input) return '';
  const clean = input.trim().toUpperCase().replace(/\s+/g, '-');
  if (clean.startsWith('DEV-PASS-')) {
    return clean;
  }
  if (clean.startsWith('DEV-')) {
    return `DEV-PASS-${clean.replace('DEV-', '')}`;
  }
  return `DEV-PASS-${clean}`;
}

// Get all known direct codes saved on this device (for quick-fill hints)
export function getKnownDeviceDirectCodes(): { directCode: string; name: string; passwordHint: string; fullPassword: string }[] {
  const results: { directCode: string; name: string; passwordHint: string; fullPassword: string }[] = [];
  const seenCodes = new Set<string>();

  const addIfUnique = (u?: User | null) => {
    if (!u || !u.directCode) return;
    const clean = u.directCode.trim().toUpperCase();
    if (seenCodes.has(clean)) return;
    seenCodes.add(clean);
    const pass = (u.directCodePassword || u.password || '').trim();
    results.push({
      directCode: u.directCode,
      name: u.name || 'Estudante Dev',
      passwordHint: pass ? `${pass.substring(0, 3)}***` : 'Sem senha',
      fullPassword: pass,
    });
  };

  try {
    addIfUnique(getStoredUser());

    const mapRaw = localStorage.getItem(STORAGE_KEYS.DIRECT_CODES_MAP);
    if (mapRaw) {
      const map: Record<string, User> = JSON.parse(mapRaw);
      Object.values(map).forEach(addIfUnique);
    }

    const bindingsRaw = localStorage.getItem(STORAGE_KEYS.KEY_DEVICE_MAP);
    if (bindingsRaw) {
      const map: Record<string, { user: User }> = JSON.parse(bindingsRaw);
      Object.values(map).forEach(e => addIfUnique(e.user));
    }
  } catch (e) {
    // ignore
  }

  return results;
}

// Find user registered with directCode across all storage structures and formatting variations
export function findUserByDirectCode(code: string): User | null {
  const rawInput = (code || '').trim();
  if (!rawInput) return null;

  const upperInput = rawInput.toUpperCase();
  const normalizedInput = normalizeDirectCode(rawInput);
  const strippedInput = rawInput.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  // Admin bypass direct code check
  if (upperInput === 'DEV-PASS-ADMIN-MASTER' || upperInput === 'ADMIN' || strippedInput === 'DEVPASSADMINMASTER') {
    return {
      id: 'admin_master',
      name: 'Administrador Mestre',
      email: 'admin@devduo.local',
      isGuest: false,
      isAdmin: true,
      directCode: 'DEV-PASS-ADMIN-MASTER',
      directCodePassword: 'ADMIN',
      originalKey: ADMIN_MASTER_KEY,
      avatar: '👑',
      xp: 9999,
      streak: 99,
      lastActiveDate: new Date().toISOString().split('T')[0],
      gems: 9999,
      hearts: 999,
      maxHearts: 999,
      completedLessons: [],
      completedModules: [],
      quizScores: {},
      currentModuleId: 'mod-1',
      registeredAt: new Date().toISOString(),
    };
  }

  // Gather all unique users known to localStorage
  const candidateUsers: User[] = [];
  const seenUserIds = new Set<string>();

  const collectUser = (u?: User | null) => {
    if (!u || !u.id || seenUserIds.has(u.id)) return;
    seenUserIds.add(u.id);
    candidateUsers.push(u);
  };

  try {
    collectUser(getStoredUser());

    const mapRaw = localStorage.getItem(STORAGE_KEYS.DIRECT_CODES_MAP);
    if (mapRaw) {
      const map: Record<string, User> = JSON.parse(mapRaw);
      Object.values(map).forEach(collectUser);
    }

    const bindingsRaw = localStorage.getItem(STORAGE_KEYS.KEY_DEVICE_MAP);
    if (bindingsRaw) {
      const map: Record<string, { user: User }> = JSON.parse(bindingsRaw);
      Object.values(map).forEach(entry => collectUser(entry?.user));
    }
  } catch (e) {
    console.warn('Error reading stored candidates:', e);
  }

  // 1. Exact match on directCode
  for (const u of candidateUsers) {
    const uCode = (u.directCode || '').trim().toUpperCase();
    if (uCode && (uCode === upperInput || uCode === normalizedInput)) {
      return u;
    }
  }

  // 2. Alphanumeric stripped match (tolerant of extra/missing hyphens and spaces)
  for (const u of candidateUsers) {
    const uStripped = (u.directCode || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (uStripped && (uStripped === strippedInput || uStripped.endsWith(strippedInput) || strippedInput.endsWith(uStripped))) {
      return u;
    }
  }

  // 3. User might have entered their original purchased key in the direct code box!
  for (const u of candidateUsers) {
    const orig = (u.originalKey || '').trim().toUpperCase();
    if (orig && (orig === upperInput || orig === normalizeKeyCode(upperInput))) {
      return u;
    }
  }

  // 4. If only ONE registered user exists on this browser and the input looks like a direct code attempt
  if (candidateUsers.length === 1 && (upperInput.startsWith('DEV') || strippedInput.length >= 4)) {
    return candidateUsers[0];
  }

  return null;
}

// Verify Direct Code password with tolerance for case and prefix
export function verifyDirectCodePassword(user: User, passwordAttempt: string): { success: boolean; error?: string } {
  const cleanAttempt = (passwordAttempt || '').trim();
  const requiredPass = (user.directCodePassword || user.password || '').trim();

  // If user is Admin, 'ADMIN' or the set password is valid
  if (user.isAdmin) {
    if (!requiredPass || cleanAttempt.toUpperCase() === 'ADMIN' || cleanAttempt === requiredPass) {
      return { success: true };
    }
  }

  // If no password was ever set on this account, allow entry and register this password
  if (!requiredPass) {
    if (cleanAttempt) {
      user.directCodePassword = cleanAttempt;
      saveUser(user);
    }
    return { success: true };
  }

  // Exact comparison
  if (cleanAttempt === requiredPass) {
    return { success: true };
  }

  // Case-insensitive comparison
  if (cleanAttempt.toUpperCase() === requiredPass.toUpperCase()) {
    return { success: true };
  }

  // Strip 'PASS-' prefix if user entered just the numbers (e.g. entered '8392' for 'PASS-8392')
  const strippedRequired = requiredPass.replace(/^PASS-?/i, '');
  const strippedAttempt = cleanAttempt.replace(/^PASS-?/i, '');
  if (strippedRequired && strippedAttempt.toUpperCase() === strippedRequired.toUpperCase()) {
    return { success: true };
  }

  return {
    success: false,
    error: `Senha incorreta! Dica: a senha deste perfil começa com "${requiredPass.substring(0, Math.min(3, requiredPass.length))}...". Verifique a senha informada nas configurações ou use a chave comprada neste aparelho.`,
  };
}

// User persistence
export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored user:', e);
  }
  return null;
}

export function saveUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    // Update Direct Code map with multiple keys for resilient lookup
    const mapRaw = localStorage.getItem(STORAGE_KEYS.DIRECT_CODES_MAP);
    const map: Record<string, User> = mapRaw ? JSON.parse(mapRaw) : {};
    if (user.directCode) {
      const codeUpper = user.directCode.toUpperCase();
      map[codeUpper] = user;
      map[normalizeDirectCode(codeUpper)] = user;
      const stripped = codeUpper.replace(/[^A-Z0-9]/g, '');
      if (stripped) {
        map[stripped] = user;
      }
    }
    if (user.originalKey) {
      map[user.originalKey.toUpperCase()] = user;
    }
    localStorage.setItem(STORAGE_KEYS.DIRECT_CODES_MAP, JSON.stringify(map));

    // Also update KEY_DEVICE_MAP if user has an original key
    if (user.originalKey) {
      const bindingsRaw = localStorage.getItem(STORAGE_KEYS.KEY_DEVICE_MAP);
      const bindings = bindingsRaw ? JSON.parse(bindingsRaw) : {};
      const normKey = normalizeKeyCode(user.originalKey);
      if (bindings[normKey]) {
        bindings[normKey].user = user;
        localStorage.setItem(STORAGE_KEYS.KEY_DEVICE_MAP, JSON.stringify(bindings));
      }
    }
  } catch (e) {
    console.error('Failed to save user to localStorage:', e);
  }

  // Also sync asynchronously to Firestore in the background
  try {
    saveUserToFirestore(user).catch(err => {
      console.warn('Background Firestore sync notice:', err?.message || err);
    });
  } catch (e) {
    // Ignore offline sync errors
  }
}

export function removeStoredUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (e) {
    console.error('Failed to remove stored user:', e);
  }
}

// Sound setting
export function getIsMuted(): boolean {
  return localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === 'true';
}

export function setIsMuted(muted: boolean): void {
  localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, String(muted));
}

// Calculate streak based on daily activity
export function calculateStreak(
  lastActiveDate: string,
  currentStreak: number
): {
  streak: number;
  updatedDate: string;
} {
  const today = new Date().toISOString().split('T')[0];
  if (!lastActiveDate) {
    return { streak: 1, updatedDate: today };
  }

  if (lastActiveDate === today) {
    return { streak: currentStreak, updatedDate: today };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (lastActiveDate === yesterday) {
    return { streak: currentStreak + 1, updatedDate: today };
  }

  return { streak: 1, updatedDate: today };
}
