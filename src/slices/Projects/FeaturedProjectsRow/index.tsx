'use client';

import { FC, useEffect, useState } from "react";
import { Content, isFilled, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { PrismicNextLink } from "@prismicio/next";

/**
 * Props for `FeaturedProjects`.
 */
export type FeaturedProjectsProps = SliceComponentProps<Content.FeaturedProjectsSlice>;

// Type guards
type Ratio115Slice = Extract<Content.FeaturedProjectsSlice, { variation: 'ratio115' }>;
type Ratio151Slice = Extract<Content.FeaturedProjectsSlice, { variation: 'ratio151' }>;

function isRatio115Slice(slice: Content.FeaturedProjectsSlice): slice is Ratio115Slice {
    return slice.variation === 'ratio115';
}

function isRatio151Slice(slice: Content.FeaturedProjectsSlice): slice is Ratio151Slice {
    return slice.variation === 'ratio151';
}

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
            const newData: typeof projectData = {};

            if (isRatio115Slice(slice)) {
                if (isFilled.contentRelationship(slice.primary.project_one)) {
                    try {
                        newData.one = await client.getByID(slice.primary.project_one.id) as Content.FeaturedProjectDocument;
                    } catch (error) {
                        console.error("Fetch project_one (ratio115) failed:", error);
                    }
                }
                if (isFilled.contentRelationship(slice.primary.project_two)) {
                    try {
                        newData.two = await client.getByID(slice.primary.project_two.id) as Content.FeaturedProjectDocument;
                    } catch (error) {
                        console.error("Fetch project_two (ratio115) failed:", error);
                    }
                }
            } else if (isRatio151Slice(slice)) {
                if (isFilled.contentRelationship(slice.primary.project_three)) {
                    try {
                        newData.three = await client.getByID(slice.primary.project_three.id) as Content.FeaturedProjectDocument;
                    } catch (error) {
                        console.error("Fetch project_three (ratio151) failed:", error);
                    }
                }
                if (isFilled.contentRelationship(slice.primary.project_four)) {
                    try {
                        newData.four = await client.getByID(slice.primary.project_four.id) as Content.FeaturedProjectDocument;
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
                {isRatio115Slice(slice) && (
                    <>
                        {one && (
                            <PrismicNextLink document={one} className="text-xl text-blue-600 hover:underline block">
                                {renderProjectLinkContent(one)}
                            </PrismicNextLink>
                        )}
                        {two && (
                            <PrismicNextLink document={two} className="text-xl text-blue-600 hover:underline block">
                                {renderProjectLinkContent(two)}
                            </PrismicNextLink>
                        )}
                    </>
                )}

                {isRatio151Slice(slice) && (
                    <>
                        {three && (
                            <PrismicNextLink document={three} className="text-xl text-blue-600 hover:underline block">
                                {renderProjectLinkContent(three)}
                            </PrismicNextLink>
                        )}
                        {four && (
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
