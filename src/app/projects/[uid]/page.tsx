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

    const page = await client.getByUID("featured_project", uid, {
        fetchLinks: [
            'owner.image',
            'owner.name',
            'owner.title',
        ],
    }).catch(() => notFound());

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
    const {uid} = await params;
    const client = createClient({cookies: await cookies()});

    const page = await client.getByUID("featured_project", uid, {
        fetchLinks: [
            'owner.image',
            'owner.name',
            'owner.title',
            'featured_project.project_title',
        ],
    }).catch(() => notFound());

    return (
        <>
            <article>
                <a className="back-button text-black-900 text-base md:text-base font-gtAmerica flex items-center underline mx-auto w-full max-w-[1200px] pt-10"
                   tabIndex="0" href="/projects/">
                    <svg
                        width="16"
                        height="14"
                        viewBox="0 0 16 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 md:mr-4"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.53033 0.46967C7.82322 0.762563 7.82322 1.23744 7.53033 1.53033L2.81066 6.25H15C15.4142 6.25 15.75 6.58579 15.75 7C15.75 7.41421 15.4142 7.75 15 7.75H2.81066L7.53033 12.4697C7.82322 12.7626 7.82322 13.2374 7.53033 13.5303C7.23744 13.8232 6.76256 13.8232 6.46967 13.5303L0.46967 7.53033C0.176777 7.23744 0.176777 6.76256 0.46967 6.46967L6.46967 0.46967C6.76256 0.176777 7.23744 0.176777 7.53033 0.46967Z"
                            fill="#34342E"
                        />
                    </svg>
                    Back to Projects
                </a>
                <SliceZone slices={page.data.slices} components={components}/>
            </article>
        </>


    )
        ;
}

// generateStaticParams returns the resolved shape, so this remains the same
export async function generateStaticParams(): Promise<PageParams[]> {
    const client = createClient();
    const pages = await client.getAllByType("featured_project");
    return pages.map((page) => ({
        uid: page.uid,
    }));
}