// app/blog/[uid]/page.tsx
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {asText, isFilled, asDate} from "@prismicio/client";
import {SliceZone} from "@prismicio/react";
import {cookies} from 'next/headers';
import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";

import {createClient} from "@/prismicio";
import {components} from "@/slices";
import type { BlogDocument, OwnerDocument } from '../../../../prismicio-types';

type PageParams = { uid: string };
interface PageProps { params: Promise<PageParams>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const { uid } = resolvedParams;
    const client = createClient({ cookies: await cookies() });

    const page = await client.getByUID("blog", uid)
        .catch(() => notFound());

    const pageTitleFromContent = isFilled.richText(page.data.blog_title) ? asText(page.data.blog_title) : "Blog Post";
    const seoTitle = page.data.meta_title || pageTitleFromContent;

    const pageDescriptionFromContent = isFilled.richText(page.data.blog_description) ? asText(page.data.blog_description) : "";
    const seoDescription = page.data.meta_description || pageDescriptionFromContent;

    let ogImages = [];
    if (isFilled.image(page.data.meta_image) && page.data.meta_image.url) {
        ogImages.push({ url: page.data.meta_image.url });
    } else if (isFilled.image(page.data.blog_image) && page.data.blog_image.url) {
        ogImages.push({ url: page.data.blog_image.url });
    }

    return {
        title: seoTitle,
        description: seoDescription,
        openGraph: {
            title: seoTitle,
            images: ogImages,
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const resolvedParams = await params;
    const { uid } = resolvedParams;
    const client = createClient({ cookies: await cookies() });
    const customTypeApiId = "blog";

    // console.log(`[BlogPostPage] Rendering for UID: "${uid}", Type: "${customTypeApiId}"`);

    try {
        const page = await client.getByUID<BlogDocument>(customTypeApiId, uid, {
            fetchLinks: [
                'owner.image',
                'owner.name',
                'owner.title',
            ]
        }).catch((e) => {
                console.error(`[BlogPostPage] client.getByUID for type "${customTypeApiId}" and UID "${uid}" threw an error or was not found:`, e.message);
                notFound();
                return null;
            });

        if (!page) {
            console.log(`[BlogPostPage] Page not found for UID "${uid}", Type: "${customTypeApiId}" (likely due to previous .catch).`);
            return notFound();
        }

        // console.log(`[BlogPostPage] Successfully fetched page data. Main title (blog_title): ${isFilled.richText(page.data.blog_title) ? asText(page.data.blog_title) : "Not Provided"}`);

        const { blog_title, blog_eyebrow, blog_date, blog_description } = page.data;

        const formattedDate = isFilled.date(blog_date)
            ? new Intl.DateTimeFormat("en-US", {
                timeZone: "UTC",
                year: "numeric",
                month: "long",
                day: "numeric",
            }).format(asDate(blog_date))
            : null;

        const ownerLink = page.data.owner;
        console.log(ownerLink)

        if (!ownerLink || !('data' in ownerLink) || !ownerLink.data) {
            return null;
        }

        const ownerData = ownerLink.data as OwnerDocument['data'];
        console.log(ownerData)

        const { name, title, image } = ownerData;

        console.log(name, title, image, formattedDate, blog_title, blog_eyebrow, blog_description)


        return (
            <article>
                <Link
                    href="/blog/"
                    className="back-button text-black-900 text-base md:text-base font-gtAmerica flex items-center underline mx-auto w-full max-w-[1200px] pt-10 pl-4"
                >
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
                    Back to Blog
                </Link>

                <SliceZone slices={page.data.slices} components={components} />

            </article>
        );
    } catch (error: any) {
        console.error(`[BlogPostPage] Unexpected error for UID "${uid}":`, error.message, error.stack);
        notFound();
    }
}

export async function generateStaticParams(): Promise<{ uid: string | null }[]> {
    const client = createClient();
    const customTypeApiId = "blog";

    // console.log(`Fetching documents of type "${customTypeApiId}" for generateStaticParams...`);
    const pages = await client.getAllByType(customTypeApiId);

    if (!pages || pages.length === 0) {
        // console.warn(`No documents found for type "${customTypeApiId}". generateStaticParams will return an empty array.`);
        return [];
    } else {
        // console.log("Fetched UIDs for 'blog' type:", pages.map(page => page.uid));
    }

    // console.log("generateStaticParams for 'blog' will return:", JSON.stringify(paramsToReturn, null, 2));

    return pages.map((page) => ({
        uid: page.uid,
    }));
}