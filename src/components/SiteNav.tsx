// components/SiteNav.tsx
"use client";

import { createClient } from "@/prismicio";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicText, SliceZone } from "@prismicio/react"; // Import SliceZone
import Link from "next/link";
import { useState, useEffect } from 'react';

// Import your slice components mapping
import { components } from "@/slices";

// Import your Prismic types
import type { NavigationDocument, SettingsDocument } from '../../prismicio-types';

// Helper function to fetch data (can be a separate server action/function if preferred)
async function getNavigationAndSettings() {
    const client = createClient();
    const navigation = await client.getSingle<NavigationDocument>("navigation");
    const settings = await client.getSingle<SettingsDocument>("settings");
    return { navigation, settings };
}

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [navigationData, setNavigationData] = useState<NavigationDocument | null>(null);
    const [settingsData, setSettingsData] = useState<SettingsDocument | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const { navigation, settings } = await getNavigationAndSettings();
            setNavigationData(navigation);
            setSettingsData(settings);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const logoImage = settingsData?.data.site_logo;

    if (isLoading) {
        return (
            <header className="site-header bg-white shadow-md py-4">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div> {/* Placeholder for logo */}
                    <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div> {/* Placeholder for hamburger */}
                </div>
            </header>
        );
    }

    // Handle case where navigation data might not be found
    if (!navigationData) {
        return (
            <header className="site-header bg-white shadow-md py-4">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <Link href="/" className="logo-link">
                        {logoImage && logoImage.url ? (
                            <PrismicNextImage
                                field={logoImage}
                                width={175}
                                height={75}
                            />
                        ) : (
                            <span className="text-2xl font-bold text-slate-800">Your Site Name</span>
                        )}
                    </Link>
                    <p className="text-red-500">Navigation content not found in Prismic.</p>
                </div>
            </header>
        );
    }

    console.log(navigationData)

    return (
        <div className="top-0 sticky z-40 bg-white">
            <header className="px-[50px] py-[24px] ">
                <div className="font-serif text-black flex justify-between items-stretch text-black-900 text-base">

                    {/* Mobile Menu Button (Hamburger) - Visible only on small screens */}
                    <button
                        className="md:hidden p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle navigation"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                    {/* Navigation Menu */}
                    <nav className={`main-nav w-1/2 md:flex md:items-center ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                        <ul className="flex flex-col md:flex-row gap-4 md:gap-10 mt-4 md:mt-0">
                            {/* THIS IS THE KEY CHANGE: Use SliceZone */}
                            <SliceZone slices={navigationData.data.slices} components={components} />
                        </ul>
                    </nav>

                    {/* Logo */}
                    <PrismicNextLink
                        href="/"
                        className="text-xl font-semibold tracking-tight"
                    >
                        {logoImage && logoImage.url ? (
                            <PrismicNextImage
                                field={logoImage}
                                width={175} // Adjust as needed
                                height={75} // Adjust as needed
                            />
                        ) : (
                            // Fallback for when no logo is set in Prismic
                            <PrismicText field={settingsData?.data.siteTitle}/> // Use settingsData
                        )}
                    </PrismicNextLink>

                    <div className="flex flex-col items-end justify-center w-1/2"></div>
                </div>
            </header>
        </div>
    );
}