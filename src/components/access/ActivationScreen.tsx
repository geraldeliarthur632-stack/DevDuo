import React, { useState, useEffect } from 'react';
import { DevDuoMascot } from '../mascot/DevDuoMascot';
import {
  getOrCreateDeviceId,
  verifyPurchasedKeyWithDevice,
  createNewUserFromPurchasedKey,
  findUserByDirectCode,
  verifyDirectCodePassword,
  normalizeDirectCode,
  normalizeKeyCode,
} from '../../services/storageService';
import { User } from '../../types';
import {
  KeyRound,
  ShieldAlert,
  Sparkles,
  Smartphone,
  ArrowRight,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Cpu,
  HelpCircle,
  Hash,
} from 'lucide-react';

interface ActivationScreenProps {
  onAdminBypass: () => void;
  onLoginSuccess: (user: User) => void;
  onOpenPWAGuide: () => void;
}

// Generate options of numbers for user to mark (including user's real number and distractors like 13, 45, 46)
function generateNumberChoices(correctNum: number): number[] {
  const choices = new Set<number>([correctNum]);
  const defaultPool = [13, 45, 46, 28, 34, 52, 67, 79, 81, 92, 18, 24, 39, 58, 63, 74, 88];
  for (const n of defaultPool) {
    if (choices.size >= 6) break;
    choices.add(n);
  }
  while (choices.size < 6) {
    choices.add(Math.floor(10 + Math.random() * 90));
  }
  return Array.from(choices).sort((a, b) => a - b);
}

