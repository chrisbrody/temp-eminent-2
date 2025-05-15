'use client'
import { FC, useEffect, useState } from "react";
import { Content, isFilled, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { PrismicNextLink } from "@prismicio/next";

// Import the specific variation primary types from your prismicio-types.d.ts
import type {
    FeaturedProjectsSliceRatio115Primary,
    FeaturedProjectsSliceRatio151Primary,
} from "../../../../prismicio-types";

/**
 * Props for `FeaturedProjects`.
 */
export type FeaturedProjectsProps = SliceComponentProps<Content.FeaturedProjectsSlice>;

const FeaturedProjects: FC<FeaturedProjectsProps> = ({ slice }) => {
    const [projectData, setProjectData] = useState<{
        one?: Content.FeaturedProjectDocument;
        two?: Content.FeaturedProjectDocument;
        three?: Content.FeaturedProjectDocument;
        four?: Content.FeaturedProjectDocument;
    }>({});

    useEffect(() => {
        const fetchProjects = async () => {
            const client = createClient();
            const variation = slice.variation;
            // We will cast slice.primary within the conditional blocks

            const newData: typeof projectData = {};

            if (variation === 'ratio115') {
                // Type assertion for primary within this specific variation block
                const primaryData = slice.primary as FeaturedProjectsSliceRatio115Primary;
                if (isFilled.contentRelationship(primaryData.project_one)) {
                    try {
                        newData.one = await client.getByID(primaryData.project_one.id) as Content.FeaturedProjectDocument;
                    } catch (error) {
                        console.error("Fetch project_one (ratio115) failed:", error);
                    }
                }
                if (isFilled.contentRelationship(primaryData.project_two)) {
                    try {
                        newData.two = await client.getByID(primaryData.project_two.id) as Content.FeaturedProjectDocument;
                    } catch (error) {
                        console.error("Fetch project_two (ratio115) failed:", error);
                    }
                }
            } else if (variation === 'ratio151') {
                // Type assertion for primary within this specific variation block
                const primaryData = slice.primary as FeaturedProjectsSliceRatio151Primary;
                if (isFilled.contentRelationship(primaryData.project_three)) {
                    try {
                        newData.three = await client.getByID(primaryData.project_three.id) as Content.FeaturedProjectDocument;
                    } catch (error) {
                        console.error("Fetch project_three (ratio151) failed:", error);
                    }
                }
                if (isFilled.contentRelationship(primaryData.project_four)) {
                    try {
                        newData.four = await client.getByID(primaryData.project_four.id) as Content.FeaturedProjectDocument;
                    } catch (error) {
                        console.error("Fetch project_four (ratio151) failed:", error);
                    }
                }
            }

            setProjectData(newData);
        };

        fetchProjects();
    }, [slice]);

    const { one, two, three, four } = projectData;

    const renderProjectLinkContent = (projectDoc: Content.FeaturedProjectDocument | undefined) => {
        if (!projectDoc) return null;
        if (isFilled.richText(projectDoc.data.project_title)) {
            return asText(projectDoc.data.project_title);
        }
        return projectDoc.uid || "View Project";
    };

    return (
        <section
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            className="my-12 px-4 md:px-6 lg:px-8"
        >
            <div className="space-y-6">
                {slice.variation === 'ratio115' && (
                    <>
                        {one && isFilled.contentRelationship(one) && (
                            <PrismicNextLink document={one} className="text-xl text-blue-600 hover:underline block">
                                {renderProjectLinkContent(one)}
                            </PrismicNextLink>
                        )}
                        {two && isFilled.contentRelationship(two) && (
                            <PrismicNextLink document={two} className="text-xl text-blue-600 hover:underline block">
                                {renderProjectLinkContent(two)}
                            </PrismicNextLink>
                        )}
                    </>
                )}

                {slice.variation === 'ratio151' && (
                    <>
                        {three && isFilled.contentRelationship(three) && (
                            <PrismicNextLink document={three} className="text-xl text-blue-600 hover:underline block">
                                {renderProjectLinkContent(three)}
                            </PrismicNextLink>
                        )}
                        {four && isFilled.contentRelationship(four) && (
                            <PrismicNextLink document={four} className="text-xl text-blue-600 hover:underline block">
                                {renderProjectLinkContent(four)}
                            </PrismicNextLink>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default FeaturedProjects;