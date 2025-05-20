// app/projects/[uid]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {asDate, asText, isFilled} from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { cookies } from 'next/headers';
import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";

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
        title: page.data.meta_title || page.data.project_title || "Featured Project",
        description: page.data.meta_description || "",
        openGraph: {
            title: page.data.meta_title || page.data.project_title || "Featured Project",
            images: page.data.meta_image?.url ? [{ url: page.data.meta_image.url }] : [],
        },
    };
}

// Use PageProps in your Page Component and await params
export default async function ProjectPage({ params }: PageProps) {
    const {uid} = await params;
    const client = createClient({cookies: await cookies()});

    const page = await client.getByUID("featured_project", uid, {
        fetchLinks: ['owner.name', 'owner.title', 'owner.image'],
    }).catch(() => notFound());

    console.log(page)

    const { project_tag, project_title, project_location } = page.data;
    const project_date = (page.data as any).project_date;

    const formattedDate = isFilled.date(project_date)
        ? new Intl.DateTimeFormat("en-US", {
            timeZone: "UTC",
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(asDate(project_date))
        : null;

    // get owner info
    const ownerLink = page.data.owner;
    console.log(ownerLink)
    const ownerData = ownerLink.data as Content.OwnerDocument['data'];
    console.log(ownerData)
    const { name, title, image } = ownerData;


    return (
        <>
            <article>
                <Link
                    href="/projects/"
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
                    Back to Projects
                </Link>

                {/* Project Header */}
                <section
                    className="project-header-slice bg-white pt-6 md:pt-10 text-charcoal"
                >
                    <div className="container mx-auto px-4 text-center">

                        {/* Project Category */}
                        {isFilled.keyText(project_tag) && (
                            <div className="mb-3 font-thin uppercase tracking-wider text-gold">
                                {project_tag}
                            </div>
                        )}

                        {/* Project Title */}
                        {isFilled.keyText(project_title) && (
                            <h1 className="text-3xl md:text-5xl uppercase font-bold font-serif font-thin mb-6">
                                {project_title}
                            </h1>
                        )}

                        {/* Project Meta: Date and Location */}
                        <div
                            className="meta-info text-sm text-gray-700 font-sans flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-1">
                            {formattedDate && (
                                <span className="inline-flex items-start">
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

                            {/* Project Location */}
                            {isFilled.keyText(project_location) && (
                                <span className="inline-flex items-start">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 flex-shrink-0"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    opacity="1"
                                    d="M4.08398 8.45617C4.08398 6.39153 4.83717 4.90049 5.92068 3.91953C7.01696 2.92701 8.49755 2.41601 10.0006 2.41602C11.5037 2.41602 12.9843 2.92703 14.0806 3.91955C15.1641 4.90051 15.9173 6.39155 15.9173 8.45617C15.9173 10.8398 14.6435 12.9692 13.1725 14.6234C12.5059 15.373 12.0904 15.8323 11.6416 16.1299C11.2397 16.3965 10.7806 16.5493 10.0008 16.5494C9.22102 16.5494 8.7619 16.3965 8.35999 16.13C7.91124 15.8324 7.49571 15.3731 6.82903 14.6235C5.35792 12.9693 4.08398 10.8399 4.08398 8.45617ZM17.4173 8.45617C17.4173 5.99403 16.5038 4.09 15.0873 2.80757C13.6836 1.53671 11.8309 0.91602 10.0007 0.916016C8.17042 0.916011 6.31767 1.53669 4.91395 2.80756C3.49746 4.08998 2.58398 5.99401 2.58398 8.45617C2.58398 11.3733 4.13189 13.8479 5.70817 15.6203L5.75579 15.6739C6.36076 16.3543 6.90171 16.9627 7.53095 17.3801C8.22347 17.8393 8.98496 18.0494 10.0009 18.0494C11.0167 18.0493 11.7782 17.8393 12.4707 17.38C13.0999 16.9626 13.6409 16.3542 14.2458 15.6737L14.2934 15.6202C15.8696 13.8478 17.4173 11.3732 17.4173 8.45617ZM8.25065 8.33271C8.25065 7.36621 9.03415 6.58271 10.0007 6.58271C10.9671 6.58271 11.7507 7.36621 11.7507 8.33271C11.7507 9.29921 10.9671 10.0827 10.0007 10.0827C9.03415 10.0827 8.25065 9.29921 8.25065 8.33271ZM10.0007 5.08271C8.20573 5.08271 6.75065 6.53779 6.75065 8.33271C6.75065 10.1276 8.20573 11.5827 10.0007 11.5827C11.7956 11.5827 13.2507 10.1276 13.2507 8.33271C13.2507 6.53779 11.7956 5.08271 10.0007 5.08271Z"
                                    fill="#34342e80"
                                />
                            </svg>

                            <span className="project-location text-black-900 text-base md:text-base opacity-50">
                                {project_location}
                            </span>
                        </span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Owner Info */}
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

                <SliceZone slices={page.data.slices} components={components}/>
            </article>
        </>


    )
        ;
}

// generateStaticParams returns the resolved shape
export async function generateStaticParams(): Promise<PageParams[]> {
    const client = createClient();
    const pages = await client.getAllByType("featured_project");
    return pages.map((page) => ({
        uid: page.uid,
    }));

}