import React, { useState, useEffect } from 'react';
import { User } from './types';
import { COURSE_MODULES, CourseModule, Lesson } from './data/courseData';
import {
  getStoredUser,
  saveUser,
  removeStoredUser,
  calculateStreak,
} from './services/storageService';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserFromFirestore } from './firebase/userService';
import { ActivationScreen } from './components/access/ActivationScreen';
import { DuolingoHeader } from './components/header/DuolingoHeader';
import { LearningPath } from './components/path/LearningPath';
import { FullPageLesson } from './components/lesson/FullPageLesson';
import { SingleQuizModal } from './components/quiz/SingleQuizModal';
import { FullPageEditor } from './components/editor/FullPageEditor';
import { DuolingoBottomNav, NavTab } from './components/navigation/DuolingoBottomNav';
import { SettingsModal } from './components/settings/SettingsModal';
import { PWATutorialModal } from './components/pwa/PWATutorialModal';
import { LanguageSelectionScreen } from './components/language/LanguageSelectionScreen';
import { LanguageCompletedModal } from './components/language/LanguageCompletedModal';
import { useSoundEffects } from './hooks/useSoundEffects';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  // Current user state
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  // Active module when viewing lessons
  const [activeModule, setActiveModule] = useState<CourseModule | null>(() => {
    const stored = getStoredUser();
    if (stored?.selectedLanguageId) {
      return COURSE_MODULES.find(m => m.id === stored.selectedLanguageId) || COURSE_MODULES[0];
    }
    return null;
  });

  // Navigation tab state ('path' | 'languages' | 'editor' | 'settings')
  const [navTab, setNavTab] = useState<NavTab>('path');

  // Focused Lesson Modal state
  const [selectedLessonForModal, setSelectedLessonForModal] = useState<Lesson | null>(null);

  // Quiz Modal state
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Language track selection state
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [finishedModuleForModal, setFinishedModuleForModal] = useState<CourseModule | null>(null);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPWAGuideOpen, setIsPWAGuideOpen] = useState(false);

  // Audio effects
  const {
    muted: soundMuted,
    toggleMute,
    playSuccess,
    playError,
    playLessonComplete,
    playClick,
  } = useSoundEffects();

  // PWA install status and actions
  const { isInstallable, isInstalled, install: installPWA } = usePWAInstall();

  // Listen for Firebase Auth state changes and sync Firestore profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async fbUser => {
      if (fbUser) {
        try {
          const profile = await getUserFromFirestore(fbUser.uid);
          if (profile) {
            setUser(profile);
            saveUser(profile);
          }
        } catch (e) {
          console.warn('Could not sync initial Firestore profile:', e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Update streak on app mount if user exists
  useEffect(() => {
    if (user) {
      const { streak, updatedDate } = calculateStreak(user.lastActiveDate, user.streak);
      if (streak !== user.streak || updatedDate !== user.lastActiveDate) {
        const updated = { ...user, streak, lastActiveDate: updatedDate };
        setUser(updated);
        saveUser(updated);
      }
    }
  }, []);

  // 1. Admin Master Key Bypass (Acesso total)
  const handleAdminBypass = () => {
    playLessonComplete();
    const adminUser: User = {
      id: 'admin_master',
      name: 'Administrador Mestre',
      email: 'admin@devduo.local',
      isGuest: false,
      isAdmin: true,
      directCode: 'DEV-PASS-ADMIN-MASTER',
      directCodePassword: 'ADMIN',
      securityNumber: 88,
      originalKey: 'DEVDUO-ADMIN-MASTER-8899',
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
      selectedLanguageId: undefined, // prompt language selector
      registeredAt: new Date().toISOString(),
    };
    setUser(adminUser);
    saveUser(adminUser);
    setActiveModule(null);
    setIsLanguageSelectorOpen(true);
  };

  // 2. User authenticated via Purchased Key or Direct Access Code
  const handleLoginSuccess = (newUser: User) => {
    playSuccess();
    setUser(newUser);

    if (!newUser.selectedLanguageId) {
      setIsLanguageSelectorOpen(true);
    } else {
      const found = COURSE_MODULES.find(m => m.id === newUser.selectedLanguageId);
      if (found) setActiveModule(found);
    }
  };

  // 3. Select language track
  const handleSelectLanguage = (mod: CourseModule) => {
    playSuccess();
    if (!user) return;
    const updatedUser: User = {
      ...user,
      selectedLanguageId: mod.id,
      currentModuleId: mod.id,
    };
    setUser(updatedUser);
    saveUser(updatedUser);
    setActiveModule(mod);
    setIsLanguageSelectorOpen(false);
    setNavTab('path');
  };

  // 4. Logout / Switch user
  const handleLogout = () => {
    playClick();
    removeStoredUser();
    setUser(null);
    setActiveModule(null);
    setIsSettingsOpen(false);
    setIsLanguageSelectorOpen(false);
    setIsCompletedModalOpen(false);
    setSelectedLessonForModal(null);
    setIsQuizModalOpen(false);
    setNavTab('path');
  };

  // 5. Complete a lesson
  const handleLessonComplete = (lessonId: string, earnedXp: number) => {
    if (!user) return;
    const completedSet = new Set(user.completedLessons);
    const wasAlreadyDone = completedSet.has(lessonId);
    completedSet.add(lessonId);

    const updatedUser: User = {
      ...user,
      xp: wasAlreadyDone ? user.xp : user.xp + earnedXp,
      gems: wasAlreadyDone ? user.gems : user.gems + 10,
      completedLessons: Array.from(completedSet),
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    setUser(updatedUser);
    saveUser(updatedUser);
  };

  // 6. Complete a whole module / language track
  const handleModuleComplete = (modNum: number) => {
    if (!user) return;
    const moduleSet = new Set(user.completedModules);
    const wasAlreadyDone = moduleSet.has(modNum);
    moduleSet.add(modNum);

    const updatedUser: User = {
      ...user,
      xp: wasAlreadyDone ? user.xp : user.xp + 100,
      gems: wasAlreadyDone ? user.gems : user.gems + 50,
      completedModules: Array.from(moduleSet),
    };

    setUser(updatedUser);
    saveUser(updatedUser);

    const finishedMod = COURSE_MODULES.find(m => m.number === modNum) || activeModule;
    if (finishedMod) {
      setFinishedModuleForModal(finishedMod);
      setIsCompletedModalOpen(true);
    }
  };

  // 6.5. Advance to next language from celebration modal
  const handleChooseNextLanguage = () => {
    setIsCompletedModalOpen(false);
    setIsLanguageSelectorOpen(true);
  };

  // 7. Lose a heart on quiz error
  const handleHeartLost = () => {
    if (!user || user.isAdmin) return;
    const newHearts = Math.max(0, user.hearts - 1);
    const updatedUser: User = { ...user, hearts: newHearts };
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  // Current active module fallback
  const currentActiveModule =
    activeModule ||
    (user?.selectedLanguageId
      ? COURSE_MODULES.find(m => m.id === user.selectedLanguageId)
      : null) ||
    COURSE_MODULES[0];

  const selectedLessonIndex =
    currentActiveModule && selectedLessonForModal
      ? currentActiveModule.lessons.findIndex(l => l.id === selectedLessonForModal.id)
      : -1;

  // -------------------------------------------------------------
  // Render Step 1: Activation Screen (Purchased Key or Direct Access)
  // -------------------------------------------------------------
  if (!user) {
    return (
      <>
        <ActivationScreen
          onAdminBypass={handleAdminBypass}
          onLoginSuccess={handleLoginSuccess}
          onOpenPWAGuide={() => setIsPWAGuideOpen(true)}
        />
        <PWATutorialModal
          isOpen={isPWAGuideOpen}
          onClose={() => setIsPWAGuideOpen(false)}
          isInstallable={isInstallable}
          isInstalled={isInstalled}
          onDirectInstall={installPWA}
        />
      </>
    );
  }

  // -------------------------------------------------------------
  // Render Step 3: Language Selection Screen (First time or switching)
  // -------------------------------------------------------------
  if (user && (!user.selectedLanguageId || isLanguageSelectorOpen)) {
    return (
      <>
        <LanguageSelectionScreen
          modules={COURSE_MODULES}
          user={user}
          onSelectLanguage={handleSelectLanguage}
          onCancel={user.selectedLanguageId ? () => setIsLanguageSelectorOpen(false) : undefined}
          isMandatoryFirstChoice={!user.selectedLanguageId}
          justCompletedModule={finishedModuleForModal}
        />
        {finishedModuleForModal && (
          <LanguageCompletedModal
            isOpen={isCompletedModalOpen}
            module={finishedModuleForModal}
            onChooseNextLanguage={handleChooseNextLanguage}
            onReviewCurrent={() => setIsCompletedModalOpen(false)}
          />
        )}
      </>
    );
  }

  // -------------------------------------------------------------
  // Render Step 3.5: Full Page Lesson (Coddy-style interactive learning)
  // -------------------------------------------------------------
  if (user && currentActiveModule && selectedLessonForModal) {
    return (
      <FullPageLesson
        lesson={selectedLessonForModal}
        module={currentActiveModule}
        user={user}
        onClose={() => setSelectedLessonForModal(null)}
        onCompleteLesson={handleLessonComplete}
        hasNextLesson={
          selectedLessonIndex >= 0 &&
          selectedLessonIndex < currentActiveModule.lessons.length - 1
        }
        hasPrevLesson={selectedLessonIndex > 0}
        onNextLesson={() => {
          playClick();
          if (selectedLessonIndex < currentActiveModule.lessons.length - 1) {
            setSelectedLessonForModal(
              currentActiveModule.lessons[selectedLessonIndex + 1]
            );
          }
        }}
        onPrevLesson={() => {
          playClick();
          if (selectedLessonIndex > 0) {
            setSelectedLessonForModal(
              currentActiveModule.lessons[selectedLessonIndex - 1]
            );
          }
        }}
        playSuccessSound={playSuccess}
        playCompleteSound={playLessonComplete}
        playErrorSound={playError}
      />
    );
  }

  // -------------------------------------------------------------
  // Render Step 4: Main App (User has active session)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col antialiased">
      {/* Top sticky Duolingo Header (Compact and without tutor button) */}
      {user && (
        <DuolingoHeader
          user={user}
          activeModule={currentActiveModule}
          onOpenLanguageSelector={() => setIsLanguageSelectorOpen(true)}
          canSwitchLanguage={true}
          onOpenSettings={() => {
            playClick();
            setIsSettingsOpen(true);
          }}
          onOpenPWAGuide={() => {
            playClick();
            setIsPWAGuideOpen(true);
          }}
          isPWAInstalled={isInstalled}
          isPWAInstallable={isInstallable}
          onInstallPWA={installPWA}
          soundMuted={soundMuted}
          onToggleSound={toggleMute}
        />
      )}

      {/* Main Body: Path View OR Full-Page Code Editor */}
      <main className="flex-1 pb-24">
        {navTab === 'editor' ? (
          <FullPageEditor activeModule={currentActiveModule} />
        ) : (
          currentActiveModule && user && (
            <LearningPath
              module={currentActiveModule}
              user={user}
              onOpenLesson={lesson => {
                playClick();
                setSelectedLessonForModal(lesson);
              }}
              onOpenQuiz={() => {
                playClick();
                setIsQuizModalOpen(true);
              }}
              onOpenEditor={() => {
                playClick();
                setNavTab('editor');
              }}
              onOpenLanguageSelector={() => {
                playClick();
                setIsLanguageSelectorOpen(true);
              }}
              onModuleComplete={handleModuleComplete}
            />
          )
        )}
      </main>

      {/* Navigator Bar (Bottom Nav - 4 clean tabs) */}
      {user && (
        <DuolingoBottomNav
          activeTab={navTab}
          onTabChange={tab => {
            playClick();
            setNavTab(tab);
            if (tab === 'languages') {
              setIsLanguageSelectorOpen(true);
            } else if (tab === 'settings') {
              setIsSettingsOpen(true);
            }
          }}
          user={user}
          activeModule={currentActiveModule}
        />
      )}

      {/* Single Quiz Modal */}
      {currentActiveModule && user && (
        <SingleQuizModal
          isOpen={isQuizModalOpen}
          module={currentActiveModule}
          user={user}
          onClose={() => setIsQuizModalOpen(false)}
          onModuleComplete={handleModuleComplete}
          onHeartLost={handleHeartLost}
          playSuccessSound={playSuccess}
          playErrorSound={playError}
          playCompleteSound={playLessonComplete}
        />
      )}

      {/* Settings Modal */}
      {user && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => {
            setIsSettingsOpen(false);
            if (navTab === 'settings') setNavTab('path');
          }}
          user={user}
          onUserUpdate={updated => {
            setUser(updated);
            saveUser(updated);
          }}
          onLogout={handleLogout}
          onOpenPWAGuide={() => setIsPWAGuideOpen(true)}
          soundMuted={soundMuted}
          onToggleSound={toggleMute}
          isPWAInstalled={isInstalled}
        />
      )}

      {/* PWA Tutorial Guide Modal */}
      <PWATutorialModal
        isOpen={isPWAGuideOpen}
        onClose={() => setIsPWAGuideOpen(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        onDirectInstall={installPWA}
      />

      {/* Language Completion Celebration Modal */}
      {finishedModuleForModal && (
        <LanguageCompletedModal
          isOpen={isCompletedModalOpen}
          module={finishedModuleForModal}
          onChooseNextLanguage={handleChooseNextLanguage}
          onReviewCurrent={() => setIsCompletedModalOpen(false)}
        />
      )}
    </div>
  );
}
