// app/blog/page.tsx
import { createClient } from "@/prismicio";
import { PrismicNextLink } from "@prismicio/next";
import { asText, isFilled, Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { Bounded } from "@/components/Bounded";
import {undefined} from "io-ts";


interface PageDocumentData extends Content.PageDocumentData {

}

interface BlogPageDocument extends Content.PageDocument { // Assuming PageDocument is generated
    data: PageDocumentData;
}


export async function generateMetadata(): Promise<{
    description: string;
    title: string | null;
    openGraph: { images: { url: any }[]; title: string | null }
}> {
    const client = createClient();
    // Fetch the "Page" document with UID "blog" for metadata
    const pageContent = await client.getByUID<BlogPageDocument>("page", "blog")
        .catch(() => null);

    if (!pageContent) {
        return {
            openGraph: {images: [], title: undefined},
            title: "Blog",
            description: "Read our latest articles and insights."
        };
    }

    return {
        title: pageContent.data.meta_title || (isFilled.richText(pageContent.data.title) ? asText(pageContent.data.title) : "Blog"),
        description: pageContent.data.meta_description || "",
        openGraph: {
            title: pageContent.data.meta_title || (isFilled.richText(pageContent.data.title) ? asText(pageContent.data.title) : "Blog"),
            images: pageContent.data.meta_image?.url ? [{ url: pageContent.data.meta_image.url }] : [],
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
                {/* You could also have a title for this section come from the pageContent.data if desired */}
                <div className="grid gap-8 md:gap-12">
                    {individualBlogPosts.map((post) => (
                        <article key={post.id} className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            {isFilled.richText(post.data.blog_title) && (
                                <h3 className="text-2xl font-ivar-display font-semibold mb-2">
                                    <PrismicNextLink document={post}>
                                        {asText(post.data.blog_title)}
                                    </PrismicNextLink>
                                </h3>
                            )}
                            {isFilled.image(post.data.blog_image) && post.data.blog_image.url && (
                                <PrismicNextLink document={post} className="block mb-4">
                                    <img
                                        src={post.data.blog_image.url}
                                        alt={post.data.blog_image.alt || ""}
                                        className="w-full h-48 object-cover rounded"
                                    />
                                </PrismicNextLink>
                            )}
                            {isFilled.richText(post.data.blog_description) && (
                                <div className="text-black-700 mb-4 line-clamp-3">
                                    {asText(post.data.blog_description)}
                                </div>
                            )}
                            {isFilled.date(post.data.blog_date) && (
                                <p className="text-sm text-gray-500 mb-4">
                                    {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(post.data.blog_date))}
                                </p>
                            )}
                            <PrismicNextLink document={post} className="text-gold-900 hover:underline font-semibold">
                                Read more →
                            </PrismicNextLink>
                        </article>
                    ))}
                </div>
            </Bounded>
        </>
    );
}