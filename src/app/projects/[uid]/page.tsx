// app/projects/[uid]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { cookies } from 'next/headers';

import { createClient } from "@/prismicio";
import { components } from "@/slices";

// Define a clear type for your route parameters
type PageParams = {
    uid: string;
};

// Define a clear type for the props your page component and generateMetadata will receive
interface PageProps {
    params: Promise<PageParams>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { uid } = await params;
    const client = createClient({ cookies: await cookies() });
    const page = await client.getByUID("featured_project", uid).catch(() => notFound());

    return {
        title: page.data.meta_title || (page.data.project_title ? asText(page.data.project_title) : "Featured Project"),
        description: page.data.meta_description || "",
        openGraph: {
            title: page.data.meta_title || (page.data.project_title ? asText(page.data.project_title) : "Featured Project"),
            images: page.data.meta_image?.url ? [{ url: page.data.meta_image.url }] : [],
        },
    };
}

// Use PageProps in your Page Component and await params
export default async function ProjectPage({ params }: PageProps) {
    const { uid } = await params;
    const client = createClient({ cookies: await cookies() });
    const page = await client.getByUID("featured_project", uid).catch(() => notFound());

    return (
        <article>
            <SliceZone slices={page.data.slices} components={components} />
        </article>
    );
}

// generateStaticParams returns the resolved shape, so this remains the same
export async function generateStaticParams(): Promise<PageParams[]> {
    const client = createClient();
    const pages = await client.getAllByType("featured_project");
    return pages.map((page) => ({
        uid: page.uid,
    }));
}