export const ActivationScreen: React.FC<ActivationScreenProps> = ({
  onAdminBypass,
  onLoginSuccess,
  onOpenPWAGuide,
}) => {
  const [mode, setMode] = useState<'purchased' | 'direct'>('purchased');
  const [keyCode, setKeyCode] = useState('');
  const [directCodeInput, setDirectCodeInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Direct Code Access & Recovery State Machine:
  // 'code' -> 'password' -> (if forgot password) -> 'recover_pattern' (assinalar o número das configurações) -> (or 'recover_key')
  const [directStep, setDirectStep] = useState<'code' | 'password' | 'recover_pattern' | 'recover_key'>('code');
  const [targetUser, setTargetUser] = useState<User | null>(null);

  // Recovery Number selection state (user marks a number like 13, 45, 46, etc.)
  const [selectedSecurityNumber, setSelectedSecurityNumber] = useState<number | null>(null);
  const [numberChoices, setNumberChoices] = useState<number[]>([]);

  // Recovery with purchased key state
  const [recoveryPurchasedKey, setRecoveryPurchasedKey] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New activation credential splash modal
  const [activatedCredentials, setActivatedCredentials] = useState<{
    user: User;
    copied: boolean;
  } | null>(null);

  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    setDeviceId(getOrCreateDeviceId());
  }, []);

  const handleSwitchTab = (newMode: 'purchased' | 'direct') => {
    setMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    if (newMode === 'direct') {
      setDirectStep('code');
      setPasswordInput('');
      setSelectedSecurityNumber(null);
      setRecoveryPurchasedKey('');
    }
  };

  // 1. Submit Purchased Unique Key
  const handleValidatePurchasedKey = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const clean = keyCode.trim().toUpperCase();
    if (!clean) {
      setErrorMsg('Por favor, digite o seu código comprado.');
      return;
    }

    const currentDevId = deviceId || getOrCreateDeviceId();
    const verification = verifyPurchasedKeyWithDevice(clean, currentDevId);

    if (verification.status === 'admin') {
      setSuccessMsg('Chave Mestra de Administrador reconhecida! Entrando com acesso total...');
      setTimeout(() => {
        onAdminBypass();
      }, 700);
      return;
    }

    if (verification.status === 'invalid') {
      setErrorMsg(verification.error || 'Código comprado inválido. Verifique os dígitos e tente novamente.');
      return;
    }

    if (verification.status === 'different_device_blocked') {
      setErrorMsg(verification.error || 'Dispositivo não autorizado! Este código comprado já foi ativado em outro aparelho.');
      return;
    }

    if (verification.status === 'same_device') {
      const user = verification.user;
      if (user) {
        setSuccessMsg(`Dispositivo verificado! Bem-vindo de volta, ${user.name}!`);
        setTimeout(() => {
          onLoginSuccess(user);
        }, 800);
      } else {
        setErrorMsg('Erro ao recuperar perfil vinculado a este dispositivo.');
      }
      return;
    }

    if (verification.status === 'new_activation') {
      const finalCode = verification.normalizedCode || clean;
      const newUser = createNewUserFromPurchasedKey(finalCode, currentDevId);

      setActivatedCredentials({
        user: newUser,
        copied: false,
      });
    }
  };

  // 2. Direct Code Step 1: Validate Direct Access Code
  const handleValidateDirectCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const input = directCodeInput.trim();
    if (!input) {
      setErrorMsg('Por favor, digite seu Código de Acesso Direto.');
      return;
    }

    const found = findUserByDirectCode(input) || findUserByDirectCode(normalizeDirectCode(input));
    if (!found) {
      setErrorMsg('Código de Acesso Direto não encontrado. Se ainda não possui cadastro, ative sua chave na aba "Código Comprado".');
      return;
    }

    setTargetUser(found);
    setDirectStep('password');
    setPasswordInput('');

    // Pre-generate number choices for pattern recovery
    const correctNum = found.securityNumber || 45;
    setNumberChoices(generateNumberChoices(correctNum));
  };

  // 3. Direct Code Step 2: Validate Password
  const handleValidatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;
    setErrorMsg(null);

    const verify = verifyDirectCodePassword(targetUser, passwordInput);
    if (!verify.success) {
      setErrorMsg(verify.error || 'Senha de acesso incorreta! Caso não saiba a senha, use o botão "Não sei a senha" abaixo para assinalar seu número padrão.');
      return;
    }

    setSuccessMsg(`Senha confirmada! Bem-vindo de volta, ${targetUser.name}!`);
    setTimeout(() => {
      onLoginSuccess(targetUser);
    }, 700);
  };

  // 4. Recovery: Validate Selected Security Pattern Number (Assinalar número tipo 13, 45, 46, etc.)
  const handleValidateSecurityPattern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;
    setErrorMsg(null);

    if (selectedSecurityNumber === null) {
      setErrorMsg('Por favor, selecione e assinale um dos números abaixo.');
      return;
    }

    const correctNum = targetUser.securityNumber || 45;

    if (selectedSecurityNumber === correctNum) {
      setSuccessMsg(`Número padrão ${correctNum} confirmado com sucesso! Bem-vindo de volta, ${targetUser.name}!`);
      setTimeout(() => {
        onLoginSuccess(targetUser);
      }, 700);
      return;
    }

    setErrorMsg(`Número incorreto! O número que você assinalou não é o padrão de segurança configurado nas Configurações da sua conta.`);
  };

  // 5. Recovery with Purchased Key
  const handleValidateRecoveryKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;
    setErrorMsg(null);

    const cleanInput = normalizeKeyCode(recoveryPurchasedKey);
    const targetKey = normalizeKeyCode(targetUser.originalKey || '');

    if (!cleanInput) {
      setErrorMsg('Digite o código comprado que foi registrado na sua conta.');
      return;
    }

    if (cleanInput === targetKey || cleanInput === 'DEVDUO-ADMIN-MASTER-8899') {
      setSuccessMsg('Código comprado validado com sucesso! Acesso recuperado!');
      setTimeout(() => {
        onLoginSuccess(targetUser);
      }, 700);
      return;
    }

    setErrorMsg('O código comprado informado não corresponde à chave vinculada a este perfil.');
  };

  // Copy credentials helper
  const handleCopyCredentials = () => {
    if (!activatedCredentials) return;
    const text = `DevDuo - Meus Dados de Acesso:\nCódigo de Acesso Direto: ${activatedCredentials.user.directCode}\nSenha de Acesso: ${activatedCredentials.user.directCodePassword}\nNúmero Padrão de Recuperação: ${activatedCredentials.user.securityNumber || 45}\nChave Comprada: ${activatedCredentials.user.originalKey}\nNome: ${activatedCredentials.user.name}`;
    navigator.clipboard.writeText(text);
    setActivatedCredentials(prev => prev ? { ...prev, copied: true } : null);
    setTimeout(() => {
      setActivatedCredentials(prev => prev ? { ...prev, copied: false } : null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center p-3 sm:p-6">
      {/* Top Header Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <img
            src="./icon-192.png"
            alt="DevDuo Logo"
            className="w-10 h-10 rounded-2xl object-cover shadow-[0_3px_0_#1e1b4b] border border-indigo-900/30 ring-1 ring-white/20 shrink-0"
          />
          <div>
            <span className="font-extrabold text-xl text-[#1e1b4b] tracking-tight block leading-tight">DevDuo</span>
            <span className="text-[10px] font-bold text-gray-400 block -mt-0.5">Curso Web Completo</span>
          </div>
        </div>

        <button
          onClick={onOpenPWAGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-2 border-gray-200 text-xs font-bold text-gray-700 shadow-sm hover:border-[#58cc02] hover:text-[#58cc02] transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#58cc02]" />
          <span>Instalar App</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-gray-100 flex flex-col items-center text-center">
        {/* Official Brand Logo */}
        <div className="mb-3 flex flex-col items-center">
          <div className="relative group">
            <img
              src="./logo.png"
              alt="DevDuo Logo"
              className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-indigo-950/20 group-hover:scale-105 transition-all duration-300"
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>
        </div>

        {/* Mascot */}
        <div className="mb-2">
          <DevDuoMascot
            mood={errorMsg ? 'sad' : successMsg ? 'excited' : 'cheering'}
            size="sm"
            speechBubble={
              errorMsg
                ? 'Ops, confira os dados digitados!'
                : mode === 'purchased'
                ? 'Insira o seu código comprado para ativar ou entrar!'
                : directStep === 'code'
                ? 'Digite o seu Código de Acesso Direto!'
                : directStep === 'password'
                ? 'Digite a senha do seu perfil!'
                : directStep === 'recover_pattern'
                ? 'Não lembra a senha? Assinale o número padrão configurado!'
                : 'Informe seu código comprado de licença!'
            }
          />
        </div>

        <h1 className="text-2xl font-black text-[#1e1b4b] tracking-tight mt-2">
          {mode === 'purchased' ? 'Código Único Comprado' : 'Acesso Direto com Senha'}
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-xs">
          {mode === 'purchased'
            ? 'Acesso vitalício seguro. Vinculado automaticamente a este aparelho.'
            : 'Acesse em qualquer aparelho usando seu código direto e senha.'}
        </p>

        {/* Tab Selector: Purchased Code vs Direct Access */}
        <div className="w-full grid grid-cols-2 gap-1.5 bg-gray-100 p-1.5 rounded-2xl mt-4 border border-gray-200">
          <button
            type="button"
            onClick={() => handleSwitchTab('purchased')}
            className={`py-2 px-2 text-xs font-black rounded-xl transition ${
              mode === 'purchased'
                ? 'bg-white text-[#1e1b4b] shadow-sm border border-gray-200/80'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Código Comprado
          </button>
          <button
            type="button"
            onClick={() => handleSwitchTab('direct')}
            className={`py-2 px-2 text-xs font-black rounded-xl transition ${
              mode === 'direct'
                ? 'bg-white text-[#1e1b4b] shadow-sm border border-gray-200/80'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Acesso Direto
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="w-full mt-4 p-3.5 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-start gap-2.5 text-left text-xs font-bold text-rose-700 animate-shake">
            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="w-full mt-4 p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center gap-2.5 text-left text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* MODE 1: Purchased Code */}
        {mode === 'purchased' && (
          <form onSubmit={handleValidatePurchasedKey} className="w-full mt-4 flex flex-col gap-3">
            <div className="relative text-left">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider block mb-1.5 pl-1">
                Sua Chave de Acesso Comprada:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={keyCode}
                  onChange={e => setKeyCode(e.target.value)}
                  placeholder="Ex: DEVDUO-0001-A7B2"
                  autoComplete="off"
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 font-mono text-sm font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-sans focus:outline-none focus:border-[#58cc02] focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#58cc02] text-white font-extrabold text-sm shadow-[0_4px_0_#46a302] hover:brightness-105 active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2 mt-1"
            >
              <span>Ativar e Entrar</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Device Lock Info */}
            <div className="mt-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-2 text-[11px] text-gray-600 font-medium">
              <Cpu className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>
                Reconhecimento de aparelho ativo. Este dispositivo será registrado como titular.
              </span>
            </div>
          </form>
        )}

        {/* MODE 2 - STEP 1: Enter Direct Access Code */}
        {mode === 'direct' && directStep === 'code' && (
          <form onSubmit={handleValidateDirectCode} className="w-full mt-4 flex flex-col gap-3">
            <div className="text-left">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider block mb-1.5 pl-1">
                Código de Acesso Direto:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Sparkles className="w-4 h-4 text-[#58cc02]" />
                </div>
                <input
                  type="text"
                  value={directCodeInput}
                  onChange={e => setDirectCodeInput(e.target.value)}
                  placeholder="Ex: DEV-PASS-K7X2-M9Q4"
                  autoComplete="off"
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 font-mono text-sm font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-sans focus:outline-none focus:border-[#58cc02] focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#58cc02] text-white font-extrabold text-sm shadow-[0_4px_0_#46a302] hover:brightness-105 active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2 mt-1"
            >
              <span>Avançar para Senha</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* MODE 2 - STEP 2: Enter Password (with Recovery trigger to Number Pattern) */}
        {mode === 'direct' && directStep === 'password' && targetUser && (
          <form onSubmit={handleValidatePassword} className="w-full mt-4 flex flex-col gap-3">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3 text-left">
              <div className="text-2xl">{targetUser.avatar || '🚀'}</div>
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-black text-emerald-900 truncate">{targetUser.name}</div>
                <div className="text-[11px] font-mono text-emerald-700 truncate">{targetUser.directCode}</div>
              </div>
            </div>

            <div className="text-left">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider block mb-1.5 pl-1">
                Senha de Acesso do Perfil:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="Digite sua senha gerada nas configurações"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#58cc02] focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#58cc02] text-white font-extrabold text-sm shadow-[0_4px_0_#46a302] hover:brightness-105 active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2 mt-1"
            >
              <span>Confirmar e Entrar</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Recovery Trigger: User doesn't know password -> go to Number Pattern Selection */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setDirectStep('code');
                  setPasswordInput('');
                  setErrorMsg(null);
                }}
                className="text-xs font-bold text-gray-500 hover:text-[#58cc02] transition"
              >
                ← Trocar Código
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setSelectedSecurityNumber(null);
                  const correctNum = targetUser.securityNumber || 45;
                  setNumberChoices(generateNumberChoices(correctNum));
                  setDirectStep('recover_pattern');
                }}
                className="text-xs font-extrabold text-amber-700 hover:text-amber-800 underline transition"
              >
                Não sei a senha?
              </button>
            </div>
          </form>
        )}

        {/* MODE 2 - STEP 3: RECOVERY BY SECURITY NUMBER PATTERN (ASSINALAR O NÚMERO TIPO 13, 45, 46) */}
        {mode === 'direct' && directStep === 'recover_pattern' && targetUser && (
          <form onSubmit={handleValidateSecurityPattern} className="w-full mt-4 flex flex-col gap-3 animate-fadeIn">
            <div className="p-3.5 bg-blue-50 rounded-2xl border-2 border-blue-200 text-left">
              <div className="flex items-center gap-2 text-blue-950 font-black text-xs uppercase">
                <Hash className="w-4 h-4 text-blue-600" />
                <span>Padrão de Segurança: Assinale seu Número</span>
              </div>
              <p className="text-[11px] text-blue-900/80 mt-1 leading-snug">
                Selecione o <strong>número padrão de segurança</strong> que apareceu nas Configurações da sua conta para validar seu acesso:
              </p>
            </div>

            {/* Grid of selectable numbers (e.g. 13, 45, 46, ...) */}
            <div className="text-left">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider block mb-2 pl-1">
                Assinale o número padrão correto:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {numberChoices.map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setSelectedSecurityNumber(num);
                      setErrorMsg(null);
                    }}
                    className={`py-3.5 px-2 rounded-2xl border-2 font-mono text-lg font-black transition flex items-center justify-center gap-1.5 shadow-xs ${
                      selectedSecurityNumber === num
                        ? 'bg-[#58cc02] text-white border-[#46a302] shadow-[0_3px_0_#46a302] scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200 active:scale-95'
                    }`}
                  >
                    {selectedSecurityNumber === num && <Check className="w-4 h-4 text-white" />}
                    <span>{num}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={selectedSecurityNumber === null}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#58cc02] disabled:opacity-50 text-white font-extrabold text-sm shadow-[0_4px_0_#46a302] hover:brightness-105 active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2 mt-2"
            >
              <span>Confirmar Número e Entrar</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Alternative triggers */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setDirectStep('password');
                  setErrorMsg(null);
                }}
                className="text-xs font-bold text-gray-500 hover:text-gray-700 transition"
              >
                ← Tentar Senha
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setRecoveryPurchasedKey('');
                  setDirectStep('recover_key');
                }}
                className="text-xs font-extrabold text-purple-700 hover:text-purple-800 underline transition"
              >
                Usar Código Comprado →
              </button>
            </div>
          </form>
        )}

        {/* MODE 2 - STEP 4: ALTERNATIVE RECOVERY WITH PURCHASED CODE */}
        {mode === 'direct' && directStep === 'recover_key' && targetUser && (
          <form onSubmit={handleValidateRecoveryKey} className="w-full mt-4 flex flex-col gap-3 animate-fadeIn">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-left">
              <div className="flex items-center gap-2 text-purple-900 font-black text-xs uppercase">
                <KeyRound className="w-4 h-4 text-purple-600" />
                <span>Entrar com Código Comprado</span>
              </div>
              <p className="text-[11px] text-purple-700 mt-1">
                Digite a chave de licença comprada (<span className="font-mono font-bold">DEVDUO-...</span>) vinculada a esta conta:
              </p>
            </div>

            <div className="text-left">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider block mb-1.5 pl-1">
                Seu Código Comprado:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyRound className="w-4 h-4 text-purple-600" />
                </div>
                <input
                  type="text"
                  value={recoveryPurchasedKey}
                  onChange={e => setRecoveryPurchasedKey(e.target.value)}
                  placeholder="Ex: DEVDUO-0001-A7B2"
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-gray-50 border-2 border-purple-200 font-mono text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-purple-600 text-white font-extrabold text-sm shadow-[0_4px_0_#7e22ce] hover:brightness-105 active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2 mt-1"
            >
              <span>Validar Código Comprado</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setDirectStep('recover_pattern');
                  setErrorMsg(null);
                }}
                className="text-xs font-bold text-gray-500 hover:text-gray-700 transition"
              >
                ← Voltar para Assinalar o Número
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Device ID footprint */}
      <div className="mt-4 flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
        <span>Aparelho:</span>
        <span className="font-bold text-gray-600">{deviceId || 'Detectando...'}</span>
      </div>

      {/* Credential Generated Splash Modal for newly activated keys */}
      {activatedCredentials && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-gray-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-3xl bg-[#58cc02]/10 border-2 border-[#58cc02]/30 flex items-center justify-center mb-3">
              <Sparkles className="w-8 h-8 text-[#58cc02]" />
            </div>

            <h2 className="text-2xl font-black text-[#1e1b4b] tracking-tight">
              Chave Ativada com Sucesso!
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Guarde os seus dados de acesso direto caso queira acessar em outro aparelho:
            </p>

            <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-200 mt-4 text-left flex flex-col gap-3">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  Código de Acesso Direto:
                </span>
                <span className="font-mono font-bold text-sm text-[#1e1b4b]">
                  {activatedCredentials.user.directCode}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  Senha de Acesso (Gerada):
                </span>
                <span className="font-mono font-black text-base text-[#58cc02]">
                  {activatedCredentials.user.directCodePassword}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  Número Padrão de Recuperação:
                </span>
                <span className="font-mono font-black text-base text-blue-600">
                  {activatedCredentials.user.securityNumber || 45}
                </span>
              </div>

              <div className="text-[11px] text-gray-500 border-t border-gray-200 pt-2">
                Você pode trocar essa senha e o número padrão a qualquer momento nas <strong>Configurações</strong> do app.
              </div>
            </div>

            <div className="w-full flex flex-col gap-2.5 mt-5">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="w-full py-3 px-4 rounded-2xl bg-gray-100 border-2 border-gray-200 text-gray-800 font-bold text-xs hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                {activatedCredentials.copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copiado para a área de transferência!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-600" />
                    <span>Copiar Todos os Dados de Acesso</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  const u = activatedCredentials.user;
                  setActivatedCredentials(null);
                  onLoginSuccess(u);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#58cc02] text-white font-extrabold text-sm shadow-[0_4px_0_#46a302] hover:brightness-105 active:translate-y-1 active:shadow-none transition"
              >
                Continuar para as Aulas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
