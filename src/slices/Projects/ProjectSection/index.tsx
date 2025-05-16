// src/slices/Projects/ProjectSection/index.tsx
import {FC, JSX} from "react";
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
const ProjectSection: ({slice}: { slice: any }) => (JSX.Element) = ({ slice }) => {
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
        case "default": // "Narrative Block width 100%"
        case "narrativeBlockWidth80": // "Narrative Block Width 80%"
            return (
                <section {...sectionBaseProps} aria-label="Narrative Block Section">
                    <Bounded>
                        <div className="grid grid-cols-1 items-center">
                            <div>
                                {isFilled.image(primary.image) && (
                                    <PrismicNextImage
                                        field={primary.image}
                                        className=""
                                        imgixParams={{ar: "4:3", fit: "crop"}}
                                    />
                                )}
                                {isFilled.keyText(slice.primary.image_caption) && (
                                    <p className="text-black-900 opacity-90 text-center font-gtAmerica">
                                        {slice.primary.image_caption}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-x-8">
                                <div className="w-[70%]">
                                    {isFilled.richText(primary.title) && (
                                        <div className="text-2xl lg:text-[32px] text-black-900 uppercase mt-8 mb-4">
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
                                        <div className="flex items-center mt-15 justify-end">
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

        case "fullWidthText": // Image and Text width 100%
        case "imageAndTextWidth80": // Image and Text width 80%
            return (
                <section {...sectionBaseProps} aria-label={slice.variation === "imageAndTextWidth80" ? "Image and Text width 80%" : "Image and Text width 100%"}>
                    <Bounded widthClass={slice.variation === "imageAndTextWidth80" ? "max-w-5xl" : ""}>
                        {isFilled.image(primary.image) && (
                            <div className="mb-2">
                                <PrismicNextImage
                                    field={primary.image}
                                    className=""
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

        case "splitContent": // "Split Content text Right"
        case "splitContentTextLeft": // "Split Content text Left"
            return (
                <section {...sectionBaseProps} aria-label="Split Content Section">
                    <Bounded widthClass="max-w-5xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            {/* Column Image */}
                            <div className={slice.variation === "splitContentTextLeft" ? "md:order-2" : "md:order-1"}>
                                {isFilled.image(primary.image) && (
                                    <PrismicNextImage
                                        field={primary.image}
                                        className="shadow-lg w-full"
                                        imgixParams={{ar: "3:4", fit:"crop"}}
                                    />
                                )}
                                {isFilled.keyText(slice.primary.image_caption) && (
                                    <figcaption className="flex justify-center items-center mt-1 text-base leading-4 text-center text-black-900 opacity-90 font-gtAmerica">
                                        {slice.primary.image_caption}
                                    </figcaption>
                                )}
                            </div>
                            {/* Column Text Content */}
                            <div className={slice.variation === "splitContentTextLeft" ? "md:order-1" : "md:order-2"}>
                                {isFilled.richText(primary.title) && (
                                    <div className="text-2xl lg:text-[32px] text-black-900 uppercase mb-4">
                                        <PrismicRichText field={primary.title} />
                                    </div>
                                )}
                                {isFilled.keyText(primary.tag) && (
                                    <div
                                        className={`flex items-center mb-4 ${
                                            slice.variation === "splitContentTextLeft" ? "justify-start" : "justify-end"
                                        }`}
                                    >
                                        <div className="w-24 border-t border-solid border-gold-900 mr-4"></div>
                                        <p className="font-serif text-sm text-gold-900 min-w-fit font-gtAmerica">{primary.tag}</p>
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

        case "showcaseImagesWithCaption": // "Showcase Images with Caption"
            return (
                <section {...sectionBaseProps} aria-label="Showcase Images with Caption">
                    <Bounded widthClass="max-w-5xl">
                        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-10 md:gap-y-0">

                            {/* Column 1: Image One & Description One */}
                            <div className="flex flex-col">
                                {isFilled.image(primary.image_one) && (
                                    <PrismicNextImage
                                        field={primary.image_one}
                                        className=""
                                    />
                                )}
                                {isFilled.richText(primary.title_one) && (
                                    <div className="mt-2 flex items-center uppercase sm:text-[22px] md:text-[26px] text-black-900 leading-tight font-ivar-display">
                                        <PrismicRichText field={primary.title_one}/>
                                    </div>
                                )}
                                {isFilled.richText(primary.description_one) && (
                                    <div className="text-base leading-relaxed prose prose-sm max-w-none mt-2">
                                        <PrismicRichText field={primary.description_one}/>
                                    </div>
                                )}
                            </div>

                            {/* Column 2: Image Two & Description Two */}
                            <div className="flex flex-col">
                                {isFilled.image(primary.image_two) && (
                                    <PrismicNextImage
                                        field={primary.image_two}
                                        className="img-responsive"
                                    />
                                )}
                                {isFilled.richText(primary.title_two) && (
                                    <div className="mt-2 flex items-center uppercase sm:text-[22px] md:text-[26px] text-black-900 leading-tight font-ivar-display">
                                        <PrismicRichText field={primary.title_two}/>
                                    </div>
                                )}
                                {isFilled.richText(primary.description_two) && (
                                    <div className="text-base leading-relaxed prose prose-sm max-w-none mt-2">
                                        <PrismicRichText field={primary.description_two}/>
                                    </div>
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
                    style={{border: "2px dashed red", padding: "20px", margin: "20px 0"}}
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