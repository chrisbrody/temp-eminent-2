'use client';

import {FC, JSX, useEffect, useState} from "react";
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

const FeaturedProjects: ({slice}: { slice: any }) => JSX.Element = ({ slice }) => {
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
                        console.error("Fetch project_onw (ratio115) failed:", error);
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

        const title = isFilled.keyText(projectDoc.data.project_title)
            ? projectDoc.data.project_title
            : projectDoc.uid || "View Project";

        const location = isFilled.keyText(projectDoc.data.project_location)
            ? projectDoc.data.project_location
            : null;

        const imageUrl = projectDoc.data.project_image?.url;

        return (
            <div>
                {imageUrl && (
                    <div className="rounded overflow-hidden h-[300px] w-full">
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                        />
                    </div>
                )}
                <div className="text-2xl lg:text-[32px] text-black-900 uppercase mt-6 mb-2 font-ivar-display">{title}</div>
                {location && (
                    <div className="text-[18px] lg:text-xl text-black-500">{location}</div>
                )}
            </div>
        );
    };

    return (
        <section
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            className="my-12 px-4 md:px-6 lg:px-8 mx-auto w-full max-w-6xl"
        >
            <div className="space-y-6 flex gap-6">
                {isRatio115Slice(slice) && (
                    <>
                        {one && (
                            <PrismicNextLink document={one} className="block flex-[2] mb-0">
                                {renderProjectLinkContent(one)}
                            </PrismicNextLink>
                        )}
                        {two && (
                            <PrismicNextLink document={two} className="block flex-[3] mb-0">
                                {renderProjectLinkContent(two)}
                            </PrismicNextLink>
                        )}
                    </>
                )}

                {isRatio151Slice(slice) && (
                    <>
                        {three && (
                            <PrismicNextLink document={three} className="block flex-[3] mb-0">
                                {renderProjectLinkContent(three)}
                            </PrismicNextLink>
                        )}
                        {four && (
                            <PrismicNextLink document={four} className="tblock flex-[2] mb-0">
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
