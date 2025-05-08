// src/app/fonts.ts
import localFont from 'next/font/local';

// Haigrast Font
export const haigrast = localFont({
    src: [
        {
            path: '../fonts/Haigrast.woff2',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-haigrast',
    display: 'swap',
});

// Ivar Display Font (Typically for headings)
export const ivarDisplay = localFont({
    src: [
        {
            path: '../fonts/IvarDisplay-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-ivar-display',
    display: 'swap',
});

// Ivar Text Font (Typically for body copy)
export const ivarText = localFont({
    src: [
        {
            path: '../fonts/IvarText-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-ivar-text',
    display: 'swap',
});

// GT America Regular (Typically for menu items)
export const gtAmerica = localFont({
    src: [
        {
            path: '../fonts/GT-America-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-gt-america',
    display: 'swap',
});