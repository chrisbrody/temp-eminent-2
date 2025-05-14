// src/slices/Projects/ProjectSection/index.tsx
import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { Bounded } from "@/components/Bounded";

// Import the model.json to get human-readable names
import model from "./model.json";

/**
 * Props for `ProjectSection`.
 */
export type ProjectSectionProps =
    SliceComponentProps<Content.ProjectSectionSlice>;

/**
 * Component for "ProjectSection" Slices.
 */
const ProjectSection: FC<ProjectSectionProps> = ({ slice }) => {
    // Destructure for easier access
    const { variation, primary } = slice;

    // Function to get the human-readable name
    const getVariationDisplayName = (id: string) => {
        const variationInfo = model.variations.find(v => v.id === id);
        return variationInfo ? variationInfo.name : id;
    };

    // Base section props common to all variations
    const sectionBaseProps = {
        "data-slice-type": slice.slice_type,
        "data-slice-variation": variation,
        className: "py-8 md:py-12",
    };

    // Render different layouts based on the variation ID
    switch (variation) {
        case "default": // "NarrativeBlock"
            console.log(primary.tag, isFilled.keyText(primary.tag))
            return (
                <section {...sectionBaseProps} aria-label="Narrative Block Section">
                    <Bounded>
                        <div className="grid grid-cols-1 items-center">
                            <div>
                                {isFilled.image(primary.image) && (
                                    <PrismicNextImage
                                        field={primary.image}
                                        className="shadow-md"
                                        imgixParams={{ar: "4:3", fit: "crop"}}
                                    />
                                )}
                            </div>
                            <div className="flex gap-x-8">
                                <div className="w-[70%]">
                                    {isFilled.richText(primary.title) && (
                                        <div className="text-2xl lg:text-[32px] text-black-900 uppercase mt-10 mb-6">
                                            <PrismicRichText field={primary.title}/>
                                        </div>
                                    )}
                                    {isFilled.richText(primary.description) && (
                                        <div className="text-base md:text-xl text-left text-black-700">
                                            <PrismicRichText field={primary.description}/>
                                        </div>
                                    )}
                                </div>
                                <div className="w-[30%]">
                                    {isFilled.keyText(primary.tag) && (
                                        <div className="flex items-center mt-20">
                                            <div className="w-24 border-t border-solid border-gold-900 ml-6 mr-4"></div>
                                            <p className="font-serif text-sm text-gold-900 min-w-fit font-gtAmerica">{primary.tag}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Bounded>
                </section>
            );

        case "fullWidthText": // "Full Width Text"
            return (
                <section {...sectionBaseProps} aria-label="Full Width Text Section">
                    <Bounded>
                        {isFilled.image(primary.image) && (
                            <div className="mb-2">
                                <PrismicNextImage
                                    field={primary.image}
                                    className="shadow-md"
                                    imgixParams={{ar: "4:3", fit: "crop"}}
                                />
                            </div>
                        )}
                        {isFilled.richText(primary.description) && (
                            <div className="prose prose-xl max-w-3xl mx-auto text-center font-gtAmerica">
                                <PrismicRichText field={primary.description}/>
                            </div>
                        )}
                    </Bounded>
                </section>
            );

        case "splitContent": // "Split Content"
            return (
                <section {...sectionBaseProps} aria-label="Split Content Section">
                    <Bounded>
                        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            {/* Column 1: Image */}
                            <div className="md:order-1">
                                {isFilled.image(primary.image) && (
                                    <PrismicNextImage
                                        field={primary.image}
                                        className="shadow-lg w-full"
                                        imgixParams={{ar: "3:4", fit:"crop"}}
                                    />
                                )}
                            </div>
                            {/* Column 2: Text Content */}
                            <div className="md:order-2">
                                {isFilled.keyText(primary.tag) && (
                                    <div className="flex items-center justify-end">
                                        <div className="w-24 border-t border-solid border-gold-900 ml-6 mr-4"></div>
                                        <p className="font-serif text-sm text-gold-900 min-w-fit font-gtAmerica">{primary.tag}</p>
                                    </div>
                                )}
                                {isFilled.richText(primary.title) && (
                                    <div className="text-2xl lg:text-[32px] text-black-900 uppercase mt-10 mb-6">
                                        <PrismicRichText field={primary.title} />
                                    </div>
                                )}
                                {isFilled.richText(primary.description) && (
                                    <div className="text-base md:text-xl text-left text-black-700">
                                        <PrismicRichText field={primary.description} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Bounded>
                </section>
            );

        case "beforeAndAfter": // "Before and After"
            return (
                <section {...sectionBaseProps} aria-label="Before and After Section">
                    <Bounded>
                        <h2 className="text-3xl font-bold text-center mb-8">Before & After</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Before Column */}
                            <div>
                                {isFilled.image(primary.image_before) && (
                                    <PrismicNextImage field={primary.image_before} className="rounded-lg mb-4" imgixParams={{ar:"4:3", fit:"crop"}} />
                                )}
                                {isFilled.richText(primary.image_before_title) && (
                                    <div className="text-xl font-semibold mb-2"><PrismicRichText field={primary.image_before_title} /></div>
                                )}
                                {isFilled.richText(primary.image_before_description) && (
                                    <div className="prose"><PrismicRichText field={primary.image_before_description} /></div>
                                )}
                            </div>
                            {/* After Column */}
                            <div>
                                {isFilled.image(primary.image_after) && (
                                    <PrismicNextImage field={primary.image_after} className="rounded-lg mb-4" imgixParams={{ar:"4:3", fit:"crop"}}/>
                                )}
                                {isFilled.richText(primary.image_after_title) && (
                                    <div className="text-xl font-semibold mb-2"><PrismicRichText field={primary.image_after_title} /></div>
                                )}
                                {isFilled.richText(primary.image_after_description) && (
                                    <div className="prose"><PrismicRichText field={primary.image_after_description} /></div>
                                )}
                            </div>
                        </div>
                    </Bounded>
                </section>
            );

        default:
            // Fallback for unknown variations or if you haven't implemented one yet
            return (
                <section
                    {...sectionBaseProps}
                    style={{ border: "2px dashed red", padding: "20px", margin: "20px 0" }}
                >
                    <h2 className="text-xl font-semibold">
                        Project Section - Variation Not Implemented
                    </h2>
                    <p>
                        Selected Variation (Name):{" "}
                        <strong>{getVariationDisplayName(variation)}</strong>
                    </p>
                    <p>
                        Selected Variation (ID): <strong>{variation}</strong>
                    </p>
                    <p>Implement the layout for this variation in the component.</p>
                </section>
            );
    }
};

export default ProjectSection;