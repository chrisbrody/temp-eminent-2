import "./globals.css";

import { Inter } from "next/font/google";
import { asText } from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
import { PrismicNextLink, PrismicPreview, PrismicNextImage } from "@prismicio/next";
import { Header } from "@/components/SiteNav";

import { createClient, repositoryName } from "@/prismicio";
import { Bounded } from "@/components/Bounded";

import {gtAmerica, haigrast, ivarDisplay, ivarText} from './fonts';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${haigrast.variable} ${ivarDisplay.variable} ${ivarText.variable} ${gtAmerica.variable} ${inter.variable}`}>
      <body className="overflow-x-hidden antialiased">
        <Header />
        {children}
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
