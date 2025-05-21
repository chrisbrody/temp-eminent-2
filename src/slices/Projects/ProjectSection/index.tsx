// src/slices/Projects/ProjectSection/index.tsx
"use client"

import {FC, JSX, useState, useRef, useEffect, useCallback} from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { Bounded } from "@/components/Bounded";

// Import the model.json to get human-readable names
import model from "./model.json";

import type { ProjectSectionSliceBeforeAndAfterSliderPrimary } from '../../../../prismicio-types';

/**
 * Props for `ProjectSection`.
 */
export type ProjectSectionProps =
    SliceComponentProps<Content.ProjectSectionSlice>;

/**
 * Component for "ProjectSection" Slices.
 */
const ProjectSection: ({slice}: { slice: any }) => (React.JSX.Element | null) = ({ slice }) => {
    // Destructure for easier access
    const { variation, primary } = slice;

    // used in before and after slider
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Callback for mouse/touch move events for the slider
    const handleMove = useCallback((clientX: number) => {
        if (containerRef.current) {
            const { left, width } = containerRef.current.getBoundingClientRect();
            let newPosition = ((clientX - left) / width) * 100;
            newPosition = Math.max(0, Math.min(100, newPosition));
            setSliderPosition(newPosition);
        }
    }, []);

    // Mouse event handlers for the slider
    const onMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            handleMove(e.clientX);
        }
    }, [isDragging, handleMove]);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Touch event handlers for the slider
    const onTouchStart = useCallback((e: React.TouchEvent) => {
        setIsDragging(true);
    }, []);

    const onTouchMove = useCallback((e: TouchEvent) => {
        if (isDragging && e.touches.length > 0) {
            handleMove(e.touches[0].clientX);
        }
    }, [isDragging, handleMove]);

    const onTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Effect to add/remove global event listeners for slider dragging
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('touchend', onTouchEnd);
            window.addEventListener('touchcancel', onTouchEnd);
        } else {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('touchcancel', onTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('touchcancel', onTouchEnd);
        };
    }, [isDragging, onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

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
                                <div className={slice.primary.tag ? "w-[70%]" : "w-[100%]"}>
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
                                {isFilled.keyText(primary.tag) && (
                                    <div className="w-[30%]">
                                        <div className="flex items-center mt-15 justify-end">
                                            <div className="w-24 border-t border-solid border-gold-900 ml-6 mr-4"></div>
                                            <p className="font-serif text-sm text-gold-900 min-w-fit font-gtAmerica">{primary.tag}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Bounded>
                </section>
            );

        case "fullWidthText": // Image and Text width 100%
        case "imageAndTextWidth80": // Image and Text width 80%
            return (
                <section {...sectionBaseProps} aria-label={slice.variation === "imageAndTextWidth80" ? "Image and Text width 80%" : "Image and Text width 100%"}>
                    <Bounded widthClass={slice.variation === "imageAndTextWidth80" ? "max-w-5xl" : "max-w-6xl"}>
                        {isFilled.image(primary.image) && (
                            <PrismicNextImage
                                field={primary.image}
                                className=""
                                imgixParams={{ar: "4:3", fit: "crop"}}
                            />
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

        case "beforeAndAfterSlider":
            const sliderPrimary = primary as ProjectSectionSliceBeforeAndAfterSliderPrimary;

            // Check if images are filled for the slider
            const beforeImage = sliderPrimary.before_image;
            const afterImage = sliderPrimary.after_image;

            if (!isFilled.image(beforeImage) || !isFilled.image(afterImage)) {
                console.warn("BeforeAfterSlider variation: Missing 'before_image' or 'after_image'.");
                return null; // Or render a fallback message
            }

            return (
                <section
                    {...sectionBaseProps}
                    aria-label="Before and After Slider"
                    className="relative w-full max-w-4xl mx-auto my-12 px-4 md:px-6 lg:px-8" // Adjusted styling
                >
                    {isFilled.richText(sliderPrimary.heading) && (
                        <div className="text-center mb-6">
                            <PrismicRichText
                                field={sliderPrimary.heading}
                                components={{
                                    heading1: ({ children }) => <h2 className="text-3xl md:text-4xl font-bold text-charcoal">{children}</h2>,
                                    heading2: ({ children }) => <h2 className="text-2xl md:text-3xl font-bold text-charcoal">{children}</h2>,
                                }}
                            />
                        </div>
                    )}

                    <div
                        ref={containerRef}
                        className="relative w-full aspect-video overflow-hidden rounded-lg shadow-xl select-none"
                        onMouseDown={(e) => {
                            if (containerRef.current) {
                                const { left } = containerRef.current.getBoundingClientRect();
                                setSliderPosition(((e.clientX - left) / containerRef.current.offsetWidth) * 100);
                            }
                            onMouseDown(e);
                        }}
                        onTouchStart={(e) => {
                            if (containerRef.current && e.touches.length > 0) {
                                const { left } = containerRef.current.getBoundingClientRect();
                                setSliderPosition(((e.touches[0].clientX - left) / containerRef.current.offsetWidth) * 100);
                            }
                            onTouchStart(e);
                        }}
                    >
                        {/* After Image (full width, behind before image) */}
                        <PrismicNextImage
                            field={afterImage}
                            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                            imgixParams={{ ar: "16:9", fit: "crop" }}
                        />

                        {/* Before Image (clipped by its parent div) */}
                        <div
                            style={{ width: `${sliderPosition}%` }}
                            className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none"
                        >
                            <PrismicNextImage
                                field={beforeImage}
                                className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                                imgixParams={{ ar: "16:9", fit: "crop" }}
                            />
                        </div>

                        {/* Slider Handle */}
                        <div
                            style={{ left: `calc(${sliderPosition}% - 16px)` }}
                            className={`absolute top-0 bottom-0 w-8 cursor-ew-resize z-10 flex items-center justify-center transition-colors duration-200 ${
                                isDragging ? 'bg-gray-300' : 'bg-transparent'
                            }`}
                            onMouseDown={onMouseDown}
                            onTouchStart={onTouchStart}
                            role="slider"
                            aria-valuenow={sliderPosition}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Image comparison slider"
                        >
                            <div className="w-8 h-8 rounded-full bg-white shadow-md border-2 border-gray-400 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-4 4v4m-8-8h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {isFilled.richText(sliderPrimary.caption) && (
                        <div className="text-center mt-6 text-gray-700">
                            <PrismicRichText field={sliderPrimary.caption} />
                        </div>
                    )}
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