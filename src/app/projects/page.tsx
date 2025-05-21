// app/projects/page.tsx

import { createClient } from "@/prismicio";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { asText, isFilled, asDate } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import type { Metadata } from "next";
import { components } from "@/slices";
import { Bounded } from "@/components/Bounded";

import type { PageDocument, FeaturedProjectDocument } from '../../../prismicio-types';

// Helper function to group an array into chunks (pairs in this case)
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

// Helper component to render a single project card
// This makes the main map loop much cleaner
const ProjectCard = ({ project }: { project: FeaturedProjectDocument }) => {
    const formattedDate = isFilled.date(project.data.project_date)
        ? new Intl.DateTimeFormat("en-US", {
            timeZone: "UTC",
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(asDate(project.data.project_date))
        : null;

    return (
        <article className="h-full flex flex-col"> {/* Ensure card takes full height of its container */}
            {/* Image */}
            {isFilled.image(project.data.project_image) && (
                <div className="rounded overflow-hidden h-[300px] w-full mb-4"> {/* Fixed height for consistent image size */}
                    <PrismicNextLink document={project} className="block w-full h-full">
                        <PrismicNextImage
                            field={project.data.project_image}
                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                        />
                    </PrismicNextLink>
                </div>
            )}

            {/* Text Content */}
            <div className="flex flex-col flex-grow"> {/* Use flex-grow to push "Read More" to bottom */}
                {isFilled.keyText(project.data.project_title) && (
                    <h3 className="font-sans text-black-900 text-4xl uppercase leading-10 mb-2">
                        <PrismicNextLink document={project} className="hover:text-gold-700 transition-colors">
                            {project.data.project_title}
                        </PrismicNextLink>
                    </h3>
                )}
                {isFilled.keyText(project.data.project_location) && (
                    <div className="text-base md:text-xl text-black-700 mb-4">
                        {project.data.project_location}
                    </div>
                )}
            </div>
        </article>
    );
};


export async function generateMetadata(): Promise<Metadata> {
    const client = createClient();
    const pageContent = await client.getByUID<PageDocument>("page", "projects")
        .catch(() => null);

    const defaultTitle = "Projects";
    const defaultDescription = "View our latest project designs.";

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

    const pageSpecificTitle = pageContent.data.meta_title || defaultTitle;
    const pageSpecificDescription = pageContent.data.meta_description || defaultDescription;
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

export default async function ProjectsIndexPage() {
    const client = createClient();

    const pageContent = await client.getByUID<PageDocument>("page", "projects")
        .catch(() => {
            console.error("Failed to fetch 'page' document with UID 'projects'.");
            return null;
        });

    const individualProjects: FeaturedProjectDocument[] = await client.getAllByType("featured_project", {
        orderings: [
            { field: "my.featured_project.project_date", direction: "desc" },
            { field: "document.first_publication_date", direction: "desc" },
        ],
    });

    if (individualProjects && individualProjects.length > 0) {
        individualProjects.forEach((project, index) => {
            console.log(`  Project ${index + 1} (UID: ${project.uid}): ${isFilled.keyText(project.data.project_title) ? project.data.project_title : 'N/A'}`);
        });
    } else {
        console.log("No individual projects found.");
    }

    if (!pageContent) {
        return (
            <Bounded yPadding="lg">
                <p className="text-center">Project page content is currently unavailable.</p>
            </Bounded>
        );
    }

    // Group projects into pairs
    const projectPairs = chunkArray(individualProjects, 2);

    return (
        <>
            <SliceZone slices={pageContent.data.slices} components={components} />

            {/* Tag Filter Coming Soon */}
            <Bounded yPadding="sm">
                Tag Filter Coming Soon
            </Bounded>
            <Bounded yPadding="sm" className="projects-listing">
                <div className="space-y-12 md:space-y-16"> {/* Vertical space between rows */}
                    {projectPairs.map((pair, pairIndex) => {
                        // Determine the layout for the current row based on its index
                        // "Odd rows" (0-indexed: 0, 2, 4...) will have the first project wider (1.5/1)
                        // "Even rows" (0-indexed: 1, 3, 5...) will have the second project wider (1/1.5)
                        const isOddRow = pairIndex % 2 === 0;

                        const firstProject = pair[0];
                        const secondProject = pair[1];

                        return (
                            <div
                                key={`project-row-${pairIndex}`}
                                className="flex flex-col md:flex-row md:gap-8 items-stretch"
                            >
                                {firstProject && (
                                    <div className={`w-full ${isOddRow ? 'md:w-3/5' : 'md:w-2/5'}`}>
                                        <ProjectCard project={firstProject} />
                                    </div>
                                )}
                                {secondProject && (
                                    <div className={`w-full ${isOddRow ? 'md:w-2/5' : 'md:w-3/5'}`}>
                                        <ProjectCard project={secondProject} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Bounded>
        </>
    );
}