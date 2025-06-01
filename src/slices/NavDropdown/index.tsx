// slices/NavDropdown/index.tsx
'use client';

import { PrismicNextLink } from "@prismicio/next";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import { useState } from 'react';

type NavDropdownProps = {
  slice: Content.NavDropdownSlice;
};

export function NavDropdown({ slice }: NavDropdownProps) {
  const parentLabel = slice.primary.label;
  const parentLink = slice.primary.link;
  const subLinks = slice.primary.sub_label;

  const [isOpen, setIsOpen] = useState(false);

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
                className="nav-link dropdown-toggle flex items-center justify-center font-serif text-white text-3xl uppercase py-2 hover:text-gold-500 md:font-semibold md:tracking-tight md:text-slate-800 md:text-base"
                onClick={() => setIsOpen(!isOpen)}
            >
              {parentLabel}
              <svg className={`ml-1 h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </PrismicNextLink>
        ) : (
            <span
                className="nav-link dropdown-toggle flex items-center justify-center cursor-pointer font-serif text-white text-3xl uppercase py-2 hover:text-gold-500 md:font-semibold md:tracking-tight md:text-slate-800 md:text-base"
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
                           md:absolute md:top-full md:left-0 md:bg-white md:shadow-lg md:rounded-md md:py-2 md:z-10 md:w-48
                           md:opacity-0 md:pointer-events-none md:transition-opacity md:duration-200 md:ease-in-out
                           md:group-hover:opacity-100 md:group-hover:pointer-events-auto
                           md:group-focus-within:opacity-100 md:group-focus-within:pointer-events-auto
                           md:hidden md:group-hover:block md:group-focus-within:block

                           ${isOpen ? 'block' : 'hidden'}
                           w-full relative shadow-none rounded-none py-0 mt-2 md:mt-0
                           bg-[#34342E] text-white`}>
              {subLinks.map((item, index) => {
                const subLabel = item.sub_label;
                const subLink = item.sub_link;

                if (!isFilled.keyText(subLabel) || !isFilled.link(subLink)) {
                  return null;
                }

                return (
                    <li key={`sub-link-${index}`} className={`dropdown-item`}>
                      <PrismicNextLink field={subLink} className="block px-4 py-2 text-center text-white text-xl hover:text-gold-500">
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