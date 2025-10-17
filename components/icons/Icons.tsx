// FIX: Created missing file components/icons/Icons.tsx and added all required icons.
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

// FIX: Removed React.FC type to fix assignment errors.
const createIcon = (path: React.ReactNode) => (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {path}
  </svg>
);

export const HomeIcon = createIcon(<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>);
export const GamepadIcon = createIcon(<><line x1="6" x2="10" y1="12" y2="12" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="15" x2="15.01" y1="13" y2="13" /><line x1="18" x2="18.01" y1="11" y2="11" /><rect width="20" height="12" x="2" y="6" rx="2" /></>);
export const WrenchIcon = createIcon(<><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></>);
export const WalletIcon = createIcon(<><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></>);
export const KeyIcon = createIcon(<><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></>);
export const UserIcon = createIcon(<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>);
export const NexusIcon = createIcon(<><path d="M10.62 3.52a2 2 0 0 1 2.76 0l4.33 4.33a2 2 0 0 1 0 2.76l-4.33 4.33a2 2 0 0 1-2.76 0l-4.33-4.33a2 2 0 0 1 0-2.76z" /><path d="m10.62 14.86a2 2 0 0 1 2.76 0l4.33 4.33a2 2 0 0 1 0 2.76l-4.33 4.33a2 2 0 0 1-2.76 0l-4.33-4.33a2 2 0 0 1 0-2.76z" /></>);
// FIX: Removed React.FC type to fix assignment errors.
export const BtcIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.333 4.333H8.5c-.917 0-1.667.75-1.667 1.667v12c0 .916.75 1.667 1.667 1.667h7.833c.917 0 1.667-.75 1.667-1.667v-1.666h-1.666v-2.5h1.666v-5h-1.666V8.333h1.666V6c0-.917-.75-1.667-1.667-1.667zm-1.25 11.667h-2.916v2.5H9.75v-2.5H8.5v-2.5h1.25V12.25h2.417v1.25h1.416v2.5zm0-5H9.75v-2.5h4.833v2.5z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const SolIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.504 4h2.132l4.032 6.54L15.696 4h2.132l-6.168 8.016L18 20h-2.132l-4.032-6.54-4.028 6.54H5.688l6.168-8.016L5.504 4z" /></svg>);
export const OpenAIIcon = createIcon(<><path d="M10.32,18.33c0.41,0,0.82-0.03,1.22-0.09c0.41-0.06,0.8-0.16,1.19-0.28c0.39-0.12,0.76-0.28,1.1-0.47c0.35-0.19,0.66-0.4,0.95-0.65c0.29-0.25,0.53-0.52,0.71-0.83c0.18-0.31,0.28-0.64,0.28-1c0-0.41-0.13-0.78-0.38-1.11c-0.25-0.33-0.6-0.6-1.02-0.8c-0.42-0.2-0.9-0.34-1.44-0.41c-0.54-0.07-1.12-0.11-1.74-0.11c-0.4,0-0.79,0.02-1.17,0.06c-0.38,0.04-0.75,0.1-1.09,0.18c-0.34,0.08-0.67,0.18-0.98,0.31c-0.31,0.13-0.6,0.28-0.85,0.45c-0.25,0.17-0.45,0.37-0.61,0.6c-0.16,0.23-0.24,0.48-0.24,0.75c0,0.3,0.1,0.59,0.3,0.85c0.2,0.26,0.48,0.49,0.85,0.68c0.37,0.19,0.81,0.34,1.33,0.45c0.52,0.11,1.09,0.16,1.71,0.16c0.41,0,0.8-0.02,1.17-0.05c0.37-0.03,0.73-0.08,1.08-0.16c-0.08,0.43-0.26,0.82-0.53,1.15c-0.27,0.33-0.62,0.6-1.05,0.79c-0.43,0.19-0.93,0.32-1.5,0.39c-0.57,0.07-1.18,0.11-1.83,0.11c-0.9,0-1.74-0.14-2.52-0.41c-0.78-0.27-1.46-0.66-2.03-1.18c-0.57-0.52-1.02-1.15-1.34-1.89c-0.32-0.74-0.48-1.57-0.48-2.5c0-0.99,0.17-1.9,0.52-2.73c0.35-0.83,0.83-1.55,1.44-2.16c0.61-0.61,1.33-1.1,2.16-1.46c0.83-0.36,1.75-0.54,2.75-0.54c0.83,0,1.6,0.13,2.3,0.38c0.7,0.25,1.31,0.59,1.82,1.02c0.51,0.43,0.92,0.94,1.2,1.52c0.28,0.58,0.43,1.22,0.43,1.91c0,0.44-0.07,0.87-0.21,1.29c-0.14,0.42-0.35,0.82-0.63,1.18c-0.28,0.36-0.63,0.68-1.04,0.96c-0.41,0.28-0.89,0.5-1.43,0.66c-0.54,0.16-1.13,0.27-1.76,0.33c-0.63,0.06-1.28,0.09-1.94,0.09c-0.56,0-1.1-0.04-1.61-0.11c-0.51-0.07-1-0.18-1.46-0.33c-0.46-0.15-0.88-0.34-1.26-0.56c-0.38-0.22-0.7-0.49-0.96-0.79c-0.26-0.3-0.46-0.64-0.59-1.02c-0.13-0.38-0.19-0.78-0.19-1.2c0-0.46,0.12-0.89,0.36-1.28c0.24-0.39,0.57-0.73,1-1c0.43-0.27,0.93-0.49,1.49-0.64c0.56-0.15,1.17-0.23,1.83-0.23c0.53,0,1.04,0.04,1.51,0.11c0.47,0.07,0.92,0.18,1.34,0.32c0.06-0.51,0.03-1.02-0.08-1.52c-0.11-0.5-0.31-0.98-0.59-1.43c-0.28-0.45-0.64-0.84-1.06-1.16c-0.42-0.32-0.92-0.58-1.48-0.75c-0.56-0.17-1.17-0.26-1.83-0.26c-0.8,0-1.54,0.13-2.22,0.4c-0.68,0.27-1.28,0.63-1.78,1.08c-0.5,0.45-0.9,0.98-1.18,1.59c-0.28,0.61-0.42,1.29-0.42,2.02c0,0.66,0.1,1.29,0.3,1.87c0.2,0.58,0.49,1.1,0.87,1.55c0.38,0.45,0.83,0.83,1.35,1.14c0.52,0.31,1.1,0.54,1.73,0.7c0.63,0.16,1.3,0.24,2,0.24C9.42,18.44,9.87,18.4,10.32,18.33z" /></>);
export const ClaudeIcon = createIcon(<><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3.83,12.28a0.84,0.84,0,0,1-.63.22,1,1,0,0,1-.71-0.32,3.7,3.7,0,0,0-5,0,1,1,0,0,1-.71.32,0.84,0.84,0,0,1-.63-0.22A1,1,0,0,1,8,11.5a5.6,5.6,0,0,1,8,0,1,1,0,0,1-.17.78Z" /></>);
// FIX: Removed React.FC type to fix assignment errors.
export const GeminiIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.75 3.5a.75.75 0 00-1.5 0V9a.75.75 0 001.5 0V3.5z" /><path d="M7.03 7.03a.75.75 0 00-1.06-1.06l-3.89 3.89a.75.75 0 101.06 1.06l3.89-3.89z" /><path d="M3.5 12.75a.75.75 0 000-1.5H9a.75.75 0 000 1.5H3.5z" /><path d="M7.03 16.97a.75.75 0 00-1.06 1.06l3.89 3.89a.75.75 0 001.06-1.06l-3.89-3.89z" /><path d="M12 21.25a.75.75 0 00.75-.75V15a.75.75 0 00-1.5 0v5.5a.75.75 0 00.75.75z" /><path d="M16.97 16.97a.75.75 0 001.06 1.06l3.89-3.89a.75.75 0 00-1.06-1.06l-3.89 3.89z" /><path d="M21.25 12a.75.75 0 00-.75-.75H15a.75.75 0 000 1.5h5.5a.75.75 0 00.75-.75z" /><path d="M16.97 7.03a.75.75 0 001.06-1.06l-3.89-3.89a.75.75 0 00-1.06 1.06l3.89 3.89z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const EthIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.25 5.75 13.5z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const UsdcIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1.5-3.88h3.33v-1.1H12v-4.5h2.17v-1.1h-2.17V6.33H9.42v1.1h1.08v4.5H9.42v1.1h1.08z" /></svg>);
export const SparklesIcon = createIcon(<><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></>);
export const RadioIcon = createIcon(<><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" /><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" /><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" /><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" /></>);
export const MessageSquareIcon = createIcon(<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>);
export const MessageCircleIcon = createIcon(<><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></>);
// FIX: Removed React.FC type to fix assignment errors.
export const MetaIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-2.8-6.1c.3 1.7 1.4 2.8 3.1 2.8s2.8-1.1 3.1-2.8H9.2zm8-2.3c-.3-1.7-1.4-2.8-3.1-2.8S9.5 7.9 9.2 9.6H17.2z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const MistralIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-3.5-9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm3.5 3.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm3.5-3.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const CohereIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM9.5 17a1.5 1.5 0 01-3 0V7a1.5 1.5 0 013 0v10zm8 0a1.5 1.5 0 01-3 0V7a1.5 1.5 0 013 0v10z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const PerplexityIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="7" y="7" width="4" height="10"/><rect x="13" y="7" width="4" height="4"/><rect x="13" y="13" width="4" height="4"/></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const StabilityIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const MidjourneyIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12l-3-8-4 4-2-4-2 4-4-4-3 8 3 8 4-4 2 4 2-4 4 4 3-8z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const RunwayIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.31L19.44 8 12 11.69 4.56 8 12 4.31zM4 15.54V9l7 3.5v7.04L4 15.54zm9 4.04v-7.04L20 9v6.54l-7 4.04z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const ElevenLabsIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 9v6l5-3-5-3zm2-5C6.48 4 2 8.48 2 14s4.48 10 10 10 10-4.48 10-10S17.52 4 12 4zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const SunoIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm4.24-4.24l1.41 1.41-1.75 1.75-1.41-1.41 1.75-1.75zM6.35 17.65l1.41-1.41 1.75 1.75-1.41 1.41-1.75-1.75zM12 5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const UnityIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="m16.48 6.13-1.06 1.06-2.12-2.12-2.12 2.12-1.06-1.06L12 4.01l4.48 2.12zM7.52 6.13 12 8.25l4.48-2.12L12 4.01 7.52 6.13zM6.46 7.19l1.06 1.06 2.12-2.12-2.12-2.12-1.06 1.06L6.46 7.19zM21 10.75v2.5L12 18.5l-9-5.25v-2.5l9 5.25 9-5.25z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const UnrealIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><path d="M16.5 14.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-5 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM12 8c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const GodotIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-.28 0-.53.11-.71.29L3.29 10.29c-.18.18-.29.43-.29.71s.11.53.29.71l8 8c.18.18.43.29.71.29s.53-.11.71-.29l8-8c.18-.18.29-.43-.29-.71s-.11-.53-.29-.71l-8-8c-.18-.18-.43-.29-.71-.29zm0 2.83L17.17 10H6.83L12 4.83zM12 19.17L6.83 14h10.34L12 19.17z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const RobloxIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 2.5L12 6l-9.5-3.5L2.5 12l3.5 9.5 6-2 6 2 3.5-9.5-3.5-9.5z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const GameMakerIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 2H2v20h20V2zm-2 18H4V4h16v16zM6 16h12v-2H6v2zm0-4h12v-2H6v2zm0-4h12V6H6v2z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const RpgMakerIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3h-2v18h2V3zm4 4h-2v10h2V7zm-8 0H7v10h2V7zM4 11h2v2H4v-2zm14 0h2v2h-2v-2z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const LumberyardIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 8v8l9 6 9-6V8l-9-6zm-7 7.6l7-4.6 7 4.6v4.8l-7 4.6-7-4.6v-4.8z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const MaticIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="m14.545 7.917-2.553 4.417-2.527-4.417h-4.382l4.881 8.166 4.908-8.166z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const AdaIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 8v8l9 6 9-6V8l-9-6zm-.88 15.17h-2.24l-1.3-3.32h4.84l-1.3 3.32zm.88-5.87H6.52l2.6-6.66h5.76l2.6 6.66h-5.4z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const XrpIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.636 4.364L3 12.03l8.636 7.667 2.728-3.076-5.908-5.228 5.908-5.228-2.728-3.076zm.728 0l8.636 7.667-8.636 7.667-2.728-3.076 5.908-5.228-5.908-5.228 2.728-3.076z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const DogeIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><path d="M11 11v6h2v-6h-2zm0-4v2h2V7h-2z" /></svg>);
// FIX: Removed React.FC type to fix assignment errors.
export const AvaxIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l-10 17h20L12 2zm0 4.6L18.4 17H5.6L12 6.6z" /></svg>);
export const PlusIcon = createIcon(<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>);
export const NexusLogoIcon = createIcon(<><path d="M10.62 3.52a2 2 0 0 1 2.76 0l4.33 4.33a2 2 0 0 1 0 2.76l-4.33 4.33a2 2 0 0 1-2.76 0l-4.33-4.33a2 2 0 0 1 0-2.76z" /><path d="m10.62 14.86a2 2 0 0 1 2.76 0l4.33 4.33a2 2 0 0 1 0 2.76l-4.33 4.33a2 2 0 0 1-2.76 0l-4.33-4.33a2 2 0 0 1 0-2.76z" /></>);
export const SunIcon = createIcon(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>);
export const MoonIcon = createIcon(<><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></>);
export const ChevronDownIcon = createIcon(<><path d="m6 9 6 6 6-6" /></>);
export const PaintBrushIcon = createIcon(<><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></>);
export const SearchIcon = createIcon(<><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>);
export const XIcon = createIcon(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>);
// FIX: Removed React.FC type to fix assignment errors.
export const HeartIcon = ({ filled, ...props }: IconProps & { filled?: boolean }) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.5 12.572l-7.5 7.428l-7.5-7.428a5 5 0 1 1 7.5-6.566a5 5 0 1 1 7.5 6.572" /></svg>);
export const RepeatIcon = createIcon(<><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></>);
export const GiftIcon = createIcon(<><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5A2.5 2.5 0 0 1 12 5.5v0" /><path d="M16.5 8a2.5 2.5 0 0 0 0-5A2.5 2.5 0 0 0 12 5.5v0" /></>);
export const MoreHorizontalIcon = createIcon(<><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>);
// FIX: Removed React.FC type to fix assignment errors.
export const VerifiedIcon = (props: IconProps) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="#3b82f6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path fillRule="evenodd" d="M12.75 2.25a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V2.25zM5.536 6.29a.75.75 0 10-1.06 1.06l1.95 1.95a.75.75 0 001.06-1.06l-1.95-1.95zM17.414 7.35a.75.75 0 10-1.06-1.06l-1.95 1.95a.75.75 0 101.06 1.06l1.95-1.95zM2.25 12.75a.75.75 0 000-1.5H4.5a.75.75 0 000 1.5H2.25zM18.5 12a.75.75 0 000 1.5h2.25a.75.75 0 000-1.5H18.5zM6.29 17.414a.75.75 0 10-1.06-1.06l-1.95 1.95a.75.75 0 101.06 1.06l1.95-1.95zM18.475 16.354a.75.75 0 10-1.06-1.06l-1.95 1.95a.75.75 0 001.06 1.06l1.95-1.95zM12 18.5a.75.75 0 00.75-.75v-2.25a.75.75 0 00-1.5 0v2.25a.75.75 0 00.75.75zM12 1.5a10.5 10.5 0 100 21 10.5 10.5 0 000-21zM9.172 13.94a.75.75 0 011.06 0L12 15.707l1.768-1.767a.75.75 0 111.06 1.06l-2.25 2.25a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>);
export const UserPlusIcon = createIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></>);
export const UserCheckIcon = createIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></>);
export const SlashIcon = createIcon(<><line x1="5" y1="19" x2="19" y2="5" /><circle cx="12" cy="12" r="10" /></>);
export const SendIcon = createIcon(<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>);
export const CheckIcon = createIcon(<><polyline points="20 6 9 17 4 12" /></>);
export const CopyIcon = createIcon(<><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>);
export const ArrowUpRightIcon = createIcon(<><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></>);
export const PlusCircleIcon = createIcon(<><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></>);
export const DownloadIcon = createIcon(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>);
export const GlobeIcon = createIcon(<><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>);
export const ServerIcon = createIcon(<><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></>);
export const ArrowDownIcon = createIcon(<><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>);
export const SwapIcon = createIcon(<><path d="M21 6.5l-4-4-4 4" /><path d="M3 17.5l4 4 4-4" /><path d="M17 14.5v-11" /><path d="M7 9.5v11" /></>);
export const SettingsIcon = createIcon(<><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>);
export const CameraIcon = createIcon(<><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></>);
export const ImageIcon = createIcon(<><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></>);
export const FlagIcon = createIcon(<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>);
export const BarChartIcon = createIcon(<><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></>);
export const DollarSignIcon = createIcon(<><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>);
export const LightbulbIcon = createIcon(<><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 8a6 6 0 0 0-12 0c0 1 .3 2.2 1.5 3.5.8.8 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></>);
export const ZapIcon = createIcon(<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>);
export const CubeIcon = createIcon(<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>);
export const UsersIcon = createIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>);
export const BellIcon = createIcon(<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>);
export const ArrowDownLeftIcon = createIcon(<><path d="M17 7 7 17" /><path d="M17 17H7V7" /></>);
export const ClockIcon = createIcon(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>);
export const EyeIcon = createIcon(<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>);
export const EyeOffIcon = createIcon(<><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></>);
export const ArrowLeftIcon = createIcon(<><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>);
export const ArrowRightIcon = createIcon(<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>);
export const RefreshCwIcon = createIcon(<><path d="M3 2v6h6" /><path d="M21 12A9 9 0 0 0 6 5.3L3 8" /><path d="M21 22v-6h-6" /><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" /></>);
export const LockIcon = createIcon(<><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>);
export const TrendingUpIcon = createIcon(<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>);
export const ZapOffIcon = createIcon(<><line x1="2" y1="2" x2="22" y2="22" /><path d="M13 2l-3.5 4.5" /><path d="M15 8l-2 2.5" /><path d="M12 14l-2 3-1.5 2.5" /><path d="M3 14h6l-4 8" /><path d="M18 10h3l-4 8h-3" /></>);
export const VideoIcon = createIcon(<><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></>);
export const PhoneIcon = createIcon(<><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></>);
export const PaperclipIcon = createIcon(<><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></>);
export const MicIcon = createIcon(<><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>);
export const MicOffIcon = createIcon(<><line x1="2" y1="2" x2="22" y2="22" /><path d="M18.88 10.12A6.97 6.97 0 0 0 12 5a7 7 0 0 0-7 7v2" /><path d="M5 10v2a7 7 0 0 0 12 5" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>);
export const VideoOffIcon = createIcon(<><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" /><line x1="2" x2="22" y1="2" y2="22" /></>);
export const PhoneOffIcon = createIcon(<><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" /><line x1="22" y1="2" x2="2" y2="22" /></>);
export const PackageIcon = createIcon(<><path d="M16.5 9.4 7.55 4.24" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>);
export const FilterIcon = createIcon(<><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></>);
export const ShoppingCartIcon = createIcon(<><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>);
export const SaveIcon = createIcon(<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>);
export const Trash2Icon = createIcon(<><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>);
export const QrCodeIcon = createIcon(<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h7v7h-7z" /></>);

export default createIcon;