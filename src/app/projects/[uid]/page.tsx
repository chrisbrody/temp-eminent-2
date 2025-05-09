// app/featured/[uid]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

// 1. Define a clear type for your route parameters
type PageParams = {
    uid: string;
};

// 2. Define a clear type for the props your page component and generateMetadata will receive
interface PageProps {
    params: PageParams; // `params` is an object with a `uid` string
}

// 3. Use PageProps in generateMetadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const client = createClient();
    // Access params.uid directly
    const page = await client.getByUID("featured_project", params.uid).catch(() => notFound());

    return {
        title: page.data.meta_title || (page.data.project_title ? asText(page.data.project_title) : "Featured Project"),
        description: page.data.meta_description || "",
        openGraph: {
            title: page.data.meta_title || (page.data.project_title ? asText(page.data.project_title) : "Featured Project"),
            images: page.data.meta_image?.url ? [{ url: page.data.meta_image.url }] : [],
        },
    };
}

// 4. Use PageProps in your Page Component
export default async function ProjectPage({ params }: PageProps) {
    const client = createClient();
    // Access params.uid directly
    const page = await client.getByUID("featured_project", params.uid).catch(() => notFound()); // Use your actual Custom Type API ID

    return (
        <article>
            <SliceZone slices={page.data.slices} components={components} />
        </article>
    );
}

// 5. Ensure generateStaticParams returns the correct shape
export async function generateStaticParams(): Promise<PageParams[]> {
    const client = createClient();
    const pages = await client.getAllByType("featured_project"); // Use your actual Custom Type API ID
    return pages.map((page) => ({
        uid: page.uid,
    }));
}