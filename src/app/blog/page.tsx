// app/blog/page.tsx
import { createClient } from "@/prismicio";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { asText, isFilled, Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import type { Metadata } from "next";
import { components } from "@/slices";
import { Bounded } from "@/components/Bounded";


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
                title: defaultTitle,
                description: defaultDescription,
                images: [],
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
            title: pageSpecificTitle,
            description: pageSpecificDescription,
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
                <div className="space-y-12 md:space-y-16">
                    {individualBlogPosts.map((post) => (
                        <article key={post.id} className="flex flex-col md:flex-row md:gap-8 items-start">
                            {/* Image Column */}
                            {isFilled.image(post.data.blog_image) && (
                                <div className="w-full lg:w-[50vw] xl:w-[40vw] 2xl:w-[30vw] sm:min-w-[400px] lg:min-w-[450px] 2xl:min-w-[576px]">
                                    <PrismicNextLink document={post} className="overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow">
                                        <PrismicNextImage
                                            field={post.data.blog_image}
                                            className="w-full h-full object-cover"
                                        />
                                    </PrismicNextLink>
                                </div>
                            )}

                            {/* Text Content Column */}
                            <div className="max-w-full xl:max-w-[600px] text-base md:text-xl text-black-700 py-5">
                                {isFilled.richText(post.data.blog_title) && (
                                    <h3 className="max-w-full xl:max-w-[460px] font-sans text-black-900 text-4xl uppercase leading-10 mb-4">
                                        <PrismicNextLink document={post} className="hover:text-gold-700 transition-colors">
                                            {asText(post.data.blog_title)}
                                        </PrismicNextLink>
                                    </h3>
                                )}
                                {isFilled.richText(post.data.blog_description) && (
                                    <div className="max-w-full xl:max-w-[600px] text-base md:text-xl text-black-700">
                                        {asText(post.data.blog_description)}
                                    </div>
                                )}
                                <div className="mt-auto">
                                    <PrismicNextLink document={post} className="text-cta flex justify-start items-center font-serif text-[18px] text-gold-900 mt-4 font-gtAmerica mb-4">
                                        Read More »
                                    </PrismicNextLink>
                                    {isFilled.date(post.data.blog_date) && (
                                        <p className="font-normal text-xs sm:text-sm 2xl:text-base leading-5 2xl:leading-[27px] text-black-900 text-opacity-50">
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