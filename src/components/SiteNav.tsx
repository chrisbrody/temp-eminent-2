// components/SiteNav.tsx
"use client";

import { createClient } from "@/prismicio";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicText, SliceZone } from "@prismicio/react";
import Link from "next/link";
import { useState, useEffect } from 'react';

import { components } from "@/slices";

import type { NavigationDocument, SettingsDocument } from '../../prismicio-types';

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

    // Effect to prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const logoImage = settingsData?.data.site_logo;
    const phoneNumber = settingsData?.data.phone_number;
    const address = settingsData?.data.address;
    const email = settingsData?.data.email;

    if (isLoading) {
        return (
            <header className="site-header bg-white shadow-md py-4">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                </div>
            </header>
        );
    }

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
                            <span className="text-2xl font-bold text-slate-800">Eminent Interior Design</span>
                        )}
                    </Link>
                    <p className="text-red-500">Navigation content not found in Prismic.</p>
                </div>
            </header>
        );
    }

    return (
        <div className="top-0 sticky z-40 bg-white">
            <header className="px-[20px] py-[15px] md:px-[50px] md:py-[24px]">
                <div className="font-serif text-black flex justify-between items-stretch text-black-900 text-base">

                    {/* Mobile Menu Button (Hamburger) - Visible only on small screens, positioned left */}
                    <button
                        className="md:hidden p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 flex items-center w-1/2"
                        onClick={toggleMobileMenu}
                        aria-label="Open navigation"
                    >
                        {/* Hamburger SVG */}
                        <svg width="36" height="15" viewBox="0 0 36 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer">
                            <rect width="36" height="1" fill="#34342E"></rect>
                            <rect y="14" width="36" height="1" fill="#34342E"></rect>
                            <rect y="7" width="24" height="1" fill="#34342E"></rect>
                        </svg>
                    </button>

                    {/* Desktop Navigation */}
                    <nav className={`main-nav w-1/2 hidden md:flex md:items-center`}> {/* Added hidden md:flex */}
                        <ul className="flex flex-col md:flex-row gap-4 md:gap-10 mt-4 md:mt-0">
                            <SliceZone slices={navigationData.data.slices} components={components} />
                        </ul>
                    </nav>

                    {/* Logo */}
                    <div>
                        <PrismicNextLink
                            href="/"
                            className="text-xl font-semibold tracking-tight"
                        >
                            {logoImage && logoImage.url ? (
                                <PrismicNextImage
                                    field={logoImage}
                                    width={175}
                                    height={75}
                                />
                            ) : (
                                <PrismicText field={settingsData?.data.siteTitle}/>
                            )}
                        </PrismicNextLink>
                    </div>


                    {/* Empty div to push logo to center on desktop, or for other right-side elements */}
                    <div className="flex flex-col items-end justify-center w-1/2"></div>


                    {/* Full-screen Mobile Menu (Overlay) */}
                    {/* Backdrop */}
                    {isMobileMenuOpen && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                            onClick={toggleMobileMenu}
                        ></div>
                    )}

                    {/* Mobile Navigation Container */}
                    <div
                        className={`fixed top-0 right-0 h-full w-full bg-[#34342E] text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden
                                    ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        <div className="p-6 flex flex-col h-full">
                            {/* Close Button (X icon) */}
                            <button
                                className="absolute top-6 left-6 p-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={toggleMobileMenu}
                                aria-label="Close navigation"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>

                            {/* Mobile Menu Logo */}
                            <div className="flex justify-center mt-12 mb-8">
                                <PrismicNextLink href="/" className="logo-link" onClick={toggleMobileMenu}>
                                    {logoImage && logoImage.url ? (
                                        <PrismicNextImage
                                            field={logoImage}
                                            width={144}
                                            height={75}
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold">Eminent Interior Design</span>
                                    )}
                                </PrismicNextLink>
                            </div>

                            {/* Mobile Navigation Links */}
                            <nav className="flex-grow overflow-y-auto">
                                <ul className="flex flex-col gap-6 text-center">
                                    <SliceZone slices={navigationData.data.slices} components={components} />
                                </ul>
                            </nav>

                            {/* Contact Info */}
                            <div className="mt-auto pt-8 text-center text-white text-lg space-y-2">
                                {phoneNumber && (
                                    <p className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.83 21 3 13.17 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.46.57 3.57.12.35.03.75-.24 1.02l-2.2 2.2z"/></svg>
                                        {phoneNumber}
                                    </p>
                                )}
                                {address && (
                                    <p className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>
                                        {address}
                                    </p>
                                )}
                                {email && (
                                    <p className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                                        {email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </header>
        </div>
    );
}