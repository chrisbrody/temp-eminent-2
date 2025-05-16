// app/blog/[uid]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asText, isFilled } from "@prismicio/client";
import { SliceZone, PrismicRichText } from "@prismicio/react"; // Added PrismicRichText
import { cookies } from 'next/headers';
// import Link from "next/link";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

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

    console.log(`[BlogPostPage] Rendering for UID: "${uid}", Type: "${customTypeApiId}"`);

    try {
        const page = await client.getByUID(customTypeApiId, uid)
            .catch((e) => {
                console.error(`[BlogPostPage] client.getByUID for type "${customTypeApiId}" and UID "${uid}" threw an error or was not found:`, e.message);
                notFound();
                return null;
            });

        if (!page) {
            console.log(`[BlogPostPage] Page not found for UID "${uid}", Type: "${customTypeApiId}" (likely due to previous .catch).`);
            return notFound();
        }

        console.log(`[BlogPostPage] Successfully fetched page data. Main title (blog_title): ${isFilled.richText(page.data.blog_title) ? asText(page.data.blog_title) : "Not Provided"}`);

        const publicationDate = isFilled.date(page.data.blog_date)
            ? new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(page.data.blog_date))
            : null;

        return (
            <article className="py-8 md:py-12">
                <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
                    {isFilled.richText(page.data.blog_title) && (
                        <h1 className="text-3xl md:text-5xl font-ivar-display font-bold mb-4">
                            {/* Using asText for h1, assuming simple title */}
                            {asText(page.data.blog_title)}
                        </h1>
                    )}

                    {publicationDate && (
                        <p className="text-sm text-gray-500 mb-4">Published on {publicationDate}</p>
                    )}

                    {isFilled.image(page.data.blog_image) && page.data.blog_image.url && (
                        <img
                            src={page.data.blog_image.url}
                            alt={page.data.blog_image.alt || (isFilled.richText(page.data.blog_title) ? asText(page.data.blog_title) : "")}
                            className="w-full h-auto object-cover rounded-md mb-8"
                        />
                    )}

                    {/* For blog_description, if it's meant to be displayed with formatting: */}
                    {isFilled.richText(page.data.blog_description) && (
                        <div className="prose lg:prose-xl mb-8"> {/* Add basic prose styling or your own */}
                            <PrismicRichText field={page.data.blog_description} />
                        </div>
                    )}

                    <SliceZone slices={page.data.slices} components={components} />
                </div>
            </article>
        );
    } catch (error: any) {
        console.error(`[BlogPostPage] Unexpected error for UID "${uid}":`, error.message, error.stack);
        notFound();
    }
}

// generateStaticParams remains the same as it was already correct in its logic
// assuming it was correctly fetching UIDs for the "blog" type.
export async function generateStaticParams(): Promise<PageParams[]> {
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

    const paramsToReturn = pages.map((page) => ({
        uid: page.uid,
    }));

    // console.log("generateStaticParams for 'blog' will return:", JSON.stringify(paramsToReturn, null, 2));
    return paramsToReturn;
}