// slices/NavDropdown/index.tsx
'use client';

import { PrismicNextLink } from "@prismicio/next";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Keep usePathname for active state

type NavDropdownProps = {
  slice: Content.NavDropdownSlice;
};

export function NavDropdown({ slice }: NavDropdownProps) {
  const pathname = usePathname();
  const parentLabel = slice.primary.label;
  const parentLink = slice.primary.link;
  const subLinks = slice.primary.sub_label;

  const [isOpen, setIsOpen] = useState(false);

  // Determine active state for parent dropdown
  const parentLinkUrl = isFilled.link(parentLink) && parentLink.link_type === 'Document' ? parentLink.url : null;
  const isParentActive = parentLinkUrl && pathname === parentLinkUrl;
  const isAnySubLinkActive = Array.isArray(subLinks) && subLinks.some(item => {
    const subLinkUrl = isFilled.link(item.sub_link) && item.sub_link.link_type === 'Document' ? item.sub_link.url : null;
    return subLinkUrl && pathname === subLinkUrl;
  });
  const isActiveDropdown = isParentActive || isAnySubLinkActive;

  // Define active and inactive classes for mobile (gold and underline)
  const mobileActiveClasses = "text-gold-500 underline";
  const mobileInactiveClasses = "text-white";

  // Define active/inactive classes for desktop (assuming text-slate-800 for inactive, and underline for active)
  // Adjust 'text-blue-600' to your desired desktop active color (e.g., 'text-gold-500')
  const desktopActiveClasses = "text-blue-600 underline";
  const desktopInactiveClasses = "text-slate-800";


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
                className={`nav-link dropdown-toggle flex items-center
                            // Base styles (mobile first, then overridden by md)
                            justify-center font-serif text-3xl uppercase py-2 hover:text-gold-500
                            ${isActiveDropdown ? mobileActiveClasses : mobileInactiveClasses}

                            // Desktop overrides (md: prefix)
                            md:font-semibold md:tracking-tight md:text-base md:justify-start md:py-0 md:normal-case md:no-underline md:hover:no-underline
                            ${isActiveDropdown ? desktopActiveClasses : desktopInactiveClasses}`} // Desktop active state
                onClick={() => setIsOpen(!isOpen)}
            >
              {parentLabel}
              <svg className={`ml-1 h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </PrismicNextLink>
        ) : (
            <span
                className={`nav-link dropdown-toggle flex items-center cursor-pointer
                            // Base styles (mobile first, then overridden by md)
                            justify-center font-serif text-3xl uppercase py-2 hover:text-gold-500
                            ${isActiveDropdown ? mobileActiveClasses : mobileInactiveClasses}

                            // Desktop overrides (md: prefix)
                            md:font-semibold md:tracking-tight md:text-base md:justify-start md:py-0 md:normal-case md:no-underline md:hover:no-underline
                            ${isActiveDropdown ? desktopActiveClasses : desktopInactiveClasses}`} // Desktop active state
                onClick={() => setIsOpen(!isOpen)}
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
                           // Desktop styles (from working desktop version):
                           md:absolute md:top-full md:left-0 md:bg-white md:shadow-lg md:rounded-md md:py-2 md:z-10 md:w-48
                           md:opacity-0 md:pointer-events-none md:transition-opacity md:duration-200 md:ease-in-out
                           md:group-hover:opacity-100 md:group-hover:pointer-events-auto
                           md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto
                           md:hidden md:group-hover:block md:group-focus-within:block

                           // Mobile styles (from working mobile version):
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
                                      // Base styles (mobile first, then overridden by md)
                                      text-center text-xl hover:text-gold-500
                                      ${isSubLinkActive ? mobileActiveClasses : mobileInactiveClasses}

                                      // Desktop overrides (md: prefix)
                                      md:text-base md:text-slate-700 md:hover:bg-gray-100 md:normal-case md:no-underline md:hover:no-underline
                                      ${isSubLinkActive ? desktopActiveClasses : desktopInactiveClasses}`} // Desktop active state
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