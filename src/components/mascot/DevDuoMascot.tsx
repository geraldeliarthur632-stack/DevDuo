import React from 'react';

export type MascotMood = 'cheering' | 'thinking' | 'proud' | 'sad' | 'excited' | 'waving';

interface DevDuoMascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  className?: string;
  animate?: boolean;
}

export const DevDuoMascot: React.FC<DevDuoMascotProps> = ({
  mood = 'cheering',
  size = 'md',
  speechBubble,
  className = '',
  animate = true,
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

  const animationClass = animate
    ? mood === 'cheering' || mood === 'excited'
      ? 'animate-bounce'
      : mood === 'thinking'
      ? 'animate-pulse'
      : ''
    : '';

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {speechBubble && (
        <div className="absolute -top-12 z-20 left-1/2 -translate-x-1/2 min-w-[170px] max-w-[290px] px-3.5 py-2 bg-white rounded-2xl shadow-lg border-2 border-indigo-100 text-xs md:text-sm font-extrabold text-indigo-950 text-center animate-fade-in pointer-events-none">
          {speechBubble}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-indigo-100 rotate-45" />
        </div>
      )}

      <div className={`${sizeMap[size]} ${animationClass} transition-transform`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="foxOrange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7a00" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="cyberIndigo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
            <linearGradient id="visorCyan" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Paws / Feet */}
          <ellipse cx="75" cy="180" rx="15" ry="9" fill="#312e81" />
          <ellipse cx="125" cy="180" rx="15" ry="9" fill="#312e81" />

          {/* Arms / Hands */}
          {mood === 'cheering' || mood === 'excited' ? (
            <>
              {/* Arms raised celebrating */}
              <path d="M 45 110 C 20 85, 20 50, 42 55 C 60 60, 58 95, 52 115" fill="url(#foxOrange)" />
              <circle cx="36" cy="54" r="8" fill="#ffedd5" />
              
              <path d="M 155 110 C 180 85, 180 50, 158 55 C 140 60, 142 95, 148 115" fill="url(#foxOrange)" />
              <circle cx="164" cy="54" r="8" fill="#ffedd5" />
            </>
          ) : mood === 'thinking' ? (
            <>
              {/* Hand on chin */}
              <path d="M 45 115 C 30 130, 32 155, 54 148 C 62 142, 60 125, 52 115" fill="url(#foxOrange)" />
              <path d="M 155 120 C 165 100, 140 75, 120 95 C 112 105, 138 125, 148 130" fill="url(#foxOrange)" />
              <circle cx="118" cy="98" r="7" fill="#ffedd5" />
            </>
          ) : (
            <>
              {/* Friendly paws */}
              <path d="M 42 115 C 28 130, 32 155, 54 145 C 62 140, 60 125, 50 115" fill="url(#foxOrange)" />
              <path d="M 158 115 C 172 130, 168 155, 146 145 C 138 140, 140 125, 150 115" fill="url(#foxOrange)" />
            </>
          )}

          {/* Ears (Pointed Fox / Robot Ears) */}
          <polygon points="56,30 38,82 78,70" fill="url(#foxOrange)" />
          <polygon points="56,42 45,78 72,70" fill="#312e81" />
          <polygon points="56,50 49,75 68,69" fill="#06b6d4" />

          <polygon points="144,30 162,82 122,70" fill="url(#foxOrange)" />
          <polygon points="144,42 155,78 128,70" fill="#312e81" />
          <polygon points="144,50 151,75 132,69" fill="#06b6d4" />

          {/* Head & Body */}
          <rect x="46" y="55" width="108" height="115" rx="42" fill="url(#foxOrange)" />

          {/* Cyber Vest / Scarf with Indigo Tech Gradient */}
          <path d="M 58 120 C 58 120, 100 135, 142 120 C 142 155, 126 168, 100 168 C 74 168, 58 155, 58 120 Z" fill="url(#cyberIndigo)" />

          {/* Code Badge on Vest: </> */}
          <rect x="76" y="132" width="48" height="22" rx="11" fill="#1e1b4b" stroke="#06b6d4" strokeWidth="2" />
          <text x="100" y="148" fill="#06b6d4" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            &lt;/&gt;
          </text>

          {/* Tech Headset Band across top */}
          <path d="M 52 75 C 52 48, 148 48, 148 75" fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" />
          {/* Headset Cushions */}
          <rect x="42" y="70" width="12" height="26" rx="6" fill="#312e81" stroke="#06b6d4" strokeWidth="2" />
          <rect x="146" y="70" width="12" height="26" rx="6" fill="#312e81" stroke="#06b6d4" strokeWidth="2" />

          {/* Cyber Visor / Smart Glasses */}
          <rect x="58" y="72" width="84" height="38" rx="16" fill="#1e1b4b" stroke="#06b6d4" strokeWidth="4" />

          {/* Eyes inside Visor based on mood */}
          {mood === 'sad' ? (
            <>
              {/* Drooping code eyes */}
              <text x="80" y="98" fill="#f87171" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                T_T
              </text>
              <text x="120" y="98" fill="#f87171" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                ;_;
              </text>
            </>
          ) : mood === 'thinking' ? (
            <>
              {/* Question / Thinking pixels */}
              <text x="80" y="97" fill="#facc15" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                ?
              </text>
              <text x="120" y="97" fill="#06b6d4" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                &gt;_
              </text>
            </>
          ) : (
            <>
              {/* Cheerful glowing code brackets < / > */}
              <text x="76" y="97" fill="#06b6d4" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                &lt;
              </text>
              <text x="100" y="96" fill="#facc15" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                /
              </text>
              <text x="124" y="97" fill="#06b6d4" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                &gt;
              </text>
            </>
          )}

          {/* Cute Nose */}
          <polygon points="100,113 94,119 106,119" fill="#1e1b4b" />
          {/* Smile under visor */}
          <path d="M 94 122 Q 100 126 106 122" fill="none" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};
