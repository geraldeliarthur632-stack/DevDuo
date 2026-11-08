import React, { useState } from 'react';
import { User } from '../../types';
import {
  getStoredAccessKeys,
  resetAccessKey,
  saveUser,
  generateDirectAccessCode,
  generateRandomPassword,
  generateRandomSecurityNumber,
  getOrCreateDeviceId,
} from '../../services/storageService';
import { signOutUser } from '../../firebase/authService';
import { AccessKey } from '../../data/accessKeys';
import {
  X,
  Volume2,
  VolumeX,
  Smartphone,
  LogOut,
  Download,
  Search,
  Sparkles,
  KeyRound,
  Copy,
  Check,
  Edit3,
  Lock,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  AlertTriangle,
  User as UserIcon,
  GraduationCap,
  Hash,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUserUpdate: (updatedUser: User) => void;
  onLogout: () => void;
  onOpenPWAGuide: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  isPWAInstalled: boolean;
}

const AVATARS = ['🚀', '🦊', '🐱', '🦁', '🐼', '⚡', '💻', '🤖', '👾', '🎯'];

const COURSES = [
  { id: 'mod-1', name: 'HTML5 — Elemento por Elemento', icon: '📄' },
  { id: 'mod-2', name: 'CSS3 — Propriedade por Propriedade', icon: '🎨' },
  { id: 'mod-3', name: 'JavaScript — Comando por Comando', icon: '⚡' },
  { id: 'mod-4', name: 'Python — Comando por Comando', icon: '🐍' },
  { id: 'mod-5', name: 'SQL — Cláusula por Cláusula', icon: '🗄️' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
  onLogout,
  onOpenPWAGuide,
  soundMuted,
  onToggleSound,
  isPWAInstalled,
}) => {
  // Direct Code and Password state
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [newDirectCode, setNewDirectCode] = useState(user.directCode || '');
  const [directPassword, setDirectPassword] = useState(
    user.directCodePassword || user.password || generateRandomPassword()
  );

  // Security pattern number state (e.g. 13, 45, 46, etc.)
  const [securityNumber, setSecurityNumber] = useState<number>(user.securityNumber || 45);

  // Profile customization
  const [profileName, setProfileName] = useState(
    user.name && !user.name.startsWith('user_') ? user.name : ''
  );
  const [profileAvatar, setProfileAvatar] = useState(user.avatar || '🚀');

  // Selected Course
  const [selectedCourseId, setSelectedCourseId] = useState(
    user.selectedLanguageId || user.currentModuleId || 'mod-1'
  );

  // Feedback message
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Logout Confirmation Modal state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [copiedAllCredentials, setCopiedAllCredentials] = useState(false);

  // Admin state
  const [allKeys, setAllKeys] = useState<AccessKey[]>(() => getStoredAccessKeys());
  const [keySearch, setKeySearch] = useState('');

  if (!isOpen) return null;

  // Determine if essential configuration is pending
  const isNameDefaultOrEmpty =
    !user.name ||
    user.name.trim() === '' ||
    user.name.startsWith('Dev Coder #') ||
    user.name.startsWith('user_');
  const isCourseEmpty = !user.selectedLanguageId;
  const isPasswordEmpty = !user.directCodePassword || user.directCodePassword.trim() === '';
  const isSecurityNumberEmpty = !user.securityNumber;
  const hasPendingConfig = isNameDefaultOrEmpty || isCourseEmpty || isPasswordEmpty || isSecurityNumberEmpty;

  const currentCourseName =
    COURSES.find(c => c.id === (user.selectedLanguageId || selectedCourseId))?.name || 'HTML5 — Elemento por Elemento';

  // Copy Direct Code
  const handleCopyDirectCode = () => {
    navigator.clipboard.writeText(user.directCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy Password
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(user.directCodePassword || directPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  // Generate new random password
  const handleGenerateNewPassword = () => {
    const generated = generateRandomPassword();
    setDirectPassword(generated);
    const updated: User = {
      ...user,
      directCodePassword: generated,
    };
    saveUser(updated);
    onUserUpdate(updated);
    setFeedbackMsg({
      type: 'success',
      text: `Nova senha gerada: ${generated}! Salva e vinculada ao seu código direto.`,
    });
  };

  // Save Direct Code and Password changes
  const handleSaveDirectCode = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);
    const cleanCode = newDirectCode.trim().toUpperCase();
    const cleanPass = directPassword.trim();

    if (!cleanCode) {
      setFeedbackMsg({ type: 'error', text: 'O Código de Acesso Direto não pode ser vazio.' });
      return;
    }

    if (!cleanPass) {
      setFeedbackMsg({ type: 'error', text: 'A senha de acesso direto não pode ser vazia.' });
      return;
    }

    const updated: User = {
      ...user,
      directCode: cleanCode,
      directCodePassword: cleanPass,
      securityNumber: Number(securityNumber) || 45,
    };

    saveUser(updated);
    onUserUpdate(updated);
    setIsEditingCode(false);
    setFeedbackMsg({
      type: 'success',
      text: 'Código de Acesso Direto e senha atualizados com sucesso!',
    });
  };

  // Save Complete Settings (Name, Course, Password, Avatar, Security Number Pattern)
  const handleSaveCompleteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = profileName.trim();
    if (!cleanName) {
      setFeedbackMsg({ type: 'error', text: 'Por favor, digite o seu Nome de Aluno antes de salvar.' });
      return;
    }

    const cleanPass = directPassword.trim();
    if (!cleanPass) {
      setFeedbackMsg({ type: 'error', text: 'Por favor, defina a sua Senha de Acesso antes de salvar.' });
      return;
    }

    const finalSecurityNumber = Number(securityNumber) || 45;

    const updated: User = {
      ...user,
      name: cleanName,
      avatar: profileAvatar,
      selectedLanguageId: selectedCourseId,
      currentModuleId: selectedCourseId,
      directCodePassword: cleanPass,
      securityNumber: finalSecurityNumber,
    };

    saveUser(updated);
    onUserUpdate(updated);
    setFeedbackMsg({
      type: 'success',
      text: `Configurações salvas! Seu Número Padrão de Recuperação é o ${finalSecurityNumber}.`,
    });
  };

  // Copy all credentials at once before logout
  const handleCopyAllCredentials = () => {
    const text = `DevDuo - Meus Dados de Acesso:\nCódigo de Acesso Direto: ${user.directCode}\nSenha de Acesso: ${user.directCodePassword || directPassword}\nNúmero Padrão para Assinalar: ${user.securityNumber || securityNumber || 45}\nNome do Perfil: ${user.name}\nCurso Registrado: ${currentCourseName}\nChave Comprada: ${user.originalKey || 'DEVDUO-...'}\nAparelho: ${getOrCreateDeviceId()}`;
    navigator.clipboard.writeText(text);
    setCopiedAllCredentials(true);
    setTimeout(() => setCopiedAllCredentials(false), 2000);
  };

  // Final confirmation to sign out
  const handleConfirmSignOut = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('SignOut warning:', e);
    }
    setShowLogoutConfirm(false);
    onLogout();
  };

  // Reset a key (Admin)
  const handleAdminResetKey = (code: string) => {
    resetAccessKey(code);
    setAllKeys(getStoredAccessKeys());
  };

  const usedKeysCount = allKeys.filter(k => k.isUsed).length;
  const filteredKeys = allKeys.filter(k =>
    k.code.toLowerCase().includes(keySearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border-2 border-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 text-xl">
              {user.avatar || '🚀'}
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl tracking-tight leading-none">
                Configurações da Conta
              </h3>
              <p className="text-xs text-gray-300 font-medium mt-1">
                {user.name} • {user.isAdmin ? 'Administrador' : 'Aluno Oficial'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 text-gray-700">
          {/* Status Feedback Message */}
          {feedbackMsg && (
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 ${
                feedbackMsg.type === 'success'
                  ? 'bg-green-50 border-2 border-green-200 text-green-800'
                  : 'bg-red-50 border-2 border-red-200 text-red-700 animate-shake'
              }`}
            >
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* REQUIREMENT: IF USER HASN'T DEFINED NAME, COURSE, PASSWORD, OR PATTERN NUMBER, PROMPT THEM HERE */}
          {hasPendingConfig && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 text-amber-900 shadow-sm animate-pulse">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-left">
                <h4 className="font-black text-sm">Configuração Obrigatória Pendente</h4>
                <p className="text-xs text-amber-800">
                  Por favor, complete as informações essenciais abaixo para que você possa recuperar sua conta se esquecer seu código ou senha:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {isNameDefaultOrEmpty && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[11px] font-black">
                      1. Definir Nome de Aluno
                    </span>
                  )}
                  {isCourseEmpty && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[11px] font-black">
                      2. Definir Curso Atual
                    </span>
                  )}
                  {isPasswordEmpty && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[11px] font-black">
                      3. Definir Senha de Acesso
                    </span>
                  )}
                  {isSecurityNumberEmpty && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[11px] font-black">
                      4. Confirmar Número Padrão
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MAIN FORM: NAME, COURSE, PASSWORD, AND NUMBER PATTERN (TIPO 13, 45, 46) */}
          <form onSubmit={handleSaveCompleteSettings} className="p-5 bg-white rounded-2xl border-2 border-gray-200 shadow-xs space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#58cc02]" />
                <span>Dados Obrigatórios de Acesso e Recuperação</span>
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                Obrigatório
              </span>
            </div>

            {/* Field 1: Name and Avatar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  1. Nome de Aluno no Perfil:
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  placeholder="Ex: Carlos Silva ou seu apelido"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#58cc02]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Avatar:
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {AVATARS.map(av => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setProfileAvatar(av)}
                      className={`w-8 h-8 rounded-xl text-lg flex items-center justify-center transition ${
                        profileAvatar === av
                          ? 'bg-emerald-100 border-2 border-[#58cc02] scale-110 shadow-xs'
                          : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field 2: Course Selection */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                <span>2. Curso Principal em Andamento:</span>
              </label>
              <select
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#58cc02]"
              >
                {COURSES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 3: Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-gray-700 uppercase flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>3. Senha de Acesso do Código Direto:</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateNewPassword}
                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Gerar Nova Senha</span>
                </button>
              </div>
              <input
                type="text"
                value={directPassword}
                onChange={e => setDirectPassword(e.target.value)}
                placeholder="Ex: PASS-8392 ou sua senha personalizada"
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 font-mono text-xs font-bold text-gray-900 focus:outline-none focus:border-[#58cc02]"
              />
            </div>

            {/* Field 4: NUMBER PATTERN FOR RECOVERY (TIPO 13, 45, 46, ETC) */}
            <div className="p-3.5 bg-blue-50/70 border-2 border-blue-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-blue-950 uppercase flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-blue-600" />
                  <span>4. Número Padrão de Recuperação (para assinalar):</span>
                </label>
                <button
                  type="button"
                  onClick={() => setSecurityNumber(generateRandomSecurityNumber())}
                  className="text-[10px] font-bold text-blue-700 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Sortear Outro</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="px-4 py-2 bg-blue-600 text-white border-2 border-blue-700 rounded-xl font-mono text-xl font-black shadow-xs">
                  {securityNumber}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[13, 45, 46, 78, 92].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setSecurityNumber(n)}
                      className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition ${
                        securityNumber === n
                          ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                          : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-300'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-blue-900/80 leading-relaxed">
                Este é o número que aparecerá para você assinalar na tela de login se você esquecer sua senha (como 13, 45, 46, etc.).
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#58cc02] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_3px_0_#46a302] hover:brightness-105 active:translate-y-0.5 active:shadow-none transition flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Nome, Curso, Senha e Número Padrão</span>
            </button>
          </form>

          {/* SECTION: CÓDIGO DE ACESSO DIRETO */}
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <h4 className="font-black text-sm text-emerald-950 uppercase tracking-wider">
                  Código de Acesso Direto
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-black uppercase">
                Acesso em Qualquer Aparelho
              </span>
            </div>

            <p className="text-xs text-emerald-900/80 font-medium leading-relaxed">
              Use este código acompanhado da sua senha ou do número padrão para acessar sua conta em qualquer computador ou celular.
            </p>

            {/* Display / Copy box for Code */}
            <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                    Código de Acesso Direto:
                  </span>
                  <code className="font-mono font-black text-base text-emerald-700">
                    {user.directCode}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyDirectCode}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1 shadow-xs"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copiado!' : 'Copiar Código'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingCode(!isEditingCode)}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingCode ? 'Fechar Edição' : 'Personalizar'}</span>
                  </button>
                </div>
              </div>

              {/* Password row with copy button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                    Sua Senha Atual:
                  </span>
                  <code className="font-mono font-black text-base text-indigo-700">
                    {user.directCodePassword || directPassword}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1 shadow-xs"
                  >
                    {copiedPassword ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPassword ? 'Copiada!' : 'Copiar Senha'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Direct Code Form */}
            {isEditingCode && (
              <form onSubmit={handleSaveDirectCode} className="p-4 bg-white/95 rounded-2xl border border-emerald-300 space-y-3 mt-2">
                <h5 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  Personalizar Código Direto Manualmente
                </h5>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                    Novo Código Direto:
                  </label>
                  <input
                    type="text"
                    value={newDirectCode}
                    onChange={e => setNewDirectCode(e.target.value.toUpperCase())}
                    placeholder="EX: DEV-PASS-MEU-CODIGO"
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 font-mono text-xs uppercase font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setNewDirectCode(generateDirectAccessCode());
                    }}
                    className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Gerar Aleatório
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-black hover:bg-emerald-800 transition flex items-center gap-1 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Código</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* SECTION: STATUS DO DISPOSITIVO & CHAVE COMPRADA */}
          <div className="p-5 bg-white rounded-2xl border-2 border-gray-200 shadow-xs space-y-3 text-left">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Dispositivo & Licença Comprada</span>
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                Segurança
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                  Chave Comprada Vinculada:
                </span>
                <span className="font-mono font-bold text-gray-800">
                  {user.originalKey || 'DEVDUO-ADMIN-MASTER-8899'}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                  Status do Aparelho:
                </span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Vinculado a este dispositivo</span>
                </span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500">
              Identificador do aparelho: <span className="font-mono">{getOrCreateDeviceId()}</span>
            </p>
          </div>

          {/* SECTION: PREFERÊNCIAS (SOM E PWA) */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
              Preferências
            </h4>

            {/* Sound Toggle */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundMuted ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-[#58cc02]" />}
                <div>
                  <h5 className="text-xs font-bold text-gray-800">Efeitos Sonoros Interativos</h5>
                  <p className="text-[11px] text-gray-500">Sons de acerto, celebração e cliques</p>
                </div>
              </div>
              <button
                onClick={onToggleSound}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  soundMuted ? 'bg-gray-200 text-gray-600' : 'bg-[#58cc02] text-white shadow-xs'
                }`}
              >
                {soundMuted ? 'Mudo' : 'Ligado'}
              </button>
            </div>

            {/* PWA status */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-blue-500" />
                <div>
                  <h5 className="text-xs font-bold text-gray-800">Instalação PWA (App no Celular/PC)</h5>
                  <p className="text-[11px] text-gray-500">
                    {isPWAInstalled ? 'App instalado neste dispositivo' : 'Disponível para instalar na tela inicial'}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenPWAGuide}
                className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-white"
              >
                Tutorial
              </button>
            </div>
          </div>

          {/* SECTION: ADMIN PANEL (SE ADMIN) */}
          {user.isAdmin && (
            <div className="p-5 bg-purple-50 rounded-2xl border-2 border-purple-200 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👑</span>
                  <h4 className="font-black text-sm text-purple-950 uppercase tracking-wider">
                    Painel do Administrador (1.100 Chaves)
                  </h4>
                </div>
                <a
                  href="./chaves_de_acesso.txt"
                  download="chaves_de_acesso.txt"
                  className="px-3 py-1 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 flex items-center gap-1 shadow-xs transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar TXT</span>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-white rounded-xl border border-purple-100">
                  <span className="block text-xl font-black text-purple-700">{allKeys.length}</span>
                  <span className="text-[10px] font-bold text-gray-500">Total Chaves</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-purple-100">
                  <span className="block text-xl font-black text-green-600">
                    {allKeys.length - usedKeysCount}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500">Disponíveis</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-purple-100">
                  <span className="block text-xl font-black text-orange-600">{usedKeysCount}</span>
                  <span className="text-[10px] font-bold text-gray-500">Resgatadas</span>
                </div>
              </div>

              {/* Search Keys */}
              <div className="relative">
                <input
                  type="text"
                  value={keySearch}
                  onChange={e => setKeySearch(e.target.value)}
                  placeholder="Pesquisar entre as 1.100 chaves..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-xs font-mono bg-white focus:outline-none"
                />
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Keys list */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-white rounded-xl border border-purple-100 text-xs font-mono">
                {filteredKeys.slice(0, 40).map(k => (
                  <div
                    key={k.code}
                    className="flex items-center justify-between p-1.5 hover:bg-purple-50/50 rounded-lg"
                  >
                    <span className="font-bold text-gray-700">{k.code}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          k.isUsed
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {k.isUsed ? 'Resgatada' : 'Disponível'}
                      </span>
                      {k.isUsed && (
                        <button
                          onClick={() => handleAdminResetKey(k.code)}
                          title="Tornar disponível novamente"
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-purple-600"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: LOGOUT BUTTON */}
          <div className="pt-2">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full py-3 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 font-extrabold text-xs uppercase tracking-wider hover:bg-red-100 transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da Conta (Logout)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">DevDuo • Reconhecimento de Dispositivo Ativo</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-800 text-white text-xs font-black hover:bg-gray-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION WITH ALL REQUIRED PASSWORDS AND PATTERN NUMBER SHOWN BEFORE LEAVING */}
      {/* "e tbm aparece as senhas que precisa saber antes de sair" */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-2 border-gray-100 flex flex-col text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 leading-tight">
                  Senhas e Padrão que Você Precisa Saber Antes de Sair
                </h3>
                <span className="text-xs text-amber-700 font-bold">
                  Copie ou anote para recuperar sua conta facilmente!
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-700 space-y-2.5 mb-4">
              <p className="font-semibold text-gray-800">
                Seu progresso continuará salvo. Para entrar novamente ou em outro aparelho, você pode usar qualquer um destes métodos:
              </p>

              {/* Exact Credentials Required */}
              <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1.5 font-mono text-xs shadow-xs">
                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-sans text-[11px] font-bold">Código Direto:</span>
                  <span className="font-bold text-emerald-700">{user.directCode}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-sans text-[11px] font-bold">Senha de Acesso:</span>
                  <span className="font-bold text-indigo-700">{user.directCodePassword || directPassword}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-sans text-[11px] font-bold">Número Padrão (para assinalar):</span>
                  <span className="font-black text-blue-700 font-mono text-sm bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-300">
                    {user.securityNumber || securityNumber || 45}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-sans text-[11px] font-bold">Código Comprado:</span>
                  <span className="font-bold text-blue-700">{user.originalKey || 'DEVDUO-ADMIN-MASTER-8899'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-sans text-[11px] font-bold">Nome do Perfil:</span>
                  <span className="font-bold text-gray-800 font-sans">{user.name}</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 leading-relaxed">
                💡 <strong>Dica de recuperação:</strong> Se você esquecer a senha, basta clicar em <em>"Não sei a senha"</em> e assinalar o seu número padrão <strong>{user.securityNumber || securityNumber || 45}</strong>!
              </div>
            </div>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopyAllCredentials}
              className="w-full py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 text-xs font-bold transition flex items-center justify-center gap-1.5 mb-3"
            >
              {copiedAllCredentials ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Todas as senhas e dados copiados com sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span>Copiar Todas as Minhas Informações de Acesso</span>
                </>
              )}
            </button>

            {/* Modal action buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs transition"
              >
                Voltar para o App
              </button>
              <button
                type="button"
                onClick={handleConfirmSignOut}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sim, Sair da Conta</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
