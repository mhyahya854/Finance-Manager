import React from 'react';

export const PlusIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const ChartPieIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
);

export const Cog6ToothIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.952l2.176.42a1.125 1.125 0 011.021 1.021l.42 2.176c.054.467-.17.92-.634 1.11l-2.177.953a1.125 1.125 0 01-1.02-1.02l-.42-2.176a1.125 1.125 0 01.42-1.11zM9.594 9.94c.09.542.56 1.007 1.11.952l2.176-.42a1.125 1.125 0 011.021 1.021l.42 2.176c.054.467-.17.92-.634 1.11l-2.177.953a1.125 1.125 0 01-1.02-1.02l-.42-2.176a1.125 1.125 0 01.42-1.11zM9.594 15.94c.09.542.56 1.007 1.11.952l2.176-.42a1.125 1.125 0 011.021 1.021l.42 2.176c.054.467-.17.92-.634 1.11l-2.177.953a1.125 1.125 0 01-1.02-1.02l-.42-2.176a1.125 1.125 0 01.42-1.11zM15 3.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0zM15 9.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0zM15 15.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0z" />
    </svg>
);

export const ListBulletIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

export const ArrowDownTrayIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const SunIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

export const MoonIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

export const RepeatIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001a.75.75 0 01.75.75c0 .414-.336.75-.75.75h-4.992v5.25c0 .414-.336.75-.75.75h-2.25a.75.75 0 01-.75-.75v-5.25H4.874c-.414 0-.75-.336-.75-.75v-.001c0-.414.336-.75.75-.75h4.992V4.5a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v4.848z" />
    </svg>
);

// Fix: Add style prop to icon components to allow dynamic styling (e.g., color).
export const FoodIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" /></svg>
);
// Fix: Add style prop to icon components to allow dynamic styling (e.g., color).
export const TransportIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13.5-8.5l1.96 2.5H17V9.5h2.5zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" /></svg>
);
// Fix: Add style prop to icon components to allow dynamic styling (e.g., color).
export const ShoppingIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" /></svg>
);
// Fix: Add style prop to icon components to allow dynamic styling (e.g., color).
export const BillsIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V6h14v12zM7 9h10v2H7zm0 4h10v2H7z" /></svg>
);
// Fix: Add style prop to icon components to allow dynamic styling (e.g., color).
export const EntertainmentIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" /></svg>
);
// Fix: Add style prop to icon components to allow dynamic styling (e.g., color).
export const HealthIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
);
// Fix: Add style prop to icon components to allow dynamic styling (e.g., color).
export const GroceriesIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" /></svg>
);
// Fix: Add style prop to icon components to allow dynamic styling (e.g., color).
export const OtherIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
);

export const RentIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
);
export const SubscriptionIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
);
export const UtilitiesIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>
);
export const TravelIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
);
export const EducationIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
);
export const PersonalCareIcon = ({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4L14.5,9.5L20,12L14.5,14.5L12,20L9.5,14.5L4,12L9.5,9.5L12,4Z" /></svg>
);


// Fix: Add style prop to icon components to allow dynamic styling (e.g., color). This resolves the original error.
export const QuestionMarkIcon = ({ className = "w-5 h-5", style }: { className?: string, style?: React.CSSProperties }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);

export const TransferIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
);

// Fix: Update type definition for icons to include style prop.
const icons: { [key: string]: React.FC<{ className?: string; style?: React.CSSProperties }> } = {
    FoodIcon,
    TransportIcon,
    ShoppingIcon,
    BillsIcon,
    EntertainmentIcon,
    HealthIcon,
    GroceriesIcon,
    OtherIcon,
    RentIcon,
    SubscriptionIcon,
    UtilitiesIcon,
    TravelIcon,
    EducationIcon,
    PersonalCareIcon,
};

// Fix: Pass style prop to IconComponent to enable dynamic coloring.
export const GetCategoryIcon: React.FC<{ iconName?: string; className?: string, style?: React.CSSProperties }> = ({ iconName, className = "w-5 h-5", style }) => {
    if (iconName && icons[iconName]) {
        const IconComponent = icons[iconName];
        return <IconComponent className={className} style={style} />;
    }
    return <QuestionMarkIcon className={className} style={style} />;
};