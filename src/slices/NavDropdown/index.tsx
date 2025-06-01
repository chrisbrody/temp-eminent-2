// slices/NavDropdown/index.tsx
'use client';

import { PrismicNextLink } from "@prismicio/next";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Required for active state

type NavDropdownProps = {
  slice: Content.NavDropdownSlice;
  toggleMobileMenu?: () => void; // Prop to close the main mobile menu
};

export function NavDropdown({ slice, toggleMobileMenu }: NavDropdownProps) {
  const pathname = usePathname();
  const parentLabel = slice.primary.label;
  const parentLink = slice.primary.link;
  const subLinks = slice.primary.sub_label;

  const [isOpen, setIsOpen] = useState(false);

  // --- Active State Logic (from previous correct versions) ---
  const parentLinkUrl = isFilled.link(parentLink) && parentLink.link_type === 'Document' ? parentLink.url : null;
  const isParentActive = parentLinkUrl && pathname === parentLinkUrl;
  const isAnySubLinkActive = Array.isArray(subLinks) && subLinks.some(item => {
    const subLinkUrl = isFilled.link(item.sub_link) && item.sub_link.link_type === 'Document' ? item.sub_link.url : null;
    return subLinkUrl && pathname === subLinkUrl;
  });
  const isActiveDropdown = isParentActive || isAnySubLinkActive;

  // --- Class Definitions ---
  // Mobile-first base styles (apply on all screens, overridden by md)
  const mobileBaseLinkClasses = "flex items-center justify-center font-serif text-3xl uppercase py-2 hover:text-gold-500";
  const mobileBaseSubLinkClasses = "block px-4 py-2 text-center text-xl hover:text-gold-500";

  // Mobile active/inactive colors (from image)
  const mobileActiveClasses = "text-gold-500 underline";
  const mobileInactiveClasses = "text-white";

  // Desktop base styles (apply on md and up)
  const desktopBaseLinkClasses = "md:font-semibold md:tracking-tight md:text-slate-800 md:text-base md:justify-start md:py-0";
  const desktopBaseSubLinkClasses = "md:block md:px-4 md:py-2 md:text-slate-700 md:hover:bg-gray-100";

  // Desktop active/inactive colors (adjust text-blue-600 to your desired desktop active color)
  const desktopActiveClasses = "md:text-blue-600 md:underline";
  const desktopInactiveClasses = "md:text-slate-800";


  if (!isFilled.keyText(parentLabel)) {
    return null;
  }

  return (
      <li
          className={`nav-item nav-dropdown relative group`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
      >
        {/* Main Dropdown Link/Label */}
        {isFilled.link(parentLink) ? (
            <PrismicNextLink
                field={parentLink}
                className={`nav-link dropdown-toggle
                            // Mobile styles (apply first)
                            ${mobileBaseLinkClasses}
                            ${isActiveDropdown ? mobileActiveClasses : mobileInactiveClasses}
                            // Desktop overrides (apply on md and up)
                            ${desktopBaseLinkClasses}
                            ${isActiveDropdown ? desktopActiveClasses : desktopInactiveClasses}`}
                onClick={() => {
                  setIsOpen(!isOpen); // Toggle dropdown state
                  // If this is a direct link, close the main mobile menu
                  if (parentLinkUrl && toggleMobileMenu) {
                    toggleMobileMenu();
                  }
                }}
            >
              {parentLabel}
              <svg className={`ml-1 h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </PrismicNextLink>
        ) : (
            <span
                className={`nav-link dropdown-toggle cursor-pointer
                            // Mobile styles (apply first)
                            ${mobileBaseLinkClasses}
                            ${isActiveDropdown ? mobileActiveClasses : mobileInactiveClasses}
                            // Desktop overrides (apply on md and up)
                            ${desktopBaseLinkClasses}
                            ${isActiveDropdown ? desktopActiveClasses : desktopInactiveClasses}`}
                onClick={() => setIsOpen(!isOpen)} // Only toggle dropdown, no main menu close for non-links
            >
              {parentLabel}
              <svg className={`ml-1 h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
        )}

        {/* Dropdown Menu (Sub-links) */}
        {Array.isArray(subLinks) && subLinks.length > 0 && (
            <ul className={`dropdown-menu
                           // Desktop styles (from your working desktop version - UNCHANGED):
                           md:absolute md:top-full md:left-0 md:bg-white md:shadow-lg md:rounded-md md:py-2 md:z-10 md:w-48
                           md:opacity-0 md:pointer-events-none md:transition-opacity md:duration-200 md:ease-in-out
                           md:group-hover:opacity-100 md:group-hover:pointer-events-auto
                           md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto
                           md:hidden md:group-hover:block md:group-focus-within:block

                           // Mobile styles (from your working mobile version - UNCHANGED):
                           ${isOpen ? 'block' : 'hidden'}
                           w-full relative shadow-none rounded-none py-0 mt-2 md:mt-0
                           bg-[#34342E] text-white`}>
              {subLinks.map((item, index) => {
                const subLabel = item.sub_label;
                const subLink = item.sub_link;

                if (!isFilled.keyText(subLabel) || !isFilled.link(subLink)) {
                  return null;
                }

                const subLinkUrl = isFilled.link(subLink) && subLink.link_type === 'Document' ? subLink.url : null;
                const isSubLinkActive = subLinkUrl && pathname === subLinkUrl;

                return (
                    <li key={`sub-link-${index}`} className={`dropdown-item`}>
                      <PrismicNextLink
                          field={subLink}
                          className={`block px-4 py-2
                                      // Mobile styles (apply first)
                                      ${mobileBaseSubLinkClasses}
                                      ${isSubLinkActive ? mobileActiveClasses : mobileInactiveClasses}
                                      // Desktop overrides (apply on md and up)
                                      ${desktopBaseSubLinkClasses}
                                      ${isSubLinkActive ? desktopActiveClasses : desktopInactiveClasses}`}
                          onClick={() => { // Close main mobile menu on sub-link click
                            if (toggleMobileMenu) {
                              toggleMobileMenu();
                            }
                          }}
                      >
                        {subLabel}
                      </PrismicNextLink>
                    </li>
                );
              })}
            </ul>
        )}
      </li>
  );
}