// slices/NavLink/index.tsx
'use client';

import { PrismicNextLink } from "@prismicio/next";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import { usePathname } from 'next/navigation';

type NavLinkProps = {
    slice: Content.NavLinkSlice;
    toggleMobileMenu?: () => void; // Prop to close the main mobile menu
};

export function NavLink({ slice, toggleMobileMenu }: NavLinkProps) {
    const pathname = usePathname();
    const label = slice.primary.label;
    const link = slice.primary.link;

    if (!isFilled.keyText(label) || !isFilled.link(link)) {
        return null;
    }

    const linkUrl = isFilled.link(link) && link.link_type === 'Document' ? link.url : null;
    const isActive = linkUrl && pathname === linkUrl;

    // --- Class Definitions ---
    // Mobile-first base styles (apply on all screens, overridden by md)
    const mobileBaseLinkClasses = "flex items-center justify-center font-serif text-3xl uppercase py-2 hover:text-gold-500";

    // Mobile active/inactive colors (from image)
    const mobileActiveClasses = "text-gold-500 underline";
    const mobileInactiveClasses = "text-white";

    // Desktop base styles (apply on md and up)
    const desktopBaseLinkClasses = "md:font-semibold md:tracking-tight md:text-slate-800 md:text-base md:justify-start md:py-0 md:normal-case";

    // Desktop active/inactive colors (adjust text-blue-600 to your desired desktop active color)
    const desktopActiveClasses = "md:text-blue-600 md:underline";
    const desktopInactiveClasses = "md:text-slate-800";


    return (
        <li className={`nav-item`}>
            <PrismicNextLink
                field={link}
                className={`nav-link
                            // Mobile styles (apply first)
                            ${mobileBaseLinkClasses}
                            ${isActive ? mobileActiveClasses : mobileInactiveClasses}
                            // Desktop overrides (apply on md and up)
                            ${desktopBaseLinkClasses}
                            ${isActive ? desktopActiveClasses : desktopInactiveClasses}`}
                onClick={() => { // Close main mobile menu on link click
                    if (toggleMobileMenu) {
                        toggleMobileMenu();
                    }
                }}
            >
                {label}
            </PrismicNextLink>
        </li>
    );
}