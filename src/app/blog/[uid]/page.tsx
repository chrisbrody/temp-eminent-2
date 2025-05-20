// app/blog/[uid]/page.tsx
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {asText, isFilled, asDate} from "@prismicio/client";
import {SliceZone, PrismicRichText} from "@prismicio/react";
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

        // console.log('pagedata:')
        // console.log(page.data)

        const { blog_title, blog_date, read_time, blog_tip_type } = page.data;

        // console.log(page.data)

        const formattedDate = isFilled.date(blog_date)
            ? new Intl.DateTimeFormat("en-US", {
                timeZone: "UTC",
                year: "numeric",
                month: "long",
                day: "numeric",
            }).format(asDate(blog_date))
            : null;

        // owner data
        const ownerLink = page.data.owner;
        if (!ownerLink || !('data' in ownerLink) || !ownerLink.data) {
            return null;
        }
        const ownerData = ownerLink.data as OwnerDocument['data'];
        const { name, title, image } = ownerData;

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

                <section className="blog-header-slice bg-white pt-6 md:pt-10 text-charcoal">
                    <div className="container mx-auto px-4 text-center">
                        {/* Blog Eyebrow */}
                        {isFilled.keyText(blog_tip_type) && (
                            <div className="mb-3 font-thin uppercase tracking-wider text-gold font-gtAmerica">
                                {blog_tip_type}
                            </div>
                        )}

                        {/* Blog Title */}
                        {isFilled.richText(blog_title) && (
                            <div className="text-3xl md:text-4xl uppercase font-bold font-serif font-thin mb-6 mx-auto max-w-[900px]">
                                <PrismicRichText field={blog_title} />
                            </div>
                        )}

                        {/* Project Meta: Date and Read Time */}
                        <div className="meta-info text-sm text-gray-700 flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-1 font-gtAmerica">
                            {/* Project Date */}
                            {formattedDate && (
                                <span className="inline-flex items-center">
                            <svg
                                width="20"
                                height="21"
                                viewBox="0 0 20 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.41797 1.33398C7.41797 0.919771 7.08218 0.583984 6.66797 0.583984C6.25376 0.583984 5.91797 0.919771 5.91797 1.33398V2.29737C5.70238 2.3194 5.50644 2.35178 5.32076 2.39937C3.64096 2.82988 2.32926 4.14158 1.89874 5.82138C1.74968 6.403 1.74981 7.08535 1.75001 8.15665L1.75003 8.27843V10.5007L1.75003 10.5496C1.75002 12.1518 1.75001 13.4212 1.86871 14.4254C1.99057 15.4564 2.24641 16.3051 2.82823 17.014C3.02561 17.2545 3.24615 17.4751 3.48666 17.6725C4.19561 18.2543 5.04431 18.5101 6.07528 18.632C7.0795 18.7507 8.34885 18.7507 9.95112 18.7507H10H10.0489C11.6512 18.7507 12.9206 18.7507 13.9248 18.632C14.9558 18.5101 15.8045 18.2543 16.5134 17.6725C16.7539 17.4751 16.9744 17.2545 17.1718 17.014C17.7536 16.3051 18.0095 15.4564 18.1313 14.4254C18.2501 13.4212 18.25 12.1519 18.25 10.5496V10.5496V10.5496V10.5496V10.5007V10.4517V10.4517V10.4517V10.4517C18.25 8.84945 18.2501 7.58011 18.1313 6.5759C18.0095 5.54493 17.7536 4.69623 17.1718 3.98728C16.9744 3.74677 16.7539 3.52623 16.5134 3.32885C15.8408 2.77688 15.0425 2.51831 14.082 2.38917V1.33398C14.082 0.919771 13.7462 0.583984 13.332 0.583984C12.9178 0.583984 12.582 0.919771 12.582 1.33398V2.27606C11.8472 2.25064 11.0077 2.25064 10.0489 2.25065L10 2.25065H7.77781L7.65603 2.25064L7.41797 2.25066V1.33398ZM12.582 3.83398V3.77687C11.8731 3.75112 11.0288 3.75065 10 3.75065H7.77781C7.64997 3.75065 7.53027 3.75071 7.41797 3.75093V3.83398C7.41797 4.2482 7.08218 4.58398 6.66797 4.58398C6.25376 4.58398 5.91797 4.2482 5.91797 3.83398V3.80752C5.83659 3.81971 5.76309 3.83448 5.69316 3.8524C4.54383 4.14697 3.64635 5.04445 3.35178 6.19378C3.25595 6.56771 3.25003 7.04408 3.25003 8.27843V10.5007C3.25003 12.1628 3.25126 13.3434 3.35834 14.2493C3.46346 15.1387 3.66161 15.665 3.98775 16.0624C4.1228 16.227 4.27369 16.3779 4.43825 16.5129C4.83566 16.8391 5.362 17.0372 6.25136 17.1423C7.15727 17.2494 8.33792 17.2507 10 17.2507C11.6621 17.2507 12.8428 17.2494 13.7487 17.1423C14.6381 17.0372 15.1644 16.8391 15.5618 16.5129C15.7264 16.3779 15.8773 16.227 16.0123 16.0624C16.3385 15.665 16.5366 15.1387 16.6417 14.2493C16.7488 13.3434 16.75 12.1628 16.75 10.5007C16.75 8.83854 16.7488 7.65789 16.6417 6.75198C16.5366 5.86262 16.3385 5.33628 16.0123 4.93887C15.8773 4.77431 15.7264 4.62342 15.5618 4.48837C15.2162 4.20477 14.7732 4.01796 14.0787 3.90492C14.043 4.28587 13.7223 4.58398 13.332 4.58398C12.9178 4.58398 12.582 4.2482 12.582 3.83398ZM5.83203 6.4173C5.41782 6.4173 5.08203 6.75308 5.08203 7.1673C5.08203 7.58151 5.41782 7.9173 5.83203 7.9173H14.1654C14.5796 7.9173 14.9154 7.58151 14.9154 7.1673C14.9154 6.75308 14.5796 6.4173 14.1654 6.4173H5.83203Z"
                                    fill="#34342e80"
                                />
                            </svg>

                            <span className="project-date text-black-900 text-base md:text-base opacity-50">
                              {formattedDate}
                            </span>
                        </span>
                            )}

                            {/* Project Read Time */}
                            {isFilled.number(read_time) && (
                                <span className="inline-flex items-center">
                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none"
                                         xmlns="http://www.w3.org/2000/svg" className="mr-2"><g opacity="0.5"><path
                                        fillRule="evenodd" clipRule="evenodd"
                                        d="M10 2.25C5.44365 2.25 1.75 5.94365 1.75 10.5C1.75 15.0563 5.44365 18.75 10 18.75C14.5563 18.75 18.25 15.0563 18.25 10.5C18.25 5.94365 14.5563 2.25 10 2.25ZM3.25 10.5C3.25 6.77208 6.27208 3.75 10 3.75C13.7279 3.75 16.75 6.77208 16.75 10.5C16.75 14.2279 13.7279 17.25 10 17.25C6.27208 17.25 3.25 14.2279 3.25 10.5ZM10.75 7.16667C10.75 6.75245 10.4142 6.41667 10 6.41667C9.58579 6.41667 9.25 6.75245 9.25 7.16667V10.5C9.25 10.7508 9.37533 10.9849 9.58397 11.124L12.084 12.7907C12.4286 13.0205 12.8943 12.9273 13.124 12.5827C13.3538 12.238 13.2607 11.7724 12.916 11.5426L10.75 10.0986V7.16667Z"
                                        fill="#34342E"></path></g></svg>

                                    <span className="project-location text-black-900 text-base md:text-base opacity-50">
                                        {read_time} Min Read
                                    </span>
                                </span>
                            )}
                        </div>

                    </div>
                </section>

                {/* Owner Info */}
                {isFilled.keyText(name) && (
                    <section className="text-center mt-8" id="project-owner">
                        {image?.url && (
                            <PrismicNextImage
                                field={image}
                                className="mx-auto rounded-full object-cover mb-4"
                                width={56}
                                height={56}
                                imgixParams={{ar: "1:1", fit: "crop"}}
                            />
                        )}
                        <h3 className="mt-3 capitalize text-base">{name}</h3>
                        <p className="mt-1 capitalize text-base md:text-base opacity-60">{title}</p>
                    </section>
                )}


                <SliceZone slices={page.data.slices} components={components}/>

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