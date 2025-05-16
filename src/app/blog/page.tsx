// app/blog/page.tsx
import { createClient } from "@/prismicio";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { asText, isFilled, Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import type { Metadata } from "next";
import { components } from "@/slices";
import { Bounded } from "@/components/Bounded";
import {undefined} from "io-ts";


interface PageDocumentData extends Content.PageDocumentData {

}

interface BlogPageDocument extends Content.PageDocument { // Assuming PageDocument is generated
    data: PageDocumentData;
}


export async function generateMetadata(): Promise<Metadata> {
    const client = createClient();
    const pageContent = await client.getByUID<BlogPageDocument>("page", "blog")
        .catch(() => null);

    const defaultTitle = "Blog"; // Define a default title
    const defaultDescription = "Read our latest articles and insights."; // Define a default description

    if (!pageContent) {
        return {
            title: defaultTitle,
            description: defaultDescription,
            openGraph: {
                title: defaultTitle, // Use the default string title
                description: defaultDescription, // Add description here too
                images: [], // Default to no images if pageContent is not found
            },
        };
    }

    // Determine the title for the page and OpenGraph
    const pageSpecificTitle = pageContent.data.meta_title || (isFilled.richText(pageContent.data.title) ? asText(pageContent.data.title) : defaultTitle);

    // Determine the description for the page and OpenGraph
    const pageSpecificDescription = pageContent.data.meta_description || defaultDescription;

    // Determine OpenGraph images
    const ogImages = pageContent.data.meta_image?.url ? [{ url: pageContent.data.meta_image.url }] : [];

    return {
        title: pageSpecificTitle,
        description: pageSpecificDescription,
        openGraph: {
            title: pageSpecificTitle, // Use the determined title (which will be a string)
            description: pageSpecificDescription, // Add description here
            images: ogImages,
        },
    };
}

export default async function BlogIndexPage() {
    const client = createClient();

    // Fetch the content for the "Page" document with UID "blog"
    const pageContent = await client.getByUID<BlogPageDocument>("page", "blog")
        .catch(() => {
            console.error("Failed to fetch 'page' document with UID 'blog'.");
            return null;
        });

    // Fetch all individual blog posts (Repeatable Type "blog")
    const individualBlogPosts = await client.getAllByType("blog", {
        orderings: [
            { field: "my.blog.blog_date", direction: "desc" },
            { field: "document.first_publication_date", direction: "desc" },
        ],
    });

    // --- CONSOLE LOGGING ---
    // if (pageContent) {
    //     console.log("--- 'Page' Document Data (UID: 'blog') ---");
    //     console.log("ID:", pageContent.id);
    //     console.log("UID:", pageContent.uid);
    //     console.log("Type:", pageContent.type);
    //     console.log("Data Object:", JSON.stringify(pageContent.data, null, 2));
    //     console.log("Slices:", JSON.stringify(pageContent.data.slices, null, 2));
    // } else {
    //     console.log("!!! 'Page' Document (UID: 'blog') not found or failed to fetch. !!!");
    // }

    // console.log("\n--- Individual Blog Posts Data (Repeatable Type 'blog') ---");
    if (individualBlogPosts && individualBlogPosts.length > 0) {
        individualBlogPosts.forEach((post, index) => {
            console.log(`  Post ${index + 1} (UID: ${post.uid}): ${isFilled.richText(post.data.blog_title) ? asText(post.data.blog_title) : 'N/A'}`);
        });
    } else {
        console.log("No individual blog posts found.");
    }

    if (!pageContent) {
        // Fallback if the main "Page" (UID "blog") content isn't found
        return (
            <Bounded yPadding="lg">
                <h1 className="text-4xl md:text-5xl font-ivar-display font-bold mb-8 md:mb-12 text-center">
                    Our Blog
                </h1>
                <p className="text-center">Blog page content is currently unavailable.</p>
            </Bounded>
        );
    }

    return (
        <>
            {/* Render Slices from the "Page" (UID "blog") document */}
            <SliceZone slices={pageContent.data.slices} components={components} />

            {/* Section for listing individual blog posts */}
            <Bounded yPadding="lg" className="blog-posts-listing">
                {/* Optional: Title for the "Latest Articles" section, could also come from a Slice */}
                {/* <h2 className="text-3xl md:text-4xl font-ivar-display font-semibold mb-12 text-center">
                    Latest Articles
                </h2> */}
                <div className="space-y-12 md:space-y-16"> {/* Space between blog post items */}
                    {individualBlogPosts.map((post) => (
                        <article key={post.id} className="flex flex-col md:flex-row md:gap-8 items-start">
                            {/* Image Column */}
                            {isFilled.image(post.data.blog_image) && (
                                <div className="w-full md:w-2/5 lg:w-1/3 md:flex-shrink-0 mb-4 md:mb-0">
                                    <PrismicNextLink document={post} className="block aspect-[4/3] overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow">
                                        <PrismicNextImage
                                            field={post.data.blog_image}
                                            alt={post.data.blog_image.alt || ""} // Ensure alt text
                                            className="w-full h-full object-cover"
                                            imgixParams={{ ar: "4:3", fit: "crop" }} // Enforce aspect ratio via Imgix
                                        />
                                    </PrismicNextLink>
                                </div>
                            )}

                            {/* Text Content Column */}
                            <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col">
                                {isFilled.richText(post.data.blog_title) && (
                                    <h3 className="text-2xl lg:text-3xl font-ivar-display font-semibold mb-2 text-charcoal">
                                        <PrismicNextLink document={post} className="hover:text-gold-700 transition-colors">
                                            {asText(post.data.blog_title)}
                                        </PrismicNextLink>
                                    </h3>
                                )}
                                {isFilled.richText(post.data.blog_description) && (
                                    <div className="text-black-700 text-base mb-4 line-clamp-3 md:line-clamp-4">
                                        {asText(post.data.blog_description)}
                                    </div>
                                )}
                                <div className="mt-auto"> {/* Pushes content below to the bottom */}
                                    <PrismicNextLink document={post} className="text-gold-900 hover:text-gold-700 text-sm font-semibold inline-block mb-3 transition-colors">
                                        Read More »
                                    </PrismicNextLink>
                                    {isFilled.date(post.data.blog_date) && (
                                        <p className="text-sm text-gray-500">
                                            {new Intl.DateTimeFormat("en-US", { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(post.data.blog_date))}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </Bounded>
        </>
    );
